const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  full_name: {
    type: String,
    default: null,
  },
  phone_number: String,
  email: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  birthday: {
    type: Date,
    default: null,
  },
  password: String,
  address: {
    type: String,
  },
  location: {
    longitude: Number,
    latitude: Number,
  },
  account_type: String,
  is_profile_setup: {
    type: Boolean,
    default: false,
  },
  expo_token: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
