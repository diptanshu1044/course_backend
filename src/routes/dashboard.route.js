import { Router } from "express";
import { getCoachDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/coach", getCoachDashboard);

export default router;
