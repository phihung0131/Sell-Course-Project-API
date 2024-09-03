const { Review, reviewSchema } = require("../models/Review");
const { Enrollment } = require("../models/Enrollment");
const { Course } = require("../models/Course");

const create = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      isAllowed: true,
    });
    if (!enrollment) {
      return res.status(404).json({
        message:
          "You do not have permission to review this course, you are not enrolled!",
      });
    }

    const review = await Review.findOne({ userId, courseId });
    if (review) {
      return res
        .status(404)
        .json({ message: "You have reviewed this course!" });
    }

    const { error, value } = reviewSchema.validate(req.body);

    // Xác thực dữ liệu đầu vào
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const reivew = new Review({
      ...value,
      userId,
      courseId,
    });

    // Lưu course vào database
    await reivew.save();

    res.status(201).json({
      message: "Review created successfully!",
      data: reivew,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating review", error: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      isAllowed: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not allowed" });
    }

    const reviews = await Review.find({ courseId: req.params.id })
      .sort({ createdAt: -1 })
      .select("-__v -deleted");

    res.status(200).json({
      message: "Get reviews course",
      data: reviews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reivews", error: error.message });
  }
};
const reviewController = {
  create,
  getReviews,
};

module.exports = reviewController;
