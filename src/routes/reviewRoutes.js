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

// Tạo review cho students
router.post(
  "/api/courses/:courseId/reviews",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  reviewController.create
);

// Xem review của khóa học
router.get("/api/courses/:courseId/reviews", reviewController.getReviews);

module.exports = router;
