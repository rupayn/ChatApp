import bcrypt from "bcrypt"
import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    uname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select:false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      public_url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

UserModel.pre("save",async function(next){
    if(!this.isModified("password")) next()
    this.password=await bcrypt.hash(this.password,10)
}
)

export const User=mongoose.models.User || mongoose.model("User", UserModel)