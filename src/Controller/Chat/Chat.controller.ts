import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHAT,
} from "../../Constants/event.ts";
import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../../middleware/error.middle.ts";
import { emitEvent, ErrorHandler } from "../../utils/Features.ts";
import { Chat } from "../../Models/Chat.model.ts";
import { User } from "../../Models/Users.model.ts";
import { Message } from "../../Models/Message.model.ts";
// import { uploadFilesToCloudinary } from "../../utils/cloudnaryMessage_model.ts";

export const newGroupChat = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
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
    const chat = await Chat.find({ members: req.user }).populate(
      "members",
      "fname avatar"
    );
    //   emitEvent(req, REFETCH_CHAT, members);
    const gethOtherMembers = (members: any, uid: any) =>
      members.find((member: any) => member._id.toString() !== uid.toString());

    const transformedChats = chat.map(({ _id, fname, groupChat, members }) => {
      const otherMember = gethOtherMembers(members, _id);

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
    });
    res.status(200).json({
      success: true,
      chats: transformedChats,
      message: "Group Created",
    });
  }
);

export const myGroup = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
  }).populate("members", "fname avatar");
  const groups = chats.map(({ members, _id, groupChat, fname }) => ({
    _id,
    groupChat,
    fname,
    avatar: members.slice(0, 3).map((member: any) => member.avatar.public_url),
  }));

  res.status(200).json({
    success: true,
    groups,
    message: "My Groups",
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Couldn't find user Chat", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group Chat", 400));
  }
  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please Provide Members", 404));
  }
  const usr = req.user;
  if (chat.creator.toString() !== usr?.toString()) {
    return next(new ErrorHandler("Only the creator can add members", 403));
  }
  const allNewMembersPromise = members.map((memberId: any) => {
    return User.findById(memberId, "fname");
  });

  const allMembersNew = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allMembersNew
    .filter((i: any) => !chat.members.includes(i._id.toString()))
    .map((i: any) => i._id);
  if (chat.members.length > 50) {
    return next(new ErrorHandler("max members exceeded", 403));
  }

  chat.members.push(...uniqueMembers);
  await chat.save();

  const allUsersName = allMembersNew.map((i) => i.fname).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} are members af this group`
  );

  emitEvent(req, REFETCH_CHAT, chat.members, "members are added successfully");

  res.status(200).json({
    success: true,
    members,
    message: "Members added",
  });
});

export const removeMembers = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "fname"),
  ]);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));
  const usr = req.user;
  if (userId.toString() === usr?.toString())
    return next(new ErrorHandler("You Cannot remove your self", 403));
  if (chat.creator.toString() !== usr?.toString())
    return next(new ErrorHandler("You are not allowed to remove members", 403));

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));
  const allChatMembers = chat.members.map((i: any) => i.toString());

  chat.members = chat.members.filter(
    (member: any) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    message: `${userThatWillBeRemoved.fname} has been removed from the group`,
    chatId,
  });
  emitEvent(req, REFETCH_CHAT, allChatMembers);

  res.status(200).json({
    success: true,
    message: `Member ${userThatWillBeRemoved.fname} removed successfully`,
  });
});

export const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  // console.log(chatId);

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));
  const usr = req.user;
  const remainingMembers = chat.members.filter(
    (member: any) => member.toString() !== usr?.toString()
  );

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === usr?.toString()) {
    // const randomElement = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[0];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "fname"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, {
    chatId,
    message: `User ${user.fname} has left the group`,
  });

  res.status(200).json({
    success: true,
    message: "Leave Group Successfully",
  });
});

export const uploadAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  // const [chats,me]=await Promise.all([Chat.findById(chatId),User.findById(req.user, "fname")]);

  const files: any = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please Upload Attachments", 400));

  if (files.length > 5)
    return next(new ErrorHandler("Files Can't be more than 5", 400));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "fname"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments", 400));

  //   Upload files here
  // const attachments = await uploadFilesToCloudinary(files);
  const attachments: any[] = [];
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.fname,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  res.status(200).json({
    success: true,
    message: "Upload Attachment Successfully",
    msg: message,
  });
});

export const getChatDetails = TryCatch(async (req, res, next) => {
  interface Member {
    _id: string;
    fname: string;
    avatar: { url: string };
  }
  interface Chat {
    _id: string;
    members: Member[];
  }

  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "fname avatar")
      .lean<Chat>();

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members.map(({ _id, fname, avatar }: any) => ({
      _id,
      fname,
      avatar: avatar.public_url,
    }));

    res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    res.status(200).json({
      lol: "jdwc",
      success: true,
      chat,
    });
  }
});

export const renameGroup = TryCatch(async function (req, res, next) {
  const chatId = String(req.params.id);
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 404));
  const usr = req.user;
  if (!(chat.creator.toString() === usr?.toString()))
    return next(new ErrorHandler("You are not allowed to rename group", 403));
  const { name } = req.body;
  chat.fname = name;
  console.log(req.body);

  await chat.save();
  emitEvent(req, REFETCH_CHAT, chat.members);
  res.status(200).json({
    success: true,
    message: "Group Renamed Successfully",
    data: name,
  });
});
export const deleteGroup = TryCatch(async function (req, res, next) {
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "Chat successfully deleted",
    data: "delete Group",
  });
});

// export const getMessages = TryCatch(async (req, res, next) => {
//   const chatId = req.params.id;
//   const page  = parseInt(req.query.page as string || '1',10);

//   const resultPerPage = 20;
//   const skip = (page - 1) * resultPerPage;

//   const chat = await Chat.findById(chatId);

//   if (!chat) return next(new ErrorHandler("Chat not found", 404));
//   const usr=req.user;
//   if (!chat.members.includes(usr?.toString()))
//     return next(
//       new ErrorHandler("You are not allowed to access this chat", 403)
//     );

//   const [messages, totalMessagesCount] = await Promise.all([
//     Message.find({ chat: chatId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(resultPerPage)
//       .populate("sender", "name")
//       .lean(),
//     Message.countDocuments({ chat: chatId }),
//   ]);

//   const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

//   res.status(200).json({
//     success: true,
//     messages: messages.reverse(),
//     totalPages,
//   });
// });
