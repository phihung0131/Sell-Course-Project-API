const Joi = require("joi");
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    isAllowed: Boolean,
    paymentImageUrl: String,
    startDate: Date,
  },
  { timestamps: true }
);

// Áp dụng plugin mongoose-delete với các tùy chọn
EnrollmentSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deletedAt"],
});

// Joi schema for enrollment validation
const enrollmentSchema = Joi.object({
  userId: Joi.string().required(),
  courseId: Joi.string().required(),
  isAllowed: Joi.boolean().default("false"),
  paymentImageUrl: Joi.string().required(),
  startDate: Joi.date().default(Date.now),
});

const Enrollment = new mongoose.model("Enrollment", EnrollmentSchema);

module.exports = { Enrollment, enrollmentSchema };
