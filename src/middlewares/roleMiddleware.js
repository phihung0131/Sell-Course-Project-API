const jwt = require("jsonwebtoken");

const keyJWT = require("../config/jwt");
const { User } = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === "admin") {
      next();
      return;
    } else if (user) {
      res.status(403).send({ message: "Require Admin Role!" });
      return;
    } else {
      res.status(404).send({ message: "User not found!" });
      return;
    }
  } catch (error) {
    console.error(">>>Error checking admin role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const isTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === "teacher") {
      next();
      return;
    } else if (user) {
      res.status(403).send({ message: "Require Teacher Role!" });
      return;
    } else {
      res.status(404).send({ message: "User not found!" });
      return;
    }
  } catch (error) {
    console.error(">>>Error checking teacher role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === "student") {
      next();
      return;
    } else if (user) {
      res.status(403).send({ message: "Require Student Role!" });
      return;
    } else {
      res.status(404).send({ message: "User not found!" });
      return;
    }
  } catch (error) {
    console.error(">>>Error checking student role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const isTeacherOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && (user.role === "teacher" || user.role === "admin")) {
      next();
      return;
    } else if (user) {
      res.status(403).send({ message: "Require Teacher or Admin Role!" });
      return;
    } else {
      res.status(404).send({ message: "User not found!" });
      return;
    }
  } catch (error) {
    console.error(">>>Error checking teacher/admin role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const roleMiddleware = {
  isAdmin,
  isTeacher,
  isStudent,
  isTeacherOrAdmin,
};

module.exports = roleMiddleware;
