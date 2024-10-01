const express = require("express");
const validator = require("../../utils/Validators");
const card = require("../../models/Card");
const route = express.Router();
const jwt = require("jsonwebtoken");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//add card

// TODO -> CREATE A SPERATE CONTROLLER FILE
route.post("/addcard", async (req, res) => {
  // TODO MOVE TO AUTH MIDDLEWARE FUNCTION
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or incorrect format." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer token"})

  const { cardNumber, expiryDate, cvv, cardHolderName, cardType, zipCode } =
    req.body;
  try {
    // TODO MOVE TO AUTH MIDDLEWARE FUNCTION
    const decoded = jwt.verify(token, "your-secret-key");

    // TODO MOVE TO A SEPERATE VALIDATOR FILE AND IMPORT
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
    } else {
      // TODO - HANDLE BUSINESS LOGIC IN A SERVICE FILE
      const existingCard = await card.findOne({ cardNumber: cardNumber });
      if (existingCard) {
        return res.status(400).json({
          statusCode: 400,
          error: "Card already exists",
        });
      }

      // TODO use async/await
      card
        .create({
          userId: decoded.id,
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
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      statusCode: 500,
    });
  }
});
//update card
route.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or incorrect format." });
  }

  const token = authHeader.split(" ")[1];
  const { cardNumber, expiryDate, cvv, cardHolderName, cardType, zipCode } =
    req.body;

  try {
    const decoded = jwt.verify(token, "your-secret-key");

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
    } else {
      const update = await card.findOneAndUpdate(
        { _id: id, userId: decoded.id },
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
    }
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//delete card
route.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or incorrect format." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer token"})

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const Card = await card.findOneAndDelete({ _id: id, userId: decoded.id });
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
    // if (!allCards) {
    //   return res.status(404).json({
    //     message: "no cards available",
    //   });
    // }
    res.status(200).json({
      message: "All Cards",
      Cards: allCards,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//get card by id
route.get("/:id", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or incorrect format." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer token"})
  try {
    const decoded = jwt.verify(token, "your-secret-key");

    const id = req.params.id;
    const singleCard = await card.findOne({ _id: id, userId: decoded.id });

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
  } catch (error) {}
});

module.exports = route;
