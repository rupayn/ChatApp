import userRoute from "./src/Routes/User.routes.ts";
import chatRoute from "./src/Routes/Chat.routes.ts";
import express from "express";
import { connectDb } from "./src/utils/ConnectDb.ts";
import dotenv from "dotenv";
import { errorMiddleware, TryCatch } from "./src/middleware/error.middle.ts";
import cookieParser from "cookie-parser";
import {Server} from "socket.io";
import cors from "cors"
import {v2 as cloudinary} from "cloudinary"
import { createServer } from "http";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./src/Constants/event.ts";
import { v4 as uuid } from "uuid";
import { corsOptions } from "./src/Constants/config.ts";
import { getSockets } from "./src/utils/Features.ts";
import { socketAuthenticator } from "./src/middleware/auth.middle.ts";
import { Message } from "./src/Models/Message.model.ts";
// import { createUser } from "./src/Seeders/user.ts";
// import { createGroupChats, createMessages, createMessagesInAChat, createSingleChats } from "./src/Seeders/Chat.ts";



const userSocketIDs=new Map()
const onlineUsers=new Set();

dotenv.config({
  path: "./.env",
});
const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials:true
  })
);
const httpServer=createServer(app)
const io = new Server(httpServer, {
   cors: corsOptions,
});
app.set("io", io);
app.use(cookieParser());
app.use(express.json());
const dbUrl = process.env.DBURL;
if (dbUrl) connectDb(dbUrl);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// createUser(5)
// createMessagesInAChat("671fdda0111fcb38edfc6499", 50);
app.use("/api/auth", userRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.use((socket, next) => {
  // cookieParser()(
  //   socket.request,
  //   socket.request.res,
  //   async (err) => await socketAuthenticator(err, socket, next)
  // );
});

io.on("connection", (socket) => {
  console.log(`Connection established and ${socket.id} connected`);
  
  // const user = socket?.user;
  const user={
    _id:"swder",
    name: "Swder",
  }
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    try{
      await Message.create(messageForDB)
    }catch(err){
      console.log(err);
      
    }
  })
   socket.on(START_TYPING, ({ members, chatId }) => {
     const membersSockets = getSockets(members);
     socket.to(membersSockets).emit(START_TYPING, { chatId });
   });

   socket.on(STOP_TYPING, ({ members, chatId }) => {
     const membersSockets = getSockets(members);
     socket.to(membersSockets).emit(STOP_TYPING, { chatId });
   });

   socket.on(CHAT_JOINED, ({ userId, members }) => {
     onlineUsers.add(userId.toString());

     const membersSocket = getSockets(members);
     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
   });

   socket.on(CHAT_LEAVED, ({ userId, members }) => {
     onlineUsers.delete(userId.toString());

     const membersSocket = getSockets(members);
     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
   });
  socket.on("disconnect", () =>{
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  })
})


app.use(errorMiddleware);
const port=parseInt(process.env.PORT||'8080');
httpServer.listen(port, () => {
  console.log(`listening on ${process.env.PORT} and it is now on ${process.env.NODE_ENV} server`);
});


export { userSocketIDs };