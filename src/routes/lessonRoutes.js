const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { lessonController } = require("../controllers");

const upload = require("../config/multer");

// Middleware to setgit st CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Xem lesson dành cho student
/**
 * @swagger
 * /api/student/courses/{courseId}/lessons/{lessonId}:
 *   get:
 *     summary: Xem lesson dành cho học viên
 *     tags: [Lessons]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: lessonId
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
 *                   type: number
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: XXX successfully
 *                 data:
 *                   type: string
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
 *                   type: number
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: error message
 *                 data:
 *                   type: string
 *                   example: null or error detail
 */
router.get(
  "/api/student/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  lessonController.getLesson
);

// Tạo lesson cho Course dành cho teacher
/**
 * @swagger
 * /api/teacher/courses/{courseId}/lessons:
 *   post:
 *     summary: Tạo lesson cho Course dành cho giảng viên
 *     tags: [Lessons]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               order:
 *                 type: number
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
 *                   type: number
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: XXX successfully
 *                 data:
 *                   type: string
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
 *                   type: number
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: error message
 *                 data:
 *                   type: string
 *                   example: null or error detail
 */
router.post(
  "/api/teacher/courses/:courseId/lessons",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("video"),
  ],
  lessonController.create
);

// Chỉnh sửa lesson dành cho teacher
/**
 * @swagger
 * /api/teacher/courses/{courseId}/lessons/{lessonId}:
 *   put:
 *     summary: Chỉnh sửa lesson dành cho giảng viên
 *     tags: [Lessons]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: lessonId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               order:
 *                 type: number
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
 *                   type: number
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: XXX successfully
 *                 data:
 *                   type: string
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
 *                   type: number
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: error message
 *                 data:
 *                   type: string
 *                   example: null or error detail
 */
router.put(
  "/api/teacher/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.update
);

// Xóa lesson dành cho giáo viên
/**
 * @swagger
 * /api/teacher/courses/{courseId}/lessons/{lessonId}:
 *   delete:
 *     summary: Xóa lesson dành cho giảng viên
 *     tags: [Lessons]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: lessonId
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
 *                   type: number
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: XXX successfully
 *                 data:
 *                   type: string
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
 *                   type: number
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: error message
 *                 data:
 *                   type: string
 *                   example: null or error detail
 */
router.delete(
  "/api/teacher/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.del
);

module.exports = router;
