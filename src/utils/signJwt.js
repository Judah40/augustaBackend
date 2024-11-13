import { jwtSecret } from "../config/default.config.js";
import pkg from 'jsonwebtoken';
const { sign } = pkg;
const generateUsersJwtAccessToken = (user) => {
  try {
    return sign({ userId: user }, jwtSecret, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default generateUsersJwtAccessToken;
