const { Schema, model, Types } = require("mongoose");
const { Schema, model } = require("mongoose");

const paiementSchema = new Schema({
  professional: {
    type: Schema.Types.ObjectId,
    ref: "Professional",
  },
  amount: Number,
  createdAt: Date,
});

module.exports = new model("Paiement", paiementSchema);
