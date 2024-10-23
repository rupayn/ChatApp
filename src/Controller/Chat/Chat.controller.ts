import { ALERT, REFETCH_CHAT } from "../../Constants/event.ts";
import { Request, Response,NextFunction } from "express";
import { TryCatch } from "../../middleware/error.middle.ts";
import { emitEvent, ErrorHandler } from "../../utils/Features.ts"
import { Chat } from "../../Models/Chat.model.ts";
export const newGroupChat = TryCatch(
  async  (req: Request, res: Response, next: NextFunction)=> {
    const { name, members } = req.body;
    if (members.length < 2) {
      return next(new ErrorHandler("Group must have at least 2 members", 400));
    }
    const allMembers = [...members, req.user];

    await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} Group`);
    //   emitEvent(req, REFETCH_CHAT, members);

     res.status(201).json({
      success: true,
      message: "Group Created",
    });
  }
);
// export const newGroupChat=TryCatch(
//   async(req: Request, res: Response, next: NextFunction)=>{
//     const { name, members } = req.body;
//     if (members.length < 2) {
//       return next(new ErrorHandler("Group must have at least 2 members", 400));
//     }
//     const allMembers = [...members, req.user];

//     await Chat.create({
//       name,
//       groupChat: true,
//       creator: req.user,
//       members: allMembers,
//     });
//     res
//   }
// )
