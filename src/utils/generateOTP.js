const { jwtSecret } = require("../config/default.config");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateOTP = () => {
  // Generate a random 3-byte (6-digit) hexadecimal number
  const randomBytes = crypto.randomBytes(3);
  const randomHex = randomBytes.toString("hex");

  // Convert the hexadecimal number to decimal
  const randomDecimal = parseInt(randomHex, 16);

  // Ensure the number is six digits by taking the remainder when divided by 1,000,000
  const sixDigitNumber = randomDecimal % 1000000;

  // Ensure leading zeros are included if needed
  const formattedSixDigitNumber = String(sixDigitNumber).padStart(6, "0");

  return formattedSixDigitNumber;
};
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

module.exports = {
  generateOTP,
  generateUsersJwtAccessToken,
};
