const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const defaultSchedual = require("../utils/defaultSchedual");

const createUser = async (req, res) => {
  const { phone_number, password, account_type, expo_token } = req.body;

  try {
    const verifyPhone = await User.findOne({ phone_number });
    if (verifyPhone) {
      return res
        .status(403)
        .json({ message: "Un compte existe déja avec ce numéro" });
    }
  } catch (error) {
    return res.status(402).json({ message: error.message });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    password: hashedPassword,
    phone_number,
    account_type,
    expo_token,
    createdAt: new Date().toISOString(),
  });
  try {
    let data;
    const user = await newUser.save();

    const token = generateToken(user._id, user.account_type);

    switch (account_type) {
      case "client":
        const newClient = new mongoose.models.Client({
          user: user.id,
        });
        data = await newClient.save();
        break;
      case "professional":
        const newProfessional = new mongoose.models.Professional({
          user: user.id,
          schedual: defaultSchedual,
        });

        data = await newProfessional.save();

        break;
    }

    res.status(201).json({ user, data, token });
  } catch (error) {
    res.status(500).status({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { phone_number, password, expo_token } = req.body;

  let data;
  try {
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(401).json({ message: "compte n'existe pas" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "mot de passe erroné" });
    }
    const token = generateToken(user._id, user.account_type);

    switch (user.account_type) {
      case "client":
        data = await mongoose.models.Client.findOne({ user: user._id });
        break;
      case "professional":
        data = await mongoose.models.Professional.findOne({ user: user._id });
        break;
    }
    await User.findOneAndUpdate(
      { phone_number },
      { expo_token },
      { new: true }
    );

    res.status(200).json({ user, data, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUserProfile = async (req, res) => {
  let firebaseUrl = null;
  if (req.file) {
    firebaseUrl = req.file.firebaseUrl;
  }

  const { id } = req.params;
  const { name, email, birthday } = req.body;

  let formatedBirthday = null;
  if (birthday) {
    formatedBirthday = new Date(birthday);
  }
  try {
    const response = await User.findByIdAndUpdate(
      id,
      {
        image: firebaseUrl,
        email,
        full_name: name,
        birthday: formatedBirthday,
        is_profile_setup: true,
      },
      { new: true }
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserByToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let data;
  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    switch (decodedData.account_type) {
      case "client":
        data = await mongoose.models.Client.findOne({
          user: decodedData.id,
        }).populate("user");
        break;
      case "professional":
        data = await mongoose.models.Professional.findOne({
          user: decodedData.id,
        }).populate("user");
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { new_password, old_password } = req.body;
  try {
    const user = await User.findById(id);
    const validPassword = await bcrypt.compare(old_password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "mot de passse incorrecte" });
    }
    const hashedPassword = await bcrypt.hash(new_password, 12);
    const data = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(202).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, location } = req.body;
  try {
    const response = await User.findByIdAndUpdate(
      id,
      { address, location },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        expo_token: null,
      },
      { new: true }
    );
    if (user.account_type === "professional") {
      await mongoose.models.Professional.findOneAndUpdate(
        { user: user._id },
        { availability: false },
        { new: true }
      );
    }
    res.json({ message: "expo token removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserByToken,
  updatePassword,
  updateUser,
  updateUserProfile,
  updateAddress,
  logout,
};
