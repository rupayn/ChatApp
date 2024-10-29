import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.message ||= "Internal error";
  error.statusCode ||= 500;
  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    // stack: req.app.get('env') === 'development'? error.stack : ''
  });
};

export const TryCatch =
  (CatchedFunc: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await CatchedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
