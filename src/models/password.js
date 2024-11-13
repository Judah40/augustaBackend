import mongoose from "mongoose";

// const mongoose = require("mongoose");
// iport mongoose

const passwordSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const passwordModel = mongoose.model("Password", passwordSchema);
export default passwordModel;
