const {
  Course,
  courseSchema,
  teacherUpdateSchema,
  adminUpdateSchema,
} = require("../models/Course");
const { Category } = require("../models/Category");
const { User } = require("../models/User");
const { Lesson } = require("../models/Lesson");

const create = async (req, res) => {
  try {
    const { error, value } = courseSchema.validate(req.body);

    // Tìm category dựa trên tên
    const category = await Category.findOne({ name: value.category });
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Xác thực dữ liệu đầu vào
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Tạo đối tượng course mới
    const course = new Course({
      ...value,
      instructor: req.userId,
      thumbnailUrl: req.file ? req.file.path : null,
      category: category._id,
      enrollmentCount: 0,
      rating: 0,
      isAllowed: false,
    });

    // Lưu course vào database
    await course.save();

    res.status(201).json({
      message: "Course created successfully!",
      data: course,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating course", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(req.userId);
    // Kiểm tra quyền truy cập
    if (
      user.role === "teacher" &&
      course.instructor.toString() !== req.userId
    ) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this course" });
    }

    let updateData = {};

    if (user.role === "teacher") {
      // Xác thực và cập nhật dữ liệu cho giáo viên
      const { error, value } = teacherUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      updateData = value;

      // Xử lý category nếu được cung cấp
      if (value.category) {
        const category = await Category.findOne({ name: value.category });
        if (!category) {
          return res.status(400).json({ message: "Category not found" });
        }
        updateData.category = category._id;
      }
    } else if (user.role === "admin") {
      // Xác thực và cập nhật dữ liệu cho admin
      const { error, value } = adminUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      updateData = value;
    }

    // Cập nhật khóa học
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating course", error: err.message });
  }
};

const getCoursesForUser = async (req, res) => {
  try {
    const courses = await Course.find({ isAllowed: true })
      .populate("instructor", "username")
      .populate("category", "name")
      .select("-__v");

    res.status(200).json({
      message: "Get all course for users",
      data: courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

const getDetailCoures = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      isAllowed: true,
    })
      .populate("instructor", "username")
      .populate("category", "name")
      .select("-__v");

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not allowed" });
    }

    const lessons = await Lesson.find(
      { courseId: req.params.id },
      "title description order"
    )
      .sort("order")
      .select("-__v");

    res.status(200).json({
      message: "Get detail course for users",
      data: { course, lessons },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course details", error: error.message });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = { isAllowed: true };

    // Loại bỏ dấu
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

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
      try {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id; // Gắn id của category vào query
        } else {
          console.log(`Category with name ${category} not found`);
        }
      } catch (error) {
        console.error(`Error fetching category: ${error.message}`);
      }
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate("instructor", "name")
      .populate("category", "name")
      .select("-__v");

    res.status(200).json({
      message: "Get detail course for users",
      data: courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching courses", error: error.message });
  }
};

const courseController = {
  create,
  update,
  getCoursesForUser,
  getDetailCoures,
  searchCourses,
};

module.exports = courseController;
