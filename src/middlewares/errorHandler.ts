import { NextFunction, Request, Response } from "express";

import config from "@/configs";
import CustomError from "@/errors/CustomError";
import getErrorMessage from "@/utils/getErrorMessage";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent || config.APP_DEBUG) {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(error),
    },
  });
}
