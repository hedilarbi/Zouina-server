const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  promo_codes: [
    {
      code: {
        type: Schema.Types.ObjectId,
        ref: "Promotion",
      },
      is_used: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = model("Client", clientSchema);
