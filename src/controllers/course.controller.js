import { CourseModel } from "../models/course.model.js";
export const createCourse = async (req, res) => {
  const {
    title,
    description,
    thumbnail,
    sections,
    coachId,
    price,
    duration,
    rating,
  } = req.body;
  try {
    const course = new CourseModel({
      title,
      description,
      thumbnail,
      sections,
      coachId,
      price,
      duration,
      rating,
    });
    await course.save();
    return res.status(201).json({ msg: "Course created successfully", course });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find();
    return res
      .status(200)
      .json({ msg: "Courses fetched successfully", courses });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
