// const authJwt = require("./authJwt");
const registerMiddleware = require("./registerMiddleware");
const authMiddleware = require("./authMiddleware");
const roleMiddleware = require("./roleMiddleware");

module.exports = {
  authMiddleware,
  registerMiddleware,
  roleMiddleware
};
