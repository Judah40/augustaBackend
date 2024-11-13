const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/default.config");

const getAuthToken = (req) => {
  try {
    const authHeader = req.headers.authorization || null;
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header missing or incorrect format." });
    }

    return authHeader.split(" ")[1]; //
  } catch (error) {
    console.error("GET AUTH TOKEN ERROR: ", error);
    throw error;
  }
};

const requireAuthenticatedUser = async (req, res, next) => {
  try {
    const token = getAuthToken(req);

    if (!token) {
      return res
        .status(400)
        .json({ message: "Invalid/Missing Authentication Token" });
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    req.user = {
      userId: decodedToken.userId,
    };
    return next();
  } catch (error) {
    console.error("REQUIRE AUTHENTICATED USER ERROR: ", error);
    if (error.message === "invalid signature") {
      return res
        .status(401)
        .json({ message: "Invalid Authentication Token. Please Try Again" });
    }
    if (error.message == "jwt expired") {
      return res
        .status(401)
        .json({ message: "Session Expired Please Login to Continue" });
    }
    return res
      .status(401)
      .json({ message: "Authentication Failed. Please Try Again!" });
  }
};

module.exports = {
  requireAuthenticatedUser,
};
