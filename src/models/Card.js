const mongoose = require("mongoose");

const date = new Date()
const cardSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  cardNumber: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  cvv: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  cardType: { type: String, required: false },
  ZipCode: { type: String, required: false },
});

const card = mongoose.model("card", cardSchema);

module.exports = card;
