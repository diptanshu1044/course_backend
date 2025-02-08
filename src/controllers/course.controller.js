import { CourseModel } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  const { title, description, sections, coachId, price, duration, rating } =
    req.body;

  try {
    // Parse sections if they are sent as a JSON string (from form-data)
    const parsedSections =
      typeof sections === "string" ? JSON.parse(sections) : sections;

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    if (req.files?.thumbnail) {
      const uploadResponse = await uploadOnCloudinary(
        req.files.thumbnail[0].path,
      );
      if (uploadResponse) {
        thumbnailUrl = uploadResponse.secure_url;
      }
    }

    // Upload section videos and assign them to their respective sections
    const uploadedSections = parsedSections.map((section, index) => {
      if (req.files?.videos && req.files.videos[index]) {
        return {
          ...section,
          video: req.files.videos[index].path, // Temp local path before Cloudinary upload
        };
      }
      return section;
    });

    // Upload videos to Cloudinary
    const finalSections = await Promise.all(
      uploadedSections.map(async (section) => {
        if (section.video) {
          const videoUploadResponse = await uploadOnCloudinary(section.video);
          if (videoUploadResponse) {
            return { ...section, video: videoUploadResponse.secure_url };
          }
        }
        return section;
      }),
    );

    // Create course with correct section video URLs
    const course = new CourseModel({
      title,
      description,
      thumbnail: thumbnailUrl,
      sections: finalSections,
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
