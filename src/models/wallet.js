import { Schema, model } from "mongoose";

const walletSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  walletName: { type: Schema.Types.String, required: true },
  currency: { type: String, required: true },
  WalletBalance: {
    type: Schema.Types.Decimal128,
    required: true,
    default: 0.0,
  },
  walletStatus: { type: Boolean, required: true },
  expiryDate: { type: Date, required: true },
});

const wallet = model("wallet", walletSchema);

export default wallet;
