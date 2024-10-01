const express = require("express");
const validator = require("../../utils/Validators");
const card = require("../../models/Card");
const route = express.Router();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//add card

// TODO -> CREATE A SPERATE CONTROLLER FILE
route.post("/addcard", async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv, cardHolderName, cardType, zipCode } =
      req.body;
    const { userId } = req.user;

    const valid = validator.cardValidator(
      cardNumber,
      expiryDate,
      cvv,
      cardHolderName,
      cardType,
      zipCode
    );
    if (valid.error) {
      return res
        .status(400)
        .json({ statusCode: 400, error: valid.error.details[0].message });
    }

    const existingCard = await card.findOne({ cardNumber: cardNumber });
    if (existingCard) {
      return res.status(400).json({
        statusCode: 400,
        error: "Card already exists",
      });
    }

    card
      .create({
        userId,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        cardHolderName: cardHolderName,
        cardType: cardType,
        zipCode: zipCode,
      })
      .then((response) => {
        return res.status(201).json({
          message: `card sucessfully Added`,
          user: response,
          statusCode: 201,
        });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message, statusCode: 400 });
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      statusCode: 500,
    });
  }
});
//update card
route.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.user;

    const { cardNumber, expiryDate, cvv, cardHolderName, cardType, zipCode } =
      req.body;
    const valid = validator.cardValidator(
      cardNumber,
      expiryDate,
      cvv,
      cardHolderName,
      cardType,
      zipCode
    );
    if (valid.error) {
      return res
        .status(400)
        .json({ statusCode: 400, error: valid.error.details[0].message });
    }
    const update = await card.findOneAndUpdate(
      { _id: id, userId },
      {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        cardHolderName: cardHolderName,
        cardType: cardType,
        zipCode: zipCode,
      },
      { returnOriginal: false } // Option: return the updated document
    );
    // If no card was found, return 404
    if (!update) {
      return res.status(404).json({
        message: "Card not found",
        statusCode: 404,
      });
    }

    // Return the updated card
    return res.status(200).json({
      message: "Card updated successfully",
      card: update,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//delete card
route.delete("/delete/:id", async (req, res) => {
  try {
    const { userId } = req.user;
    const id = req.params.id;
    const Card = await card.findOneAndDelete({ _id: id, userId });
    if (!Card) {
      return res.status(404).json({
        message: "Card not found",
        statusCode: 404,
      });
    }
    // Return a success message with the deleted card
    return res.status(200).json({
      message: "Card deleted successfully",
      card: Card,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//get all cards
route.get("/all", async (req, res) => {
  try {
    const { userId } = req.user;

    const allCards = await card.find({ userId });

    res.status(200).json({
      message: "All Cards",
      Cards: allCards,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//get card by id
route.get("/:id", async (req, res, next) => {
  try {
    const { userId } = req.user;
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Card Id",
        statusCode: 400,
      });
    }
    const singleCard = await card.findOne({ _id: id, userId });

    if (!singleCard) {
      return res.status(404).json({
        message: "Card not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "Card found",
      card: singleCard,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = route;
