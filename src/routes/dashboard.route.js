import { Router } from "express";
import {
  getCoachDashboard,
  getClientDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/coach", getCoachDashboard);
router.post("/client", getClientDashboard);

export default router;
