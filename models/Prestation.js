const { Schema, model } = require("mongoose");

const prestationSchema = new Schema({
  services: [
    {
      service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
      quantity: Number,
    },
  ],
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  professional: {
    type: Schema.Types.ObjectId,
    ref: "Professional",
  },
  total_price: Number,
  state: {
    type: String,
    default: "pending",
  },
  createdAt: Date,
  finishedAt: {
    type: Date,
    default: null,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
  refusedAt: {
    type: Date,
    default: null,
  },
  cancledAt: {
    type: Date,
    default: null,
  },
  schedual_date: {
    type: Date,
    default: null,
  },
  type: String,
  review: {
    comment: String,
    rate: Number,
  },
  review_status: Boolean,
  at_destination: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Prestation", prestationSchema);
