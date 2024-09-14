import mongoose from "mongoose";

const ChatModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: String,
      default: false,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    members:[
      {
        type: mongoose.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export const Chat=mongoose.models.Chat || mongoose.model("Chat",ChatModel)