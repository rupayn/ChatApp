import {NextFunction, Request,Response} from "express"
import { User } from "../../Models/Users.model.ts"
import { sendToken } from "../../utils/Features.ts";
import { compare } from "bcrypt";
import { TryCatch } from "../../middleware/error.middle.ts";
export const signup=async(req:Request,res:Response)=>{
    const { fname, uname, password, email } = req.body;
    const avatar = {
      public_id: "sdcs",
      public_url:"w"
    }
    const userOfDb =await User.create({fname, uname, password, email,avatar});
    
    
    sendToken(res,userOfDb,201,"User created")
}
export const signin = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const usr = await User.findOne({ email }).select("+password");
    if (!usr) {
      return next(new Error(`User not Found`));
    }
    const pass = await compare(password, usr.password);
    if (!pass) {
      return next(new Error(`Invalid password`));
    }
    sendToken(res, usr, 200, `Logged in as ${usr.fname}`);
  }
);

export const logout = (req: Request, res: Response) => {
  return res
    .status(200)
    .cookie("ChatApp", "", {
      maxAge: 0,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      msg: "You have been logged out",
    });
};
export const getMYProfile = TryCatch(async (req: Request, res: Response) => {
  const usr = await User.findById(req.user).select("-password");
  res.send(usr);
});

export const searchUser = (req: Request, res: Response) =>{
    const {name}=req.query;
    
}