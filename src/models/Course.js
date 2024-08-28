const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [String],
    level: String, // "beginner", "intermediate", "advanced"
    language: String,
    thumbnailUrl: String,
    enrollmentCount: Number,
    rating: Number,
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
