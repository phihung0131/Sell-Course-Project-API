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

// Đăng kí người dùng
router.post(
  "/api/auth/register",
  [
    registerMiddleware.checkDuplicateUsernameOrEmail,
    registerMiddleware.checkRolesExisted,
  ],
  authController.register
);

// Đăng nhập
router.post("/api/auth/login", authController.login);

// Đăng xuất
router.post(
  "/api/auth/logout",
  [authMiddleware.verifyToken],
  authController.logout
);

module.exports = router;
