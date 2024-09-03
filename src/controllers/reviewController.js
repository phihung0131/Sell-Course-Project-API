const { Review, reviewSchema } = require("../models/Review");
const { Enrollment } = require("../models/Enrollment");
const { Course } = require("../models/Course");

const sendResponse = require("../helper/sendResponse");

const create = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userId;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      isAllowed: true,
    });
    if (!enrollment) {
      return sendResponse(
        res,
        403,
        "You do not have permission to review this course, you are not enrolled!"
      );
    }

    const existingReview = await Review.findOne({ userId, courseId });
    if (existingReview) {
      return sendResponse(res, 400, "You have already reviewed this course!");
    }

    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const newReview = new Review({
      ...value,
      userId,
      courseId,
    });

    await newReview.save();

    sendResponse(res, 201, "Review created successfully!", newReview);
  } catch (err) {
    sendResponse(res, 500, "Error creating review", err.message);
  }
};

const getReviews = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    });

    if (!course) {
      return sendResponse(res, 404, "Course not found or not allowed");
    }

    const reviews = await Review.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 })
      .select("-__v -deleted");

    sendResponse(res, 200, "Fetched reviews successfully", reviews);
  } catch (error) {
    sendResponse(res, 500, "Error fetching reviews", error.message);
  }
};
const reviewController = {
  create,
  getReviews,
};

module.exports = reviewController;
