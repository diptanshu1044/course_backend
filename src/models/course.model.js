import { Schema, model } from "mongoose";

export const courseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  coach: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  listOfStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  content: {
    type: String,
  },
});
