import { body, check, param, query, validationResult } from "express-validator";
import { ErrorHandler } from "./Features.ts";
import { NextFunction, Request } from "express";

export const validateHandler = (req:any, res:any, next:any) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));

};
export const registerValidator = () => [
  body("fname", "Please Enter Full Name").notEmpty(),
  body("uname", "Please Enter Username").notEmpty(),
  body("email", "Please Enter email").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
//   check("avatar", "Please Enter Avatar").notEmpty()
];

export const loginValidator = () => [
  body("email", "Please Enter Username or email").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

export const newGroupValidator = () => [
  body("fname", "Please Enter Group's Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("New Members must be 2-100"),
];

export const addMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

export const removeMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("userId", "Please Enter User ID").notEmpty(),
];

export const leaveGroupValidator = () =>[
    param("id","Please Enter Group's ID").notEmpty()
]  
export const getMessagesValidator = () =>[
    param("id","Please Enter Group's ID").notEmpty(), 
]  
export const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("files")
  .notEmpty()
  .withMessage("Please select attachments to send")
  .isArray({min: 1, max:5})
  .withMessage("Attachments must be in the range of 1 to 5"),
];

export const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()];

export const renameValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

export const sendRequestValidator = () => [
  body("userId", "Please Enter User ID").notEmpty(),
];

export const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];