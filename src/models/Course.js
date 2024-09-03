const mongoose = require("mongoose");
const Joi = require("joi");

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
    level: String, // "beginner", "intermediate", "advanced"
    language: String,

    thumbnailUrl: String,

    enrollmentCount: Number,
    rating: Number,

    isAllowed: Boolean, // admin allow?
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

// Định nghĩa schema Joi cho xác thực
const courseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  level: Joi.string().valid("beginner", "intermediate", "advanced").required(),
  language: Joi.string().required(),
});

// Định nghĩa schema Joi cho xác thực dữ liệu giáo viên có thể chỉnh sửa
const updateSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  price: Joi.number().min(0),
  category: Joi.string(),
  level: Joi.string().valid("beginner", "intermediate", "advanced"),
  language: Joi.string(),
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Course,
  courseSchema,
  updateSchema,
};
