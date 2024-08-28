const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    role: String, // "student", "teacher", "admin"
    profile: {
      fullName: String,
      avatar: String,
      bio: String,
    },
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
