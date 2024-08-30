const { User } = require("../models/User");

// No have admin role, admin role is registered by other admin
const ROLES = ["student", "teacher"];  

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const existingUserByUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUserByUsername) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    const existingUserByEmail = await User.findOne({ email: req.body.email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (error) {
    console.error(">>>Error checking duplicate username or email:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (!ROLES.includes(req.body.role)) {
    return res.status(400).send({
      message: `Failed! Role ${req.body.role} does not exist!`,
    });
  }

  next();
};

const registerMiddleware = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = registerMiddleware;
