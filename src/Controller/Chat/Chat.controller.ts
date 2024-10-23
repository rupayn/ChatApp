import { ALERT, REFETCH_CHAT } from "../../Constants/event.ts";
import { Request, Response,NextFunction } from "express";
import { TryCatch } from "../../middleware/error.middle.ts";
import { emitEvent, ErrorHandler } from "../../utils/Features.ts"
import { Chat } from "../../Models/Chat.model.ts";
import { User } from "../../Models/Users.model.ts";

export const newGroupChat = TryCatch(
  async  (req: Request, res: Response, next: NextFunction)=> {
    const { fname, members } = req.body;
    if (members.length < 2) {
      return next(new ErrorHandler("Group must have at least 2 members", 400));
    }
    const allMembers = [...members, req.user];

    await Chat.create({
      fname,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${fname} Group`);
    //   emitEvent(req, REFETCH_CHAT, members);

     res.status(201).json({
      success: true,
      message: "Group Created",
    });
  }
);

export const myChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.find({members:req.user}).populate(
      "members",
      "fname avatar"
    )
    //   emitEvent(req, REFETCH_CHAT, members);
    const gethOtherMembers=(members:any,uid:any)=>members.find((member:any) => member._id.toString() !== uid.toString())
    
    const transformedChats=chat.map(
      ({_id,fname,groupChat,members})=>{
        const otherMember=gethOtherMembers(members,_id)
        
        return {
          _id,
          groupChat,
          fname: groupChat ? fname : otherMember.fname,
          avatar: groupChat
            ? members
                .slice(0, 3)
                .map(
                  (member: { avatar: { public_url: string } }) =>
                    member.avatar.public_url
                )
            : [otherMember.avatar.public_url],
          members: members.reduce((prev: any, curr: any) => {
            const u = req.user;
            if (curr._id.toString() !== u?.toString()) {
              prev.push(curr._id);
            }
            return prev;
          }, []),
          creator: req.user,
        };
      }
    )
    res.status(200).json({
      success: true,
      chats:transformedChats,
      message: "Group Created",
    });
  }
);

export const myGroup =  TryCatch(async (req, res,next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
  }).populate("members","fname avatar");
  const groups=chats.map(({members,_id,groupChat,fname})=>({
    _id,
    groupChat,
    fname,
    avatar: members.slice(0,3).map((member:any)=>member.avatar.public_url)
  }));
  
  res.status(200).json({
    success: true,
    groups,
    message: "My Groups",
  })
})

export const addMembers =  TryCatch(async (req, res,next) => {
  
  const {chatId,members} = req.body;
  
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Couldn't find user Chat",404))
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group Chat",400))
  }
  if (!members || members.length<1) {
    return next(new ErrorHandler("Please Provide Members", 404));
  }
  const usr=req.user;
  if(chat.creator.toString()!== usr?.toString()){
    return next(new ErrorHandler("Only the creator can add members",403))
  }
  const allNewMembersPromise = members.map((memberId:any)=>{ return User.findById(memberId,"fname")})

  const allMembersNew=await Promise.all(allNewMembersPromise)

  const uniqueMembers = allMembersNew
    .filter((i:any) => !chat.members.includes(i._id.toString()))
    .map((i:any) => i._id);
  if (chat.members.length>50) {
    return next(new ErrorHandler("max members exceeded",403)) 
  }

  chat.members.push(...uniqueMembers)
  await chat.save();

  const allUsersName=allMembersNew.map((i)=>i.fname).join(",")

  emitEvent(req,ALERT,chat.members,`${allUsersName} are members af this group`)

  emitEvent(req,REFETCH_CHAT,chat.members,"members are added successfully")

  res.status(200).json({
    success: true,
    members,
    message: "Members added",
  })
})

export const removeMembers =  TryCatch(async (req, res,next) => {
  
  const {userId,chatId} = req.body;
   const [chat, userThatWillBeRemoved] = await Promise.all([
     Chat.findById(chatId),
     User.findById(userId, "fname"),
   ]);
 
   if (!chat) return next(new ErrorHandler("Chat not found", 404));

   if (!chat.groupChat)
     return next(new ErrorHandler("This is not a group chat", 400));
  const usr=req.user;
   if (chat.creator.toString() !== usr?.toString())
     return next(new ErrorHandler("You are not allowed to remove members", 403));

   if (chat.members.length <= 3)
     return next(new ErrorHandler("Group must have at least 3 members", 400));
   const allChatMembers = chat.members.map((i:any) => i.toString());

   chat.members = chat.members.filter(
     (member:any) => member.toString() !== userId.toString()
   );

   await chat.save();

   emitEvent(req, ALERT, chat.members, {
     message: `${userThatWillBeRemoved.name} has been removed from the group`,
     chatId,
   });
  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  })
})