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
        user,
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
class successHandler extends Error {
  statusCode: number;
  success: boolean;
  msg: string;

  constructor(success:boolean,msg: string, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.success= success;
    this.msg= msg;
    
  }
  
}

export {ErrorHandler,successHandler}

export const emitEvent = (req:any, event:any, users:any, data?:any) => {
  console.log(event,data);
  
};

export const getSockets = (users = []) =>{ 
  const sockets = users
    .map((user: string) => userSocketIDs.get(user.toString()))
    .filter((socketId): socketId is string => socketId !== undefined); 
  // console.log("from getSockets ", userSocketIDs)
  return sockets;
};

export const getBase64 = (file:any) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;