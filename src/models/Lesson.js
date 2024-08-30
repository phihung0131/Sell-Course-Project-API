const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: String,
    description: String,
    content: String, // url video
    order: Number,
  },
  {
    timestamps: true, // automatically creates 'createdAt' and 'updatedAt' fields
  }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = {Lesson};
