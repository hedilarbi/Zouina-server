const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  image: String,
});

module.exports = model("Image", imageSchema);
