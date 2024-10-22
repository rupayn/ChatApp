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
