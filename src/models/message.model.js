import { Schema, model } from "mongoose";

export const messageSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    senderName: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const MessageModel = model("message", messageSchema);
