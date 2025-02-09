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
  const { userId } = req.body; // Assuming client is identified by userId
  try {
    const courses = await CourseModel.find({ students: userId });

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

    // Calculate total time spent on courses (example placeholder logic)
    const totalTimeSpent = totalLessons * 30; // Assuming each lesson is 30 minutes

    const progressData = courses.map((course) => {
      const modulesCompleted = Math.floor(
        Math.random() * course.sections.length,
      ); // Placeholder logic, replace with actual progress tracking
      const progress = Math.round(
        (modulesCompleted / course.sections.length) * 100,
      );

      return {
        id: course._id,
        title: course.title,
        progress,
        modulesCompleted,
        totalModules: course.sections.length,
        timeSpent: `${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`, // Example time format
        nextSession: new Date().toISOString(), // Placeholder logic for the next session
        assignments: {
          completed: modulesCompleted,
          total: course.sections.length,
        }, // Placeholder logic
        quizScores: [80, 85, 90], // Placeholder logic
      };
    });

    return res.status(200).json({
      msg: "Client dashboard data fetched successfully",
      totalCourses,
      totalLessons,
      totalModules,
      progressData,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
