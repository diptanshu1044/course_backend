import mongoose, { Schema, model } from "mongoose";

const LessonSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Video link (Cloudinary, S3, etc.)
  description: { type: String },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema], // Array of lessons
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true }, // Image URL (Cloudinary, S3, etc.)
    sections: [SectionSchema], // Array of sections with lessons
    coachId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    price: { type: Number, required: false },
    duration: { type: String, required: false },
    rating: { type: Number, default: 0 },
    students: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields
);

export const CourseModel = model("course", CourseSchema);
