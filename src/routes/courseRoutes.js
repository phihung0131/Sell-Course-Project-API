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

// Tạo khóa học cho teachers
router.post(
  "/api/courses",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("image"),
  ],
  courseController.create
);

// Chỉnh sửa khóa học cho teachers
router.put(
  "/api/courses/:courseId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  courseController.update
);

// Xác nhận phê duyệt khóa học cho Admin
router.put(
  "/api/admin/courses/:courseId/approve",
  [authMiddleware.verifyToken, roleMiddleware.isAdmin],
  courseController.acceptCourse
);

// Lấy danh sách khóa học
router.get("/api/courses", courseController.getCoursesForUser);

// Tìm kiếm, lọc khóa học
router.get("/api/courses/search", courseController.searchCourses);

// Xem chi tiết khóa học
router.get("/api/courses/:courseId", courseController.getDetailCoures);

module.exports = router;
