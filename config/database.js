const mongoose = require("mongoose");

const baseUrl = `${process.env.DB_HOST}/${process.env.DB_NAME}`;

const Connect = async () => {
  await mongoose.connect(baseUrl);
  console.log("Connected to MongoDB");
};

module.exports = Connect;
