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

// Tạo lesson cho Course dành cho teacher
router.post(
  "/api/courses/:courseId/lessons",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("video"),
  ],
  lessonController.create
);

// Chỉnh sửa lesson dành cho teacher
router.put(
  "/api/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.update
);

// Xóa lesson dành cho giáo viên
router.delete(
  "/api/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.del
);

// Xem lesson dành cho student
router.get(
  "/api/courses/:courseId/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  lessonController.getLesson
);

module.exports = router;
