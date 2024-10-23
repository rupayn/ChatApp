import mongoose from "mongoose";

const ChatModel = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
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