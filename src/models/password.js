const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default:null },
  password: { type: String , required:true},
},  {
  timestamps: true,
});

const password = mongoose.model("Password", passwordSchema);
module.exports = password;
