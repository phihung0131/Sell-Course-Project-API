const { Enrollment, enrollmentSchema } = require("../models/Enrollment");
const { Course } = require("../models/Course");

const sendResponse = require("../helper/sendResponse");

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findOne({ _id: courseId, isAllowed: true });
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    const enrollmentTemp = await Enrollment.findOne({
      userId: req.userId,
      courseId: courseId,
    });
    if (enrollmentTemp) {
      return sendResponse(res, 400, "Enrollment already exists");
    }

    const enrollment = {
      userId: req.userId,
      courseId,
      paymentImageUrl: req.file.path,
      isAllowed: false,
    };

    const { error, value } = enrollmentSchema.validate(enrollment);

    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      ...value,
    });

    // Save the lesson
    await newEnrollment.save();

    sendResponse(res, 201, "Enrollment added successfully", newEnrollment);
  } catch (err) {
    sendResponse(res, 500, "Error creating enrollment", err.message);
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

    sendResponse(res, 200, "Fetched all enrollments for users", enrollments);
  } catch (error) {
    sendResponse(res, 500, "Error fetching enrollments", error.message);
  }
};

const getEnrollmentsACourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    });

    if (!course) {
      return sendResponse(res, 404, "Course not found or not allowed");
    }

    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You do not have permission to view this course's enrollments"
      );
    }

    const enrollments = await Enrollment.find({
      courseId: course._id,
    })
      .populate("userId", "email")
      .select("-__v");

    sendResponse(
      res,
      200,
      "Fetched all enrollments for the course",
      enrollments
    );
  } catch (error) {
    sendResponse(
      res,
      500,
      "Error fetching enrollments for the course",
      error.message
    );
  }
};

const acceptEnrollment = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    });

    if (!course) {
      return sendResponse(res, 404, "Course not found or not allowed");
    }

    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You do not have permission to accept this enrollment"
      );
    }

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
    });

    if (!enrollment) {
      return sendResponse(res, 404, "Enrollment not found");
    }

    const newEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { isAllowed: true },
      {
        new: true,
      }
    );

    sendResponse(res, 200, "Enrollment accepted", updatedEnrollment);
  } catch (error) {
    sendResponse(res, 500, "Error accepting enrollment", error.message);
  }
};

const enrollmentController = {
  enrollCourse,
  getEnrollments,
  getEnrollmentsACourse,
  acceptEnrollment,
};

module.exports = enrollmentController;
