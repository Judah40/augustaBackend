import { Schema, model } from "mongoose";

const cardSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  cardNumber: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  cvv: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  cardType: { type: String, required: false },
  ZipCode: { type: String, required: false },
});

const card = model("card", cardSchema);

export default card;
