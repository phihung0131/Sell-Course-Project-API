const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { reviewController } = require("../controllers");

const upload = require("../config/multer");

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
  "/courses/:id/reviews",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isStudent,
  ],
  reviewController.create
);

// Xem review của khóa học
router.get(
    "/courses/:id/reviews",
    reviewController.getReviews
  );

module.exports = router;
