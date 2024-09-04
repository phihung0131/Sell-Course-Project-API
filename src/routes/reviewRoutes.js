const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { reviewController } = require("../controllers");

// Middleware to setgit st CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Xem review của khóa học
/**
 * @swagger
 * /api/courses/{courseId}/reviews:
 *   get:
 *     summary: Tạo review cho học viên
 *     tags: [Reviews]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
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
router.get("/api/courses/:courseId/reviews", reviewController.getReviews);

// Tạo review cho students
/**
 * @swagger
 * /api/student/courses/{courseId}/reviews:
 *   post:
 *     summary: Tạo review cho học viên
 *     tags: [Reviews]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 required: true
 *               comment:
 *                 type: string
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
  "/api/student/courses/:courseId/reviews",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  reviewController.create
);

module.exports = router;
