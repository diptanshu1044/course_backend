import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (file) => {
  try {
    if (!file) {
      return;
    }
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "course",
    });

    console.log("File is uploaded on cloudinary");
    console.log(res);
    fs.unlinkSync(file);
    return res;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(file);
    return res.status(500).json({ message: "Server error" });
  }
};
