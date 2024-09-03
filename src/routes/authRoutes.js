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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User information (excluding password)
 *                 accessToken:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/api/auth/login", authController.login);
router.post("/api/auth/login", authController.login);

// Đăng xuất
router.post(
  "/api/auth/logout",
  [authMiddleware.verifyToken],
  authController.logout
);

module.exports = router;
