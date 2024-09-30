const express = require("express");
require("dotenv").config();
const connect = require("../config/database");
//CONNECT TO DB
connect();
const userRoute = require("./routes/userRoute/useRoute");
const cardRoute = require("../src/routes/cardRoutes/cardsRoute");
const app = express();
app.use(express.json());
app.use("/user", userRoute);
app.use("/card", cardRoute);
app.get("/", (req, res) => {
  console.log("hello world");
  res.status(200).json({
    message: "Hello world",
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
