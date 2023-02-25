const Professional = require("../models/Professional");
const fetch = require("node-fetch");
require("dotenv/config");

const getTimePart = (date) => {
  return date.getHours() * 3600 + date.getMinutes() * 60;
};

const updateProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Professional.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableProfessionals = async (req, res) => {
  const { date, time, speciality, latitude, longitude } = req.query;

  let data = [];

  try {
    if (!date || !time) {
      data = await Professional.find({
        availability: true,
        account_info: { status: true },
        on_job: false,
        specialities: speciality,
      }).populate({ path: "user", select: "full_name image location" });
    } else {
      const day = new Date(date);
      const newTime = new Date(time);
      const dayName = day.toLocaleDateString("fr-FR", { weekday: "long" });

      const response = await Professional.find({
        availability: true,
        account_info: { status: true },
        specialities: speciality,
        schedual: {
          $elemMatch: {
            day: dayName,
            state: true,
          },
        },
      }).populate({ path: "user", select: "full_name image location" });

      if (response.length != 0) {
        response.map((professional) => {
          professional.schedual.map((workingDay) => {
            if (workingDay.day === dayName) {
              const morningOpen = getTimePart(workingDay.morning_session.open);
              const morningClose = getTimePart(
                workingDay.morning_session.close
              );
              const afterNoonOpen = getTimePart(
                workingDay.afternoon_session.open
              );
              const afterNoonClose = getTimePart(
                workingDay.afternoon_session.close
              );

              const time0 =
                (newTime.getHours() + 1) * 3600 + newTime.getMinutes() * 60;

              if (
                (time0 >= morningOpen && time0 < morningClose) ||
                (time0 >= afterNoonOpen && time0 < afterNoonClose)
              ) {
                data.push(professional);
              }
            }
          });
        });
      }
    }

    data = await setMetrics(data, latitude, longitude);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfessionalByID = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Professional.findById(id)
      .select("user gallery specialities comments rating")
      .populate([
        { path: "user", select: "full_name image" },
        {
          path: "comments",
          populate: {
            path: "client",
            populate: { path: "user", select: "full_name image" },
          },
        },
      ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSchedual = async (req, res) => {
  const { id } = req.params;
  const schedual = req.body;

  try {
    const data = await Professional.findByIdAndUpdate(
      id,
      { schedual: schedual },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "error from update update schedual" });
  }
};

const professionalSetupProProfile = async (req, res) => {
  let schedual = [];
  let specialities = [];
  let firebaseUrls = [];
  const { id } = req.params;
  if (req.files) {
    firebaseUrls = req.files.firebaseUrls;
  }

  const JsonSchedual = req.body.schedual;
  const specialitiesList = req.body.specialities;

  if (typeof specialitiesList === "object") {
    specialitiesList.map((speciality) => {
      specialities.push(speciality);
    });
  } else {
    specialities.push(specialitiesList);
  }
  JsonSchedual.map((item) => {
    schedual.push(JSON.parse(item));
  });

  try {
    const response = await Professional.findOneAndUpdate(
      { user: id },
      { gallery: firebaseUrls, specialities, schedual },
      { new: true }
    );

    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  try {
    const response = await Professional.findByIdAndUpdate(
      id,
      { availability },
      { new: true }
    ).select("availability");

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGallery = async (req, res) => {
  const { id } = req.params;
  let imagesToDelete = [];
  let firebaseUrls = [];

  if (req.files) {
    firebaseUrls = req.files.firebaseUrls;
  }
  if (req.body.toDelete) {
    if (typeof req.body.toDelete === "object") {
      imagesToDelete = req.body.toDelete;
    } else {
      imagesToDelete.push(req.body.toDelete);
    }
  }

  try {
    let response = "";
    if (firebaseUrls.length > 0) {
      response = await Professional.findByIdAndUpdate(
        id,
        {
          $push: { gallery: { $each: firebaseUrls } },
        },
        {
          new: true,
        }
      );
    }
    if (imagesToDelete.length > 0) {
      response = await Professional.findByIdAndUpdate(
        id,
        {
          $pull: { gallery: { $in: imagesToDelete } },
        },
        {
          new: true,
        }
      );
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function setMetrics(professionalsList, latitude, longitude) {
  const API_KEY = "AIzaSyDZHJsqwlavl1jvOfbaFUTcWfkooFLG0Iw";
  let newArray = [];

  let METRICS_API_URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude}%2C${longitude}&destinations=`;

  
  professionalsList.map((pro, index) => {
    if (index != professionalsList.length - 1) {
      METRICS_API_URL =
        METRICS_API_URL +
        `${pro.user.location.latitude}%2C${pro.user.location.longitude}%7C`;
    } else {
      METRICS_API_URL =
        METRICS_API_URL +
        `${pro.user.location.latitude}%2C${pro.user.location.longitude}&key=${API_KEY}`;
    }
  });

  await fetch(METRICS_API_URL)
    .then((res) => res.json())
    .then((data) => {
      professionalsList.map((pro, index) => {
        newArray.push({
          data: pro,
          metrics: {
            distance: data.rows[0].elements[index].distance.text,
            duration: data.rows[0].elements[index].duration.text,
          },
        });
      });
    })
    .catch((err) => console.log(err));

  return newArray;
}

module.exports = {
  updateProfessional,
  getAvailableProfessionals,
  getProfessionalByID,
  updateSchedual,
  professionalSetupProProfile,
  updateAvailability,
  updateGallery,
};
