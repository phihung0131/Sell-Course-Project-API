const { Enrollment, enrollmentSchema } = require("../models/Enrollment");
const { Course } = require("../models/Course");

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findOne({ _id: courseId, isAllowed: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollmentTemp = await Enrollment.findOne({
      userId: req.userId,
      courseId: courseId,
    });
    if (enrollmentTemp) {
      return res.status(404).json({ message: "Enrollment already exists" });
    }

    const enrollment = {
      userId: req.userId,
      courseId,
      paymentImageUrl: req.file.path,
      isAllowed: false,
    };

    const { error, value } = enrollmentSchema.validate(enrollment);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      ...value,
    });

    // Save the lesson
    await newEnrollment.save();

    res.status(201).json({
      message: "Enrollment added successfully",
      data: newEnrollment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating enrollment", error: err.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.userId,
      isAllowed: false,
    })
      .populate("courseId")
      .select("-__v");

    res.status(200).json({
      message: "Get all enrollments for users",
      data: enrollments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching enrollments", error: error.message });
  }
};

const getEnrollmentsACourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not allowed" });
    }

    if (course.instructor.toString() !== req.userId) {
      return res.status(404).json({
        message:
          "You do not have permission to view this course enrollments list!",
      });
    }

    const enrollments = await Enrollment.find({
      courseId: course._id,
    })
      .populate("userId", "email")
      .select("-__v");

    res.status(200).json({
      message: "Get all enrollments for teachers",
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrollments for teacher",
      error: error.message,
    });
  }
};

const acceptEnrollment = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not allowed" });
    }

    if (course.instructor.toString() !== req.userId) {
      return res.status(404).json({
        message: "You do not have permission to accpect this course!",
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const newEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { isAllowed: true },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Accept enrollment for teachers",
      data: newEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error accept enrollments for teacher",
      error: error.message,
    });
  }
};

const enrollmentController = {
  enrollCourse,
  getEnrollments,
  getEnrollmentsACourse,
  acceptEnrollment,
};

module.exports = enrollmentController;
