require("dotenv").config();
const {
  APP_PORT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  JWT_SECRET,
  MONGODB_URI,
} = process.env;
module.exports = {
  appPort: APP_PORT,
  dbUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  jwtSecret: JWT_SECRET,
  dbProductionUrl: MONGODB_URI,
};
