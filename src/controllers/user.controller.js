import { ChatModel } from "../models/chat.model.js";
import { CourseModel } from "../models/course.model.js";
import { UserModel } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
      role,
    });

    const createdUser = await UserModel.findById(newUser._id).select(
      "-password -refreshToken",
    );

    return res
      .status(201)
      .cookie("refreshToken", newUser.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("accessToken", newUser.accessToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!(username || email)) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser._id,
    );

    const loggedInUser = await UserModel.findById(existingUser._id).select(
      "-password -refreshToken",
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User logged in successfully", user: loggedInUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logoutUser = async (req, res) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
};

export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await UserModel.findById(decodedToken?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(incomingRefreshToken === user?.refreshToken)) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed successfully",
        token: accessToken,
      });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
};

export const enrollCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  try {
    const selectedCourse = await CourseModel.findById(courseId);
    if (!selectedCourse) {
      return res.status(401).json({ message: "Invalid course" });
    }
    selectedCourse.students.push(userId);
    selectedCourse.save();
    return res.status(200).json({
      message: "student successfully enrolled",
      course: selectedCourse,
    });
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

export const getUserCoaches = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const courses = await CourseModel.find({ students: { $in: [userId] } });
    const coachIds = courses.map((course) => course.coachId);
    const coaches = await UserModel.find({ _id: { $in: coachIds } });
    return res.status(200).json({
      message: "Coaches fetched successfully",
      coaches,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { coachId } = req.body;
    if (!coachId) {
      return res.status(400).json({ message: "Coach ID is required" });
    }

    const chats = await ChatModel.find({ members: coachId });

    console.log("Chats found:", chats);

    // Extract student IDs, filtering out the coach's ID
    const studentIds = chats.flatMap((chat) =>
      chat.members.filter((id) => id.toString() !== coachId.toString()),
    );

    console.log("Extracted Student IDs:", studentIds);

    // Validate studentIds before querying
    const validStudentIds = studentIds.filter(mongoose.Types.ObjectId.isValid);

    if (validStudentIds.length === 0) {
      return res.status(200).json({
        message: "No students found",
        students: [],
      });
    }

    const students = await UserModel.find({ _id: { $in: validStudentIds } });

    console.log("Students found:", students);

    return res.status(200).json({
      message: "Students fetched successfully",
      students,
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    return res.status(500).json({ message: err.message });
  }
};
