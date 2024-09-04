const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { courseController } = require("../controllers");

const upload = require("../config/multer");

// Middleware to setgit st CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Lấy danh sách khóa học
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Lấy danh sách khóa học
 *     tags: [Courses]
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
router.get("/api/courses", courseController.getCoursesForUser);

// Tìm kiếm, lọc khóa học
/**
 * @swagger
 * /api/courses/search:
 *   get:
 *     summary: Tìm kiếm, lọc khóa học
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
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
router.get("/api/courses/search", courseController.searchCourses);

// Xem chi tiết khóa học
/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Xem chi tiết khóa học
 *     tags: [Courses]
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
router.get("/api/courses/:courseId", courseController.getDetailCoures);

// Tạo khóa học cho teachers
/**
 * @swagger
 * /api/teacher/courses:
 *   post:
 *     summary: Tạo khóa học dành cho giảng viên
 *     tags: [Courses]
 *     security:
 *       - ApiKeyAuth: []
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
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               price:
 *                 type: string
 *                 required: true
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: chỉ beginner hoặc intermediate hoặc advanced
 *                 required: true
 *               language:
 *                 type: string
 *                 required: true
 *               category:
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
  "/api/teacher/courses",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("image"),
  ],
  courseController.create
);

// Chỉnh sửa khóa học cho teachers
/**
 * @swagger
 * /api/teacher/courses/{courseId}:
 *   put:
 *     summary: Chỉnh sửa khóa học dành cho giảng viên
 *     description: (Fix rồi) Phía frondend, property nào để trống có thể không gửi đi, backend sẽ lấy dữ liệu cũ 
 *     tags: [Courses]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: chỉ beginner hoặc intermediate hoặc advanced
 *               language:
 *                 type: string
 *               category:
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
router.put(
  "/api/teacher/courses/:courseId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  courseController.update
);

// Xác nhận phê duyệt khóa học cho Admin
/**
 * @swagger
 * /api/admin/courses/{courseId}/approve:
 *   put:
 *     summary: Phê duyệt khóa học cho Admin
 *     tags: [Courses]
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
router.put(
  "/api/admin/courses/:courseId/approve",
  [authMiddleware.verifyToken, roleMiddleware.isAdmin],
  courseController.acceptCourse
);

module.exports = router;
