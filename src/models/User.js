const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    nationalId: { type: String, required: true },
    otp: { type: String },

    // Reference to the Password model
    passwordRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "password", // Links to Password model
      default: null, // Initially null, will be updated after password setup
    },
    PhoneVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user; //export the model to use in other files
