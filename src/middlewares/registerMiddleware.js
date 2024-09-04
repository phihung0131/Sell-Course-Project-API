const { User } = require("../models/User");
const sendResponse = require("../helper/sendResponse");

// No have admin role, admin role is registered by other admin
const ROLES = ["student", "teacher"];

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const existingUserByUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUserByUsername) {
      return sendResponse(res, 400, "Failed! Username is already in use!");
    }

    const existingUserByEmail = await User.findOne({ email: req.body.email });
    if (existingUserByEmail) {
      return sendResponse(res, 400, "Failed! Email is already in use!");
    }

    next();
  } catch (error) {
    sendResponse(res, 500, "Internal server error", error.message);
  }
};

const checkRolesExisted = (req, res, next) => {
  console.log(req.body);
  const role = req.body.role;

  if (!ROLES.includes(req.body.role)) {
    return sendResponse(res, 400, `Failed! Role ${role} does not exist!`);
  }

  next();
};

const registerMiddleware = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = registerMiddleware;
