import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { createCourse, getCourses } from "../controllers/course.controller.js";

const router = Router();

router.post(
  "/create",
  upload.fields([{ name: "thumbnail" }, { name: "videos" }]),
  createCourse,
);

router.get("/", getCourses);

export default router;
