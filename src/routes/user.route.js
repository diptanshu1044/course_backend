import { Router } from "express";
import {
  login,
  logoutUser,
  signup,
  refreshAccessToken,
  enrollCourse,
  getUserCoaches,
  getStudents,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/enroll", enrollCourse);
router.post("/getCoaches", getUserCoaches);
router.post("/getStudents", getStudents);

export default router;
