import { NextFunction, Request, Response } from "express";
import { User } from "../../Models/Users.model.ts";
import { ErrorHandler, sendToken } from "../../utils/Features.ts";
import { compare } from "bcrypt";
import { TryCatch } from "../../middleware/error.middle.ts";
import { Chat } from "../../Models/Chat.model.ts";
export const signup = async (req: Request, res: Response) => {
  const { fname, uname, password, email } = req.body;
  const avatar = {
    public_id: "sdcs",
    public_url: "w",
  };
  const userOfDb = await User.create({ fname, uname, password, email, avatar });

  sendToken(res, userOfDb, 201, "User created");
};
export const signin = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    let usr = await User.findOne({ email }).select("+password");
    if (!usr) {
      usr = await User.findOne({ uname:email }).select("+password");
    }
    
    if (!usr) {
      return next(new ErrorHandler(`User not Found`, 404));
    }
    const pass = await compare(password, usr.password);
    if (!pass) {
      return next(new ErrorHandler(`Invalid password`, 401));
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
export const getMYProfile = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const usr = await User.findById(req.user).select("-password");
    if (!usr) return next(new ErrorHandler("User not found", 404));

    res.send(usr);
  }
);

export const searchUser = TryCatch(async (req: Request, res: Response,next:NextFunction) => {
  const { name } = req.query;
  const usr = String(req.user);

  const myChats = await Chat.find({ groupChat: false, members: usr });
  const allUsersOfMyChats = myChats.flatMap((chat) => chat.members);
  // Finding all users except me and my friends
  let allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersOfMyChats },
    uname: { $regex: name, $options: "i" },
  });

  if(allUsersExceptMeAndFriends.length==0){
    allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersOfMyChats },
      email: { $regex: name, $options: "i" },
    });
  }
  if(allUsersExceptMeAndFriends.length==0){
    allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersOfMyChats },
      fname: { $regex: name, $options: "i" },
    });
  }
  
  if(allUsersExceptMeAndFriends.length==0) return next(new ErrorHandler("We can not find user", 404));
  

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, fname, avatar }) => ({
    _id,
    fname,
    avatar: avatar.public_url,
  }));

  res.status(200).json({
    success: true,
    users
  });
}
);

  