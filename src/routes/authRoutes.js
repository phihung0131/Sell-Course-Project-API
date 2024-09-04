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
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đắng kí người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *                 description: chỉ student hoặc teacher
 *                 required: true
 *     responses:
 *       2xx:
 *         description: XXX successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: success
 *                 message:
 *                   example: XXX successfully
 *                 data:
 *                   example: null or object
 *
 *       ERROR:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: error
 *                 message:
 *                   example: error message
 *                 data:
 *                   example: null or error detail
 */
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
 *     tags:
 *       - Auth
 *     summary: Đắng nhập người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       2xx:
 *         description: XXX successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: success
 *                 message:
 *                   example: XXX successfully
 *                 data:
 *                   example: null or object
 *
 *       ERROR:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: error
 *                 message:
 *                   example: error message
 *                 data:
 *                   example: null or error detail
 */
router.post("/api/auth/login", authController.login);

// Đăng xuất
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [Auth]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       2xx:
 *         description: XXX successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: success
 *                 message:
 *                   example: XXX successfully
 *                 data:
 *                   example: null or object
 *
 *       ERROR:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: error
 *                 message:
 *                   example: error message
 *                 data:
 *                   example: null or error detail
 */
router.post(
  "/api/auth/logout",
  [authMiddleware.verifyToken],
  authController.logout
);

module.exports = router;
