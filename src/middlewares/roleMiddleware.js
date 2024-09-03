const jwt = require("jsonwebtoken");

const keyJWT = require("../config/jwt");
const { User } = require("../models/User");

const sendResponse = require("../helper/sendResponse");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, "User not found!");
    }

    if (user.role === "admin") {
      return next();
    } else {
      return sendResponse(res, 403, "Require Admin Role!");
    }
  } catch (error) {
    return sendResponse(res, 500, "Internal server error", error.message);
  }
};

const isTeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, "User not found!");
    }

    if (user.role === "teacher") {
      return next();
    } else {
      return sendResponse(res, 403, "Require Teacher Role!");
    }
  } catch (error) {
    return sendResponse(res, 500, "Internal server error", error.message);
  }
};

const isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendResponse(res, 404, "User not found!");
    }

    if (user.role === "student") {
      return next();
    } else {
      return sendResponse(res, 403, "Require Student Role!");
    }
  } catch (error) {
    return sendResponse(res, 500, "Internal server error", error.message);
  }
};

const roleMiddleware = {
  isAdmin,
  isTeacher,
  isStudent,
};

module.exports = roleMiddleware;
