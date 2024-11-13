require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/userRoute/useRoute");
const cardRoute = require("../src/routes/cardRoutes/cardsRoute");
const walletRoute = require("../src/routes/walletRoute/walletRoute");
const { requireAuthenticatedUser } = require("./middlewares/auth.middleware");

const app = express();
app.use(express.json());
//user plural for routes e.g (/users, /cards)
app.use("/users", userRoute);
app.use("/cards", requireAuthenticatedUser, cardRoute);
app.use("/wallet", requireAuthenticatedUser, walletRoute);


module.exports = app;
