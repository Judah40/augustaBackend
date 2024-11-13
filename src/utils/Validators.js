// const Joi = require("joi");
import Joi from "joi";
const date = new Date();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SCHEMA

//resgiter schema
const Registerschema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  dateOfBirth: Joi.date().less(date).required(), // Date before today
  address: Joi.string().required(),
  nationalId: Joi.string().alphanum().length(10).required(), // Example: ID as alphanumeric and 10 characters long
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{9}$/)
    .required(), // 10-digit number
});
//sign in schema
const Signinschema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{9}$/)
    .required(), // 10-digit number
  password: Joi.string().min(8).max(30).required(),
});

//card schema
const cardSchema = Joi.object({
  cardNumber: Joi.string().length(16).required(),
  expiryDate: Joi.date().greater(date).required(), // Date after today
  cvv: Joi.string().length(3).required(),
  cardHolderName: Joi.string().min(2).max(30).required(),
  cardType: Joi.string().required(),
  zipCode: Joi.string(),
});

//wallet schema validation

const walletSchema = Joi.object({
  walletName: Joi.string().required(),
  currency: Joi.string().length(3).required(), // assuming currency is a 3-letter code like 'USD'
  WalletBalance: Joi.number().min(0).required(),
  walletStatus: Joi.boolean().required(), // walletStatus as a boolean
  expiryDate: Joi.date().greater("now").optional(), // expiry date should be in the future
});

const transactionSchema = Joi.object({
  transactionAmount: Joi.number()
    .positive()
    .required()
    .label("Transaction Amount")
    .messages({
      "number.base": '"Transaction Amount" must be a number',
      "number.positive": '"Transaction Amount" must be a positive number',
      "any.required": '"Transaction Amount" is required',
    }),

  transactionType: Joi.string()
    .valid("deposit", "withdrawal", "transfer", "payment")
    .required()
    .label("Transaction Type")
    .messages({
      "any.only":
        '"Transaction Type" must be one of [deposit, withdrawal, transfer, payment]',
      "any.required": '"Transaction Type" is required',
    }),

  transactionDateTime: Joi.date()
    .iso()
    .required()
    .label("Transaction Date and Time")
    .messages({
      "date.base": '"Transaction Date and Time" must be a valid ISO date',
      "any.required": '"Transaction Date and Time" is required',
    }),

  transactionStatus: Joi.string()
    .valid("successful", "pending", "failed")
    .required()
    .label("Transaction Status")
    .messages({
      "any.only":
        '"Transaction Status" must be one of [successful, pending, failed]',
      "any.required": '"Transaction Status" is required',
    }),

  transactionDescription: Joi.string()
    .max(255)
    .optional()
    .allow("")
    .label("Transaction Description")
    .messages({
      "string.max":
        '"Transaction Description" must be less than or equal to 255 characters',
    }),

  appFee: Joi.number().positive().required().label("App Fee").messages({
    "number.base": '"App Fee" must be a number',
    "number.positive": '"App Fee" must be a positive number',
    "any.required": '"App Fee" is required',
  }),

  totalAmount: Joi.number()
    .positive()
    .required()
    .label("Total Amount")
    .messages({
      "number.base": '"Total Amount" must be a number',
      "number.positive": '"Total Amount" must be a positive number',
      "any.required": '"Total Amount" is required',
    }),

  transactionFrom: Joi.string().required().label("Transaction From").messages({
    "string.base": '"Transaction From" must be a string',
    "any.required": '"Transaction From" is required',
  }),

  transactionTo: Joi.string().required().label("Transaction To").messages({
    "string.base": '"Transaction To" must be a string',
    "any.required": '"Transaction To" is required',
  }),
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTION

//sign up
const registerValidator = (
  firstName,
  lastName,
  dateOfBirth,
  address,
  nationalId,
  phoneNumber
) => {
  const data = {
    firstName,
    lastName,
    dateOfBirth,
    address,
    nationalId,
    phoneNumber,
  };
  const value = Registerschema.validate(data);
  return value;
};

//sign in
const signinVlidator = (req, res, next) => {
  const { error } = Signinschema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

//card
const cardValidator = (
  cardNumber,
  expiryDate,
  cvv,
  cardHolderName,
  cardType,
  zipCode
) => {
  const data = {
    cardNumber,
    expiryDate,
    cvv,
    cardHolderName,
    cardType,
    zipCode,
  };
  const value = cardSchema.validate(data);
  return value;
};

//wallet validator
const walletValidator = (
  walletName,
  currency,
  WalletBalance,
  walletStatus,
  expiryDate
) => {
  const data = {
    walletName,
    currency,
    WalletBalance,
    walletStatus,
    expiryDate,
  };
  const value = walletSchema.validate(data);
  return value;
};

//transaction validator
const transactionValidator = (
  transactionAmount,
  transactionType,
  transactionDateTime,
  transactionStatus,
  transactionDescription,
  appFee,
  totalAmount,
  transactionFrom,
  transactionTo
) => {
  const data = {
    transactionAmount,
    transactionType,
    transactionDateTime,
    transactionStatus,
    transactionDescription,
    appFee,
    totalAmount,
    transactionFrom,
    transactionTo,
  };
  const value = transactionSchema.validate(data);
  return value;
};
export default {
  registerValidator,
  signinVlidator,
  cardValidator,
  walletValidator,
  transactionValidator,
};
