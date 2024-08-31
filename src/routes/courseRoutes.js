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

router.post(
  "/courses",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacherOrAdmin,
    upload.single("image"),
  ],
  courseController.create
);

router.put(
  "/courses/:id",
  [authMiddleware.verifyToken, roleMiddleware.isTeacherOrAdmin],
  courseController.update
);

module.exports = router;
