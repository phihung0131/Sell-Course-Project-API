const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    title: String,
    description: String,
    content: {
      type: String, // "video", "text"
      data: String, // URL for video, markdown for text
    },
    order: Number,
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
