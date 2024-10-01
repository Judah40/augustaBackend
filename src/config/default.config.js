require("dotenv").config();
const {
  APP_PORT,
  APP_URL,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  JWT_SECRET,
} = process.env;
module.exports = {
  appPort: APP_PORT,
  dbUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  appUrl: APP_URL,
  jwtSecret: JWT_SECRET,
};
