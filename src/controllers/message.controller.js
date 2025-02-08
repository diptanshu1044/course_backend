import { MessageModel } from "../models/message.model.js";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user.model.js";

export const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const findUser = await UserModel.findOne({ _id: senderId });
    const message = new MessageModel({ chatId, senderId, text });
    const savedMessage = await message.save();

    console.log(savedMessage);
    return res.status(200).json({
      msg: "Message created successfully",
      message: { ...savedMessage, senderName: findUser.username },
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

export const getMessages = async (req, res) => {
  let { chatId } = req.params;
  chatId = new ObjectId(chatId);

  try {
    const messages = await MessageModel.find({ chatId });
    return res.status(200).json({
      msg: "Messages fetched successfully",
      messages,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
