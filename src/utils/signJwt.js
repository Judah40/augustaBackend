const { jwtSecret } = require("../config/default.config");
const jwt = require("jsonwebtoken");

const generateUsersJwtAccessToken = (user) => {
  try {
    return jwt.sign({ userId: user }, jwtSecret, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = generateUsersJwtAccessToken;
