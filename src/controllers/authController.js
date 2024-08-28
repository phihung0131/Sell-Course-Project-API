let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

const keyJWT = require("../config/jwt");
const { User } = require("../models");

const { authMiddleware } = require("../middlewares");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(200).send({ message: "User registered successfully!" });
  } catch (error) {
    console.error(">>> Error during register:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id }, keyJWT.secret, {
      algorithm: "HS256",
      expiresIn: "24h",
    });

    let userObject = user.toObject();
    delete userObject.password;

    res.status(200).send({
      user: userObject,
      accessToken: token,
    });
  } catch (error) {
    console.error(">>>Error during login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  const token = req.headers["x-access-token"];
  authMiddleware.blacklistedTokens.push(token);
  res.status(200).send({ message: "Logged out" });
};

const authController = {
  register,
  login,
  logout,
};

module.exports = authController;
