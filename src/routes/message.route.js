import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.post("/create", createMessage);
messageRouter.get("/:chatId", getMessages);

export default messageRouter;
