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

// // Cấu hình multer để không lưu trữ tệp tin, chỉ phân tích dữ liệu
// const upload = multer();

// Tạo khóa học cho teachers
router.post(
  "/courses",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("image"),
  ],
  courseController.create
);

// Chỉnh sửa khóa học cho admins/teachers
router.put(
  "/courses/:id",
  [authMiddleware.verifyToken, roleMiddleware.isTeacherOrAdmin],
  courseController.update
);

// Lấy danh sách khóa học
router.get("/courses", courseController.getCoursesForUser);

// Tìm kiếm và lọc khóa học
router.get('/courses/filter', courseController.searchCourses);

// Xem chi tiết khóa học
router.get('/courses/:id', courseController.getDetailCoures);

module.exports = router;
