const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  sub_category: String,
  type: {
    type: String,
    default: null,
  },
  name: String,
  description: String,
  price: Number,
  duration: [Number],
  image: String,
});

module.exports = model("Service", serviceSchema);
