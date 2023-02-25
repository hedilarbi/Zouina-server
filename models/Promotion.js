const { Schema, model } = require("mongoose");

const PromotionSchema = new Schema({
  name: String,
  value: Number,
  description: String,
});

module.exports = new model("Promotion", PromotionSchema);
