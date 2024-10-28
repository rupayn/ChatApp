import userRoute from "./src/Routes/User.routes.ts";
import chatRoute from "./src/Routes/Chat.routes.ts";
import express from "express";
import { connectDb } from "./src/utils/ConnectDb.ts";
import dotenv from "dotenv";
import { errorMiddleware } from "./src/middleware/error.middle.ts";
import cookieParser from "cookie-parser";
import { createUser } from "./src/Seeders/user.ts";
import { createGroupChats, createMessages, createMessagesInAChat, createSingleChats } from "./src/Seeders/Chat.ts";

const userSocketIDs=new Map()

dotenv.config({
  path: "./.env",
});
const app = express();
app.use(cookieParser());
app.use(express.json());
const dbUrl = process.env.DBURL;
if (dbUrl) connectDb(dbUrl);
// createUser(5)
// createMessagesInAChat("671fdda0111fcb38edfc6499", 50);
app.use("/api/auth", userRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});


export { userSocketIDs };