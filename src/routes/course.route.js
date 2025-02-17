import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { createCourse, getCourses ,getSingleCourse } from "../controllers/course.controller.js";

const router = Router();

router.post("/create", upload.any(), createCourse);

router.get("/", getCourses);

router.get("/:courseid",getSingleCourse);

export default router;
