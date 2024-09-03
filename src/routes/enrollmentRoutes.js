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

// Đăng kí khóa học cho students
router.post(
  "/api/courses/:courseId/enroll",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isStudent,
    upload.single("image"),
  ],
  enrollmentController.enrollCourse
);

// Lấy danh sách Courses đã đăng kí thành công
router.get(
  "/api/student/enrollments",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  enrollmentController.getEnrollments
);

// Lấy danh sách enrollments hiện có
router.get(
  "/api/teacher/courses/:courseId/enrollments",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  enrollmentController.getEnrollmentsACourse
);

// Chấp nhận enrollment khóa học cho teachers
router.put(
  "/api/teacher/courses/:courseId/enrollments/:enrollmentId/approve",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  enrollmentController.acceptEnrollment
);
module.exports = router;
