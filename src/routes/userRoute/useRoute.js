const express = require("express");
const validator = require("../../utils/Validators");

const bcrypt = require("bcrypt");
const passwordModel = require("../../models/password");
const router = express.Router();
const userModel = require("../../models/User");
const path = require("path");

const {
  requireAuthenticatedUser,
} = require("../../middlewares/auth.middleware");
const generateUsersJwtAccessToken = require("../../utils/signJwt");
const generateOTP = require("../../utils/generateOtp");
//USER ROUTES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sign up
router.post("/register", async (req, res) => {
  try {
    let { firstName, lastName, dateOfBirth, address, nationalId, phoneNumber } =
      req.body;
    const valid = validator.registerValidator(
      firstName,
      lastName,
      dateOfBirth,
      address,
      nationalId,
      phoneNumber
    );
    if (valid.error) {
      return res
        .status(400)
        .json({ statusCode: 400, error: valid.error.details[0].message });
    }
    const otp = generateOTP();
    const phoneNumberExists = await userModel.findOne({ phoneNumber }).exec();
    if (phoneNumberExists) {
      return res.status(400).json({ message: "Phone Number Already Exist." });
    }
    const userCreated = await userModel
      .create({
        firstName,
        lastName,
        dateOfBirth,
        address,
        nationalId,
        phoneNumber,
        otp,
      })
      .catch((error) => {
        console.error("REGISTER USER ERROR: ", error);
        throw error;
      });

    if (userCreated) {
      return res.status(201).json({
        message: `User Accout Created Successfully. Verify Account with the following OTP: ${otp}`,
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

    const otpExist = await userModel.findOne({ otp }).exec();

    if (!otpExist) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again with a valid OTP" });
    }

    await userModel.findOneAndUpdate(
      { otp },
      { PhoneVerified: true, otp: "" },
      { new: true }
    );
    const userId = otpExist.id;
    const token = generateUsersJwtAccessToken(userId);

    res.status(200).json({ message: "Phone Number Verified", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//setup password
router.post("/setup-password", requireAuthenticatedUser, async (req, res) => {
  const { userId } = req.user;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await passwordModel
    .create({
      userId,
      password: hashedPassword,
    })
    .then(async (response) => {
      await userModel
        .findOneAndUpdate(
          { _id: userId },
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
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sign in
router.post("/login", validator.signinVlidator, async (req, res) => {
  const { phoneNumber, password } = req.body;

  // const valid = validator.signinVlidator(phoneNumber, password);

  // if (valid.error) {
  //   return res
  //     .status(400)
  //     .json({ statusCode: 400, error: valid.error.details[0].message });
  // }
  try {
    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Phone number or password is incorrect" });
    }
    const passWordValidation = await passwordModel.findOne({
      userId: user._id,
    });
    const isPasswordValid = await bcrypt.compare(
      password,
      passWordValidation.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Phone Number or Password is Invalid." });
    }
    // Step 4: Generate JWT token
    const token = generateUsersJwtAccessToken(user.id);

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message, statusCode: 500 });
  }
});
module.exports = router;
