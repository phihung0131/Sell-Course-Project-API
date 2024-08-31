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

router.post(
  "/courses/:id/lessons",
  [
    authMiddleware.verifyToken,
    roleMiddleware.isTeacher,
    upload.single("video"), // Handle video upload
  ],
  lessonController.create
);

router.put(
  "/courses/:id/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.update
);

router.delete(
  "/courses/:id/lessons/:lessonId",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  lessonController.del
);

module.exports = router;
