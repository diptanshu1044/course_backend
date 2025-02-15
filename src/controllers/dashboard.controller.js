import { CourseModel } from "../models/course.model.js";

export const getCoachDashboard = async (req, res) => {
  const { coachId } = req.body;
  try {
    const courses = await CourseModel.find({ coachId });
    const totalCourses = courses.length;
    const totalStudents = courses.reduce(
      (acc, course) => acc + course.students.length,
      0,
    );
    const totalLessons = courses.reduce(
      (acc, course) =>
        acc +
        course.sections.reduce(
          (acc, section) => acc + section.lessons.length,
          0,
        ),
      0,
    );
    return res.status(200).json({
      msg: "Dashboard data fetched successfully",
      totalCourses,
      totalStudents,
      totalLessons,
      totalCourseMaterials: totalLessons * 3,
      courses,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getClientDashboard = async (req, res) => {
  const { userId } = req.body;
  try {
    const courses = await CourseModel.find({ students: { $in: [userId] } });
    const totalCourses = courses.length;
    const totalLessons = courses.reduce(
      (acc, course) =>
        acc +
        course.sections.reduce(
          (sectionAcc, section) => sectionAcc + section.lessons.length,
          0,
        ),
      0,
    );
    const totalModules = courses.reduce(
      (acc, course) => acc + course.sections.length,
      0,
    );

    const coachIds = courses.map((course) => course.coachId);

    return res.status(200).json({
      msg: "Client dashboard data fetched successfully",
      totalCourses,
      totalLessons,
      totalModules,
      progressData: courses,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
