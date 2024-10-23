import { ALERT, REFETCH_CHAT } from "../../Constants/event.ts";
import { Request, Response,NextFunction } from "express";
import { TryCatch } from "../../middleware/error.middle.ts";
import { emitEvent, ErrorHandler } from "../../utils/Features.ts"
import { Chat } from "../../Models/Chat.model.ts";
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