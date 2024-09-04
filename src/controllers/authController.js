let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

const keyJWT = require("../config/jwt");
const { User } = require("../models/User");
const { authMiddleware } = require("../middlewares");
const sendResponse = require("../helper/sendResponse");


const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = {
      username,
      email,
      role,
    };

    const user = new User({ ...newUser, password: hashedPassword });

    await user.save();

    sendResponse(res, 201, "User registered successfully!", newUser);
  } catch (error) {
    sendResponse(res, 500, "Internal server error", error.message);
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return sendResponse(res, 404, "User not found.");
    }

    // so sánh mật khẩu
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return sendResponse(res, 401, "Invalid password.");
    }

    // tạo token cho người dùng
    const token = jwt.sign({ id: user.id }, keyJWT.secret, {
      algorithm: "HS256",
      expiresIn: "24h",
    });

    let userObject = user.toObject();
    delete userObject.password;
    sendResponse(res, 200, "Login successful", {
      user: userObject,
      accessToken: token,
    });
  } catch (error) {
    sendResponse(res, 500, "Internal server error", error.message);
  }
};

// Đăng xuất
const logout = (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (token) {
      authMiddleware.blacklistedTokens.push(token);
      sendResponse(res, 200, "Logged out successfully");
    } else {
      sendResponse(res, 400, "No token provided");
    }
  } catch (error) {
    sendResponse(res, 500, "Internal server error", error.message);
  }
};

const authController = {
  register,
  login,
  logout,
};

module.exports = authController;
