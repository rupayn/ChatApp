import {Request,Response} from "express"
import { User } from "../../Models/Users.model.ts"
export const signup=async(req:Request,res:Response)=>{
    const {name,username,password}=req.body()
    // User.create()
    res.status(201).send("Sign up Successfully")
}
export const signin=async(req:Request,res:Response)=>{
    res.send("Sign in")
}
export const logout=async(req:Request,res:Response)=>{
    res.send("Log out")
}