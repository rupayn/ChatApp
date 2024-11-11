import { NextFunction, Request, Response } from "express";
import { User } from "../../Models/Users.model.js";
import { emitEvent, ErrorHandler, sendToken, successHandler } from "../../utils/Features.js";
import { compare } from "bcrypt";
import { TryCatch } from "../../middleware/error.middle.js";
import { Chat } from "../../Models/Chat.model.js";
import { NEW_REQUEST, REFETCH_CHAT } from "../../Constants/event.js";
import { Request as RequestModel } from "../../Models/Request.model.js";
import { uploadFilesToCloudinary } from "../../utils/cloudnary.js";
export const signup = TryCatch(
  async (req: Request, res: Response,next:NextFunction) => {
    const { fname, uname, password, email } = req.body;
    const file=req.file
    let tempUser = await User.findOne({ email: email });
    if (tempUser) return next(new ErrorHandler("Email already exists", 400));
    tempUser = await User.findOne({ uname: uname });
    if (tempUser) return next(new ErrorHandler("User Name already exists", 400));
  if(!file) return next(new ErrorHandler("Please upload a file",404))
  const result=await uploadFilesToCloudinary([file])
  
  const avatar = {
    public_id: result[0].public_id,
    public_url: result[0].url,
  };
  const userOfDb = await User.create({ fname, uname, password, email, avatar });

  const usr=await User.findById(userOfDb._id);

  sendToken(res, usr, 201, "User created");
}
)
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
    usr=await User.findOne({email})
    if (!usr) {
      usr = await User.findOne({ uname: email });
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
  const users = allUsersExceptMeAndFriends.map(({ _id,uname, fname, avatar }) => ({
    _id,
    fname,
    uname,
    avatar: avatar.public_url,
  }));

  res.status(200).json({
    success: true,
    users
  });
}
);

export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await RequestModel.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) {
  return next(new ErrorHandler("Friend request already sent",401))
}

  await RequestModel.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

export const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await RequestModel.find({ receiver: req.user }).populate(
    "sender",
    "fname avatar uname"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      fname: sender.fname,
      uname: sender.uname,
      avatar: sender.avatar.public_url,
    },
  }));

  res.status(200).json({
    success: true,
    allRequests,
  });
});

export const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await RequestModel.findById(requestId)
    .populate("sender", "fname")
    .populate("receiver", "fname");

  if (!request) return next(new ErrorHandler("Request not found", 404));
  const usr=req.user;
  if (request.receiver._id.toString() !== usr?.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();
    // return next(new successHandler(true,"Friend Request rejected",201))
     return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      fname: `${request.sender.fname}-${request.receiver.fname}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHAT, members);

  res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

export const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "fname avatar");

  const usr=req.user
  const friends = chats.map((e) => {
    const otherUser = e.members.find(
      (member: any) => member._id.toString() !== usr?.toString()
    );
    
    return {
      _id: otherUser?._id,
      name: otherUser.fname,
      avatar: otherUser.avatar.public_url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export const renameUser=TryCatch(async(req,res,next)=>{
  const usr=req.user
  if(!usr) return next(new ErrorHandler("Can't get user id",404))
  const UserD=await User.findById(usr).select("+password")
  if(!UserD) return next(new ErrorHandler("User not found",404))
  const {fname,email,uname,password}=req.body
  if ((fname !== UserD.fname)&&fname) UserD.fname = fname;
  if ((email !== UserD.email)&&email) UserD.email = email;
  if ((uname !== UserD.uname)&&uname) UserD.uname = uname;
  
  if(req.file){
    
    const result =await uploadFilesToCloudinary([req.file])
     const avatar = {
       public_id: result[0].public_id,
       public_url: result[0].url,
     };
     
     UserD.avatar = avatar;
  }
  if(password) UserD.password = password;
  // if(!pass) return next(new ErrorHandler("Enter correct password",404));
  
  
  await UserD.save()
  return res.json({
    success:true,
    msg:'saved'
    
  })
})