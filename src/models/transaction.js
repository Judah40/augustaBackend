const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  walletName: { type: mongoose.Schema.Types.String, required: true },
  currency: { type: String, required: true },
  WalletBalance: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0.0,
  },
  walletStatus: { type: Boolean, required: true },
  expiryDate: { type: Date, required: true },
});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;
