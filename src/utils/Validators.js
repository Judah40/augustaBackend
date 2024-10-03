const Joi = require("joi");
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
const signinVlidator = (phoneNumber, password) => {
  const data = {
    phoneNumber,
    password,
  };
  const value = Signinschema.validate(data);
  return value;
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
module.exports = {
  registerValidator,
  signinVlidator,
  cardValidator,
  walletValidator,
};
