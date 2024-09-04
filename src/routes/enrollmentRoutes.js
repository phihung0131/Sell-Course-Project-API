const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { enrollmentController } = require("../controllers");

const upload = require("../config/multer");

// Middleware to setgit st CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Lấy danh sách Courses đã đăng kí thành công
/**
 * @swagger
 * /api/student/enrollments:
 *   get:
 *     summary: Lấy danh sách Courses đã đăng kí thành công
 *     tags: [Enrollments]
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
  "/api/student/enrollments",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  enrollmentController.getEnrollments
);

// Lấy danh sách enrollments hiện có
/**
 * @swagger
 * /api/teacher/courses/{courseId}/enrollments:
 *   get:
 *     summary: Lấy danh sách enrollments hiện có của giảng viên
 *     tags: [Enrollments]
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
  "/api/teacher/courses/:courseId/enrollments",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  enrollmentController.getEnrollmentsACourse
);

// Đăng kí khóa học cho students
/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Đăng kí khóa học cho học viên
 *     tags: [Enrollments]
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
 *               image:
 *                 type: string
 *                 format: binary
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
  "/api/courses/:courseId/enroll",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isStudent,
    upload.single("image"),
  ],
  enrollmentController.enrollCourse
);

// Chấp nhận enrollment khóa học cho teachers
/**
 * @swagger
 * /api/teacher/courses/{courseId}/enrollments/{enrollmentId}/approve:
 *   put:
 *     summary: Chấp nhận enrollment khóa học cho giảng viên
 *     tags: [Enrollments]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: enrollmentId
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
router.put(
  "/api/teacher/courses/:courseId/enrollments/:enrollmentId/approve",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  enrollmentController.acceptEnrollment
);
module.exports = router;
