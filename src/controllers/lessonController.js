const { Lesson, lessonSchema, updateSchema } = require("../models/Lesson");
const { Course } = require("../models/Course");
const { Enrollment } = require("../models/Enrollment");
const sendResponse = require("../helper/sendResponse");

const create = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You don't have permission to add lesson to this course"
      );
    }

    const { error, value } = lessonSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const newLesson = new Lesson({
      courseId: courseId,
      ...value,
      videoUrl: req.file.path, // Cloudinary URL
    });

    await newLesson.save();

    sendResponse(res, 201, "Lesson added successfully", newLesson);
  } catch (err) {
    sendResponse(res, 500, "Error adding lesson", err.message);
  }
};

const update = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You don't have permission to update lesson in this course"
      );
    }

    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return sendResponse(res, 404, "Lesson not found");
    }

    let { error, value } = updateSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    // Xóa các thuộc tính rỗng
    value = Object.entries(value).reduce((acc, [key, val]) => {
      if (val !== "") {
        acc[key] = val;
      }
      return acc;
    }, {});

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, value, {
      new: true,
    });

    sendResponse(res, 200, "Lesson updated successfully", updatedLesson);
  } catch (err) {
    sendResponse(res, 500, "Error updating lesson", err.message);
  }
};

const del = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You don't have permission to delete lesson in this course"
      );
    }

    const lesson = await Lesson.findOne({ _id: req.params.lessonId });

    if (lesson) {
      const result = await Lesson.deleteById(lesson._id);

      sendResponse(res, 200, "Lesson deleted successfully", result);
    } else {
      return sendResponse(res, 404, "Lesson not found or already deleted");
    }
  } catch (err) {
    sendResponse(res, 500, "Error deleting lesson", err.message);
  }
};

const getLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userId;

    const enrollment = await Enrollment.findOne({
      courseId,
      userId,
      isAllowed: true,
    });

    if (!enrollment) {
      return sendResponse(
        res,
        403,
        "You do not have permission to access this lesson, enrollment does not exist."
      );
    }

    const lesson = await Lesson.findOne({
      _id: req.params.lessonId,
    })
      .populate("courseId", "title")
      .select("-__v");

    if (!lesson) {
      return sendResponse(res, 404, "Lesson not found");
    }

    sendResponse(res, 200, "Fetched lesson successfully", lesson);
  } catch (error) {
    sendResponse(res, 500, "Error fetching lesson", error.message);
  }
};

const lessonController = { create, update, del, getLesson };

module.exports = lessonController;
