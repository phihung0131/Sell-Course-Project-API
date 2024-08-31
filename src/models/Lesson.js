const Joi = require("joi");
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: String,
    description: String,
    videoUrl: String, // url video
    order: Number,
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

// Áp dụng plugin mongoose-delete với các tùy chọn
LessonSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deletedAt"],
});

// Joi schema for lesson validation
const lessonSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  order: Joi.number().required().min(0),
});

// Định nghĩa schema Joi cho xác thực dữ liệu có thể chỉnh sửa
const updateSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  order: Joi.number().min(0),
});

const Lesson = new mongoose.model("Lesson", LessonSchema);

module.exports = { Lesson, lessonSchema, updateSchema };
