import { Router } from "express";
const router = Router();
import wallet from "../../models/wallet.js";
import validators from "../../utils/Validators.js";
const { walletValidator } = validators;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//create wallet
router.post("/add", async (req, res) => {
  try {
    const { userId } = req.user;
    const { walletName, currency, WalletBalance, walletStatus, expiryDate } =
      req.body;

    const valid = walletValidator(
      walletName,
      currency,
      WalletBalance,
      walletStatus,
      expiryDate
    );
    if (valid.error) {
      return res
        .status(400)
        .json({ statusCode: 400, error: valid.error.details[0].message });
    }
    const existingWallet = await findOne({ walletName: walletName });

    if (existingWallet) {
      return res.status(400).json({
        statusCode: 400,
        error: "Wallet already exists",
      });
    }

    const allWallets = await find({ userId });
    console.log(allWallets.length);
    if (allWallets.length === 5) {
      return res.status(429).json({
        message: `Maximum Wallet created`,
        statusCode: 429,
      });
    }
    wallet
      .create({
        userId,
        walletName: walletName,
        currency: currency,
        WalletBalance: WalletBalance,
        walletStatus: walletStatus,
        expiryDate: expiryDate,
      })
      .then((response) => {
        return res.status(201).json({
          message: `wallet sucessfully Added`,
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get single wallet
router.get("/:id", async (req, res, next) => {
  const { userId } = req.user;
  const id = req.params.id;
  try {
    const getSingleWallet = await wallet.findOne({ _id: id, userId });

    if (!getSingleWallet) {
      return res.status(404).json({
        message: "Wallet not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "Wallet found",
      card: getSingleWallet,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Wallet not found",
      statusCode: 404,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get all wallet

router.get("/", async (req, res) => {
  try {
    const { userId } = req.user;
    const allWallets = await wallet.find({ userId });
    res.status(200).json({
      message: "All Cards",
      Cards: allWallets,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//delete wallet
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.user;

    const deleteWallet = await wallet.findOneAndDelete({ _id: id, userId });

    if (!deleteWallet) {
      return res.status(404).json({
        message: "Wallet not found",
        statusCode: 404,
      });
    }
    // Return a success message with the deleted card
    return res.status(200).json({
      message: "Wallet deleted successfully",
      card: deleteWallet,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({ statusbar: 500, message: error.message });
  }
});
export default router;
