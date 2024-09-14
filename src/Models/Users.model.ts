import { timeStamp } from "console";
import mongoose from "mongoose";

const UserModel= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        public_id:{
            type:String,
            required:true
        },
        public_url:{
            type:String,
            required:true
        },
    }
},{timestamps:true})

export const User=mongoose.models.User || mongoose.model("User", UserModel)