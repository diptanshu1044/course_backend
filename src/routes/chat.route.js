import { createChat } from "../controllers/chat.controller.js";
import { Router } from "express";

const router = Router();

router.post("/create", createChat);

export default router;
