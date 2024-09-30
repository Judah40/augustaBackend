const express = require("express");
const validator = require("../../utils/Validators");
const otpgenerated = require("../../utils/generateOTP");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordModel = require("../../models/password");
const router = express.Router();
const user = require("../../models/User");
//USER ROUTES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sign up
router.post("/register", async (req, res) => {
  let { fristName, LastName, DateOfBirth, Address, Id, phoneNumber } = req.body;
  const valid = validator.registerValidator(
    fristName,
    LastName,
    DateOfBirth,
    Address,
    Id,
    phoneNumber
  );

  try {
    if (valid.error) {
      return res
        .status(400)
        .json({ statusCode: 400, error: valid.error.details[0].message });
    } else {
      const otp = otpgenerated();
      user
        .create({
          fristName,
          LastName,
          DateOfBirth,
          Address,
          Id,
          phoneNumber,
          otp,
        })
        .then((response) => {
          return res.status(201).json({
            message: `user sucessfully created, verified user with otp below ${response.phoneNumber}`,
            OTP: otpgenerated,
            user: response,
            statusCode: 201,
          });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message, statusCode: 400 });
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//verify otp

router.post("/verifyOTP", async (req, res) => {
  try {
    const { otp } = req.body;
    const User = await user.findOneAndUpdate(
      { otp },
      { PhoneVerified: true },
      { new: true }
    );
    if (!User) {
      return res.status(400).json({ message: "Invalid OTP", statusCode: 404 });
    } else {
      const token = jwt.sign({ id: User._id }, "your-secret-key", {
        expiresIn: "1hr",
      });
      res.json({ message: "Phone Number Verified", token: token });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//setup password
router.post("/setup-password", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or incorrect format." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer token"})

  const decoded = jwt.decode(token, "your-secret-key", { complete: true });
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (decoded) {
    // res.status(200).json({ decode:decoded.id });
    await passwordModel
      .create({
        userId: decoded.id,
        password: hashedPassword,
      })
      .then(async (response) => {
        const UserPass = await user
          .findOneAndUpdate(
            { _id: decoded.id },
            { passwordRef: response._id },
            { new: true }
          )
          .then(() => {
            return res.status(201).json({
              message: "password successfully created",
              statusCode: 201,
            });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ message: err.message, statusCode: 500 });
          });
      })
      .catch((error) => {
        res.send(error.message);
      });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sign in
router.post("/login", async (req, res) => {
  const { PhoneNumber, password } = req.body;

  const valid = validator.signinVlidator(PhoneNumber, password);
  if (valid.error) {
    return res
      .status(400)
      .json({ statusCode: 400, error: valid.error.details[0].message });
  } else {
    try {
      const users = await user.findOne({ phoneNumber: PhoneNumber });
      if (!users) {
        return res.status(400).json({ error: "Invalid phone number " });
      }
      const passWordValidation = await passwordModel.findOne({
        userId: users._id,
      });
      const isPasswordValid = await bcrypt.compare(
        password,
        passWordValidation.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password." });
      }
      // Step 4: Generate JWT token
      const token = jwt.sign({ id: users._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      // res.json({ message: isPasswordValid });

      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: error.message, statusCode: 500 });
    }
  }
});
module.exports = router;
