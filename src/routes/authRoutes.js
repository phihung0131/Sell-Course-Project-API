const express = require("express");
const router = express.Router();
const { registerMiddleware, authMiddleware } = require("../middlewares");
const { authController } = require("../controllers");

// Middleware to setgit st CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/auth/register",
  [
    registerMiddleware.checkDuplicateUsernameOrEmail,
    registerMiddleware.checkRolesExisted,
  ],
  authController.register
);

router.post("/auth/login", authController.login);

router.post("/auth/logout", [authMiddleware.verifyToken], authController.logout);


module.exports = router;
