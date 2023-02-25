const { Schema, model } = require("mongoose");

const professionalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  gallery: [String],
  specialities: [String],
  availability: {
    type: Boolean,
    default: false,
  },
  schedual: [
    {
      day: String,
      morning_session: {
        open: Date,
        close: Date,
      },
      afternoon_session: {
        open: Date,
        close: Date,
      },
      state: {
        type: Boolean,
        default: false,
      },
    },
  ],
  account_info: {
    status: {
      type: Boolean,
      default: true,
    },
    activation_date: Date,
  },
  rating: {
    rate: {
      type: Number,
      default: 1,
    },
    rating_number: {
      type: Number,
      default: 0,
    },
  },
  comments: [
    {
      client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
      prestation: {
        type: Schema.Types.ObjectId,
        ref: "Prestation",
      },

      comment: String,
    },
  ],
  on_job: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  paiements: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paiement",
    },
  ],
});

module.exports = model("Professional", professionalSchema);
