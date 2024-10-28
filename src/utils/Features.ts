import { Response } from "express"
import jwt from "jsonwebtoken"
import { userSocketIDs } from "../../index.ts";
export const generateVerificationCode=()=>Math.round(Math.random()*1000000).toString()

export const sendToken = (res: Response<any, Record<string, any>>,user: any,code: number,msg: string)=>{
    const secret = process.env.JWT_SECRET||"frgtesvdfrt";
    const token=jwt.sign({_id:user._id},secret)
    return res.status(code).cookie("ChatApp",token,{
        maxAge:24*60*60*1000,
        sameSite:"none",
        httpOnly:true,
        secure:true
    }).json({
        success: true,
        msg
    })
}

class ErrorHandler extends Error {
  statusCode: number;

  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
  }
}

export {ErrorHandler}

export const emitEvent = (req:any, event:any, users:any, data?:any) => {
  console.log(event,data);
  
};

export const getSockets = (users = []) => {
  const sockets = users.map((user:string) => userSocketIDs.get(user.toString()));

  return sockets;
};

export const getBase64 = (file:any) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;