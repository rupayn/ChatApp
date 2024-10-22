import mongoose from "mongoose";

const MessageModel = new mongoose.Schema(
  {
    status: {
        type:String,
        default:"Pending",
        enum: ["Pending", "Accepted", "Rejected"],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    

  },
  { timestamps: true }
);

export const Request =
  mongoose.models.Request || mongoose.model("Request", MessageModel);
