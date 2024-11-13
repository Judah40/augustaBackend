import app from './app.js'; // Make sure to include the '.js' extension
import connectDB from "./config/database.js";

const startServer = async () => {
  connectDB(app);
};

startServer();
