import { CourseModel } from "../models/course.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  const { title, description, sections, coachId, price, duration, rating } =
    req.body;
  try {
    // Parse sections if they are sent as a JSON string (from form-data)
    const parsedSections =
      typeof sections === "string" ? JSON.parse(sections) : sections;

    // Upload thumbnail if provided
    let thumbnail = null;
    req.files.map((file) => {
      if (file.fieldname === "thumbnail") {
        thumbnail = file;
      }
    });
    const uploadResponse = await uploadOnCloudinary(thumbnail.path);
    let thumbnailUrl = null;
    if (uploadResponse) {
      thumbnailUrl = uploadResponse.secure_url;
    }

    // Upload section videos and assign them to their respective sections

    let videos = [];
    req.files.map((file) => {
      if (file.fieldname !== "thumbnail") {
        videos.push(file);
      }
    });
    parsedSections.map((section, index) => {
      section.lessons.map((lesson, i) => {
        const str = `sections[${index}][lessons][${i}][video]`;
        videos.filter((video) => {
          if (video.fieldname === str) {
            lesson.video = video.path;
          }
        });
      });
    });

    await Promise.all(
      parsedSections.map(async (section) => {
        await Promise.all(
          section.lessons.map(async (lesson) => {
            try {
              if (lesson.video) {
                const videoUploadResponse = await uploadOnCloudinary(
                  lesson.video,
                );
                if (videoUploadResponse) {
                  lesson.videoUrl = videoUploadResponse.secure_url;
                }
              }
            } catch (err) {
              console.log("Error uploading video to Cloudinary", err);
              throw new Error("Server error");
            }
          }),
        );
      }),
    );

    const course = new CourseModel({
      title,
      description,
      thumbnail: thumbnailUrl,
      sections: parsedSections,
      coachId,
      price,
      duration: duration[0],
      rating,
    });

    await course.save();
    console.log("Course created successfully");
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
