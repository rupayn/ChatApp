// express.d.ts
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: string; // or the appropriate type for your user ID
  }
}

// Your existing code
import jwt, { JwtPayload } from "jsonwebtoken";
import { TryCatch } from "./error.middle.ts";
import { ErrorHandler } from "../utils/Features.ts";
import { User } from "../Models/Users.model.ts";
import { CHAT_TOKEN } from "../Constants/config.ts";

export const isAuthenticated = TryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["ChatApp"];
  if (!token) return next(new Error("You are not logged in"));
  const secret = process.env.JWT_SECRET || "frgtesvdfrt";
  const decodedData = jwt.verify(token, secret);

  if (
    typeof decodedData === "object" &&
    decodedData !== null &&
    "_id" in decodedData
  ) {
    req.user = (decodedData as JwtPayload)._id;
    next();
  } else {
    next(new Error("Invalid token"));
  }
});

export const socketAuthenticator = async (err:any, socket:any, next:any) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CHAT_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));
    const jwtSecret = process.env.JWT_SECRET||"fvghbjjgfgvbb";

    const decodedData = jwt.verify(authToken, jwtSecret);
    let uId;
    if (
      typeof decodedData === "object" &&
      decodedData !== null &&
      "_id" in decodedData
    ) {
      uId = decodedData._id;
      next();
    } else {
      next(new Error("Invalid token"));
    }
    const user = await User.findById(uId);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    (socket as any).user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};