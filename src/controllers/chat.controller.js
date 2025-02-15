import { ChatModel } from "../models/chat.model.js";

export const createChat = async (req, res) => {
  const { userId, coachId } = req.body;
  try {
    const existingChat = await ChatModel.findOne({
      members: { $all: [userId, coachId] },
    });

    if (existingChat) {
      return res
        .status(200)
        .json({ message: "chat already exists", chat: existingChat });
    }

    const newChat = await ChatModel.create({
      members: [userId, coachId],
    });

    return res.status(200).json({ message: "chat created", chat: newChat });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
