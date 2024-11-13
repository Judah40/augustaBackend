const app = require("./app");
const connectDB = require("./config/database");

const startServer = async () => {
  connectDB(app);
};

startServer();
