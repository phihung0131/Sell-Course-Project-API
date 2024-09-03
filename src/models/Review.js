const Joi = require("joi");
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

// Áp dụng plugin mongoose-delete với các tùy chọn
ReviewSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deletedAt"],
});

// Joi schema for review validation
const reviewSchema = Joi.object({
  rating: Joi.number().required().min(0).max(5),
  comment: Joi.string().min(0).max(1000),
});

const Review = new mongoose.model("Review", ReviewSchema);

module.exports = { Review, reviewSchema };
