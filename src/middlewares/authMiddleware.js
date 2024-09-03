const jwt = require("jsonwebtoken");

const keyJWT = require("../config/jwt");
const { User } = require("../models/User");

const sendResponse = require("../helper/sendResponse");

const blacklistedTokens = [];

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return sendResponse(res, 403, "No token provided!");
  }

  if (blacklistedTokens.includes(token)) {
    return sendResponse(res, 401, "Token is no longer valid");
  }

  jwt.verify(token, keyJWT.secret, async (err, decoded) => {
    if (err) {
      return sendResponse(res, 401, "Unauthorized!");
    }

    req.userId = decoded.id;

    // Look up the user in your database
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, "User not found!");
    }

    next();
  });
};

const authMiddleware = {
  verifyToken,
  blacklistedTokens,
};

module.exports = authMiddleware;
