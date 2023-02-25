const Prestation = require("../models/Prestation");
const mongoose = require("mongoose");
const generateDate = require("../utils/generateDate");
const { Expo } = require("expo-server-sdk");

const createPrestation = async (req, res) => {
  const {
    services,
    client_id,
    professional_id,
    total_price,
    type,
    time,
    date,
  } = req.body;

  let new_date = null;
  if (time != "" && date != "") {
    new_date = generateDate(time, date);
  }

  const newPrestation = new Prestation({
    services,
    client: client_id,
    professional: professional_id,
    total_price,
    createdAt: new Date().toISOString(),
    type,
    schedual_date: new_date,
  });

  try {
    const professional = await mongoose.models.Professional.findById(
      professional_id
    ).populate({ path: "user", select: "expo_token full_name" });

    const response = await newPrestation.save();

    const expo_token = professional.user.expo_token;
    const expo = new Expo();
    let message = {};

    if (type === "Schedual") {
      message = {
        to: expo_token,
        sound: "default",
        body: `Vous avez reçu une nouvelle demande de rendez-vous, le ${new_date.toLocaleDateString()} à ${new_date
          .toLocaleTimeString()
          .slice(0, 5)} `,
        data: {
          prestationId: response._id,
          type,
        },
        title: "Rendez-vous",
        categoryId: "myCategor",

        priority: "high",
      };
    } else {
      message = {
        to: expo_token,
        sound: "default",
        body: `une demande de préstation vous a été envoyé`,
        data: {
          prestationId: response._id,
          type,
        },
        title: "Maintenant",
        categoryId: "myCategor",

        priority: "high",
      };
    }

    const ticket = await expo.sendPushNotificationsAsync([message]);

    res.status(200).json({
      prestation: response,
      ticket: ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getImmediateClientPrestations = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Prestation.find({
      client: id,
      state: "done",
      type: "Immediately",
    })
      .select("services finishedAt total_price")
      .populate({
        path: "services.service",
        model: "Service",
        select: "category",
        populate: {
          path: "category",
          select: "name",
        },
      });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScheduledClientPrestations = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.find({
      client: id,
      $or: [{ state: "done" }, { state: "canceled" }, { state: "accepted" }],
      type: "Schedual",
    })
      .select("services state finishedAt schedual_date total_price")
      .populate({
        path: "services.service",
        model: "Service",
        select: "category",
        populate: {
          path: "category",
          select: "name",
        },
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getImmediateProfessionalPrestations = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Prestation.find({
      professional: id,
      $or: [{ state: "done" }, { state: "refused" }],
      state: "done",
      type: "Immediately",
    })
      .select("client state createdAt total_price")
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "full_name",
        },
      });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScheduledProfessionalPrestations = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.find({
      professional: id,
      type: "Schedual",
      $or: [{ state: "done" }, { state: "refused" }, { state: "canceled" }],
    })
      .select("state client createdAt schedual_date total_price")
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "full_name",
        },
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAcceptedScheduledProfessionalPrestations = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.find({
      professional: id,
      type: "Schedual",
      state: "accepted",
    })
      .select("schedual_date total_price")
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "full_name",
        },
      });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfessionalPrestation = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.findById(id)
      .select("services state schedual_date createdAt total_price type")
      .populate([
        {
          path: "services.service",
          model: "Service",
          select: "category name price",
          populate: {
            path: "category",
            select: "name",
          },
        },
        {
          path: "client",
          select: "user",
          populate: {
            path: "user",
            model: "User",
            select: "full_name image",
          },
        },
      ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrestation = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.findById(id)
      .select("services state finishedAt schedual_date total_price type")
      .populate([
        {
          path: "services.service",
          model: "Service",
          select: "category name price",
          populate: {
            path: "category",
            select: "name",
          },
        },
        {
          path: "professional",
          select: "user rating",
          populate: {
            path: "user",
            model: "User",
            select: "full_name image",
          },
        },
      ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrestationByID = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Prestation.findById(id)
      .select("services type client total_price")
      .populate([
        { path: "services.service", model: "Service", select: "name price" },
        {
          path: "client",
          populate: {
            path: "user",
            select: "full_name phone_number image location address",
          },
        },
      ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewPrestation = async (req, res) => {
  const { comment, rate } = req.body;

  const { id } = req.params;

  try {
    const response = await Prestation.findById(id);

    if (rate < 1) {
      await Prestation.findByIdAndUpdate(
        id,
        { "review.comment": comment },
        { new: true }
      );

      const newComment = {
        client: response.client,
        prestation: id,
        comment: comment,
      };
      await mongoose.models.Professional.findByIdAndUpdate(
        response.professional,
        {
          $push: { comments: newComment },
          review_status: true,
        },
        { new: true }
      );
      res.json({ message: "done" });
    } else if (comment.length === 0) {
      await Prestation.findByIdAndUpdate(
        id,
        { "review.rate": rate, review_status: true },
        { new: true }
      );
      const professional = await mongoose.models.Professional.findById(
        response.professional
      ).select("rating");

      const newRating =
        (professional.rating.rate * professional.rating.rating_number + rate) /
        (professional.rating.rating_number + 1);

      await mongoose.models.Professional.findByIdAndUpdate(
        professional,
        {
          "rating.rate": newRating,
          "rating.rating_number": professional.rating.rating_number + 1,
        },
        { new: true }
      );
      res.json({ message: "done" });
    } else {
      const newReview = {
        rate: rate,
        comment: comment,
      };

      const response = await Prestation.findByIdAndUpdate(
        id,
        { review: newReview, review_status: true },
        { new: true }
      );

      const professional = await mongoose.models.Professional.findById(
        response.professional
      ).select("rating");

      const newRating =
        (professional.rating.rate * professional.rating.rating_number + rate) /
        (professional.rating.rating_number + 1);

      const newComment = {
        client: response.client,
        prestation: id,
        comment: comment,
      };
      await mongoose.models.Professional.findByIdAndUpdate(
        response.professional,
        {
          "rating.rate": newRating,
          "rating.rating_number": professional.rating.rating_number + 1,
          $push: { comments: newComment },
        },
        { new: true }
      );
      res.json({ message: "done" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptPrestation = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Prestation.findByIdAndUpdate(
      id,
      {
        state: "accepted",
        acceptedAt: new Date().toISOString(),
      },
      { new: true }
    );
    if (response.type === "Immediately") {
      await mongoose.models.Professional.findByIdAndUpdate(
        response.professional,
        { on_job: true },
        { new: true }
      );
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const refusePrestation = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Prestation.findByIdAndUpdate(
      id,
      {
        state: "refused",
        refusedAt: new Date().toISOString(),
      },
      { new: true }
    );

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const finishedPrestation = async (req, res) => {
  const { id } = req.params;

  try {
    const { total_price } = await Prestation.findById(id);
    const response = await Prestation.findByIdAndUpdate(
      id,
      {
        state: "done",
        finishedAt: new Date().toISOString(),
        review_status: false,
      },
      { new: true }
    );
    await mongoose.models.Professional.findByIdAndUpdate(
      response.professional,
      { on_job: false, $inc: { balance: total_price } },

      { new: true }
    );

    const client = await mongoose.models.Client.findById(response.client)
      .populate({ path: "user", select: "expo_token" })
      .select("user");
    const { expo_token } = client.user;
    if (expo_token) {
      const expo = new Expo();

      const message = {
        to: expo_token,
        sound: "default",
        body: "prestation fini ",

        title: "Fin de prestation",

        priority: "high",
      };
      const ticket = await expo.sendPushNotificationsAsync([message]);
    }

    res.json({ message: "done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const cancelPrestation = async (req, res) => {
  const { id } = req.params;

  try {
    await Prestation.findByIdAndUpdate(
      id,
      {
        state: "canceled",
        cancledAt: new Date().toISOString(),
      },
      { new: true }
    );
    res.json({ message: "done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPrestationReviewState = async (req, res) => {
  const { id } = req.params;
  try {
    const { review_status, state, type, at_destination } =
      await Prestation.findById(id);

    res.json({ review_status, state, type, at_destination });
  } catch (error) {
    res.status(500).status(500).json({ message: error.message });
  }
};

const professionalAtDestination = async (req, res) => {
  const { id } = req.params;
  try {
    await Prestation.findByIdAndUpdate(id, { at_destination: true });
    res.json({ message: "done" });
  } catch (error) {
    res.status(500).son({ message: error.message });
  }
};

module.exports = {
  createPrestation,
  acceptPrestation,
  refusePrestation,
  finishedPrestation,
  cancelPrestation,
  getPrestationByID,
  getImmediateClientPrestations,
  getScheduledClientPrestations,
  getPrestation,
  getImmediateProfessionalPrestations,
  getScheduledProfessionalPrestations,
  getProfessionalPrestation,
  reviewPrestation,
  getAcceptedScheduledProfessionalPrestations,
  getPrestationReviewState,
  professionalAtDestination,
};
