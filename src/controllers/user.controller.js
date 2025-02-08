import { UserModel } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    console.log(username, email, password, role);
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

    console.log(accessToken, refreshToken);

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
