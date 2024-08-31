const { Lesson, lessonSchema, updateSchema } = require("../models/Lesson");
const { Course } = require("../models/Course");

const create = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({
        message: "You don't have permission to add lesson to this course ",
      });
    }

    // Validate lesson data
    const { error, value } = lessonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create new lesson
    const newLesson = new Lesson({
      courseId: courseId,
      ...value,
      videoUrl: req.file.path, // Cloudinary URL
    });

    // Save the lesson
    await newLesson.save();

    res.status(201).json({
      message: "Lesson added successfully",
      data: newLesson,
    });
  } catch (err) {
    console.error("Error adding lesson:", err);
    res
      .status(500)
      .json({ message: "Error adding lesson", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({
        message: "You don't have permission to update lesson in this course ",
      });
    }

    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Xác thực và cập nhật dữ liệu
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Cập nhật khóa học
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, value, {
      new: true,
    });

    res.status(200).json({
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating lesson", error: err.message });
  }
};

const del = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Kiểm tra quyền truy cập
    if (course.instructor.toString() !== req.userId) {
      return res.status(403).json({
        message: "You don't have permission to delete lesson in this course ",
      });
    }
    // const lesson = await Lesson.findById(req.params.lessonId)
    const result = await Lesson.deleteById(req.params.lessonId);

    res.status(200).json({
      message: "Lesson deleted successfully",
      data: result,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting lesson", error: err.message });
  }
};

const lessonController = { create, update, del };

module.exports = lessonController;
