const { Course, courseSchema, updateSchema } = require("../models/Course");
const { Category } = require("../models/Category");
const { Lesson } = require("../models/Lesson");
const sendResponse = require("../helper/sendResponse");

// Tạo một khóa học
const create = async (req, res) => {
  try {
    const { error, value } = courseSchema.validate(req.body);

    const category = await Category.findOne({ name: value.category });
    if (!category) {
      return sendResponse(res, 400, "Category not found");
    }

    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const course = new Course({
      ...value,
      instructor: req.userId,
      thumbnailUrl: req.file ? req.file.path : null,
      category: category._id,
      enrollmentCount: 0,
      rating: 0,
      isAllowed: false,
    });
    await course.save();

    sendResponse(res, 201, "Course created successfully!", course);
  } catch (err) {
    sendResponse(res, 500, "Failed to create course", err.message);
  }
};

const update = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    // Kiểm tra quyền cập nhật
    if (course.instructor.toString() !== req.userId) {
      return sendResponse(
        res,
        403,
        "You don't have permission to edit this course"
      );
    }

    let updateData = {};

    // Xác thực và cập nhật dữ liệu cho giáo viên
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

    updateData = value;

    // Xử lý category nếu được cung cấp
    if (value.category) {
      const category = await Category.findOne({ name: value.category });
      if (!category) {
        return sendResponse(res, 400, "Category not found");
      }
      updateData.category = category._id;
    }

    // Cập nhật khóa học
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    sendResponse(res, 200, "Course updated successfully", updatedCourse);
  } catch (err) {
    sendResponse(res, 500, "Failed to update course", err.message);
    console.error(err);
  }
};

const getCoursesForUser = async (req, res) => {
  try {
    const courses = await Course.find({ isAllowed: true })
      .populate("instructor", "username")
      .populate("category", "name")
      .select("-__v");

    sendResponse(res, 200, "Fetched all courses for users", courses);
  } catch (error) {
    sendResponse(res, 500, "Failed to fetch courses for users", error.message);
  }
};

const getDetailCoures = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      isAllowed: true,
    })
      .populate("instructor", "username")
      .populate("category", "name")
      .select("-__v");

    if (!course) {
      return sendResponse(res, 404, "Course not found or not allowed");
    }

    const lessons = await Lesson.find(
      { courseId: req.params.courseId },
      "title description order"
    )
      .sort("order")
      .select("-__v");

    sendResponse(res, 200, "Fetched course details for users", {
      course,
      lessons,
    });
  } catch (error) {
    sendResponse(
      res,
      500,
      "Failed to fetch course details for users",
      error.message
    );
  }
};

const searchCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = { isAllowed: true };

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Nếu có tham số category, tìm id tương ứng với category name
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return sendResponse(
          res,
          400,
          `Category with name ${category} not found`
        );
      }
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate("instructor", "name")
      .populate("category", "name")
      .select("-__v");

    sendResponse(res, 200, "Fetched search results for users", courses);
  } catch (error) {
    sendResponse(res, 500, "Failed to search courses", error.message);
  }
};

const acceptCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
    });

    if (!course) {
      return sendResponse(res, 404, "Course not found");
    }

    const newCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      { isAllowed: true },
      {
        new: true,
      }
    );

    sendResponse(res, 200, "Enrollment accepted for teacher", newCourse);
  } catch (error) {
    sendResponse(
      res,
      500,
      "Failed to accept enrollment for teacher",
      error.message
    );
  }
};

const courseController = {
  create,
  update,
  getCoursesForUser,
  getDetailCoures,
  searchCourses,
  acceptCourse,
};

module.exports = courseController;
