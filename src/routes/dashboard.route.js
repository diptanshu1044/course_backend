import { Router } from "express";
import {
  getCoachDashboard,
  getClientDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/coach", getCoachDashboard);
router.get("/client", getClientDashboard);

export default router;
