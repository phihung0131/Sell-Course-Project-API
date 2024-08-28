const jwt = require("jsonwebtoken");

const keyJWT = require("../config/jwt");
const { User } = require("../models");

const blacklistedTokens = [];

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (blacklistedTokens.includes(token)) {
    return res.status(401).send({ message: "Token is no longer valid" });
  }

  jwt.verify(token, keyJWT.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    req.userId = decoded.id;

    // Look up the user in your database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    next();
  });
};

const authMiddleware = {
  verifyToken,
  blacklistedTokens
};

module.exports = authMiddleware;
