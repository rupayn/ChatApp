import {Request,Response} from "express"

export const signin=async(req:Request,res:Response)=>{
    res.send("Sign in")
}
export const signup=async(req:Request,res:Response)=>{
    res.send("Sign up")
}
export const logout=async(req:Request,res:Response)=>{
    res.send("Log out")
}