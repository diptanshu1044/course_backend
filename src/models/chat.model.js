import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema(
  {
    members: [{ type: Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  },
);

export const ChatModel = model("chat", chatSchema);
