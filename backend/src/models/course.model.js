import mongoose, { Schema } from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    discount: {
      type: String,
      default: "0%",
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    requirements: [
      {
        type: String,
        required: false, // Making it optional
      },
    ],
    language: {
      type: String,
      default: "English",
    },
    studentsEnrolled: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    curriculum: [sectionSchema], // Including sections and lessons
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
