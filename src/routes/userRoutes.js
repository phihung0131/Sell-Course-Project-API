const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares");
const { userController } = require("../controllers");

// Middleware to set CORS headers
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/test/all", userController.allAccess);

router.get(
  "/test/student",
  [authMiddleware.verifyToken, roleMiddleware.isStudent],
  userController.studentBoard
);

router.get(
  "/test/admin",
  [authMiddleware.verifyToken, roleMiddleware.isAdmin],
  userController.adminBoard
);

router.get(
  "/test/teacher",
  [authMiddleware.verifyToken, roleMiddleware.isTeacher],
  userController.teacherBoard
);

module.exports = router;
