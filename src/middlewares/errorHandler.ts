import { NextFunction, Request, Response } from "express";

import config from "@/configs";
import CustomError from "@/errors/CustomError";
import getErrorMessage from "@/utils/getErrorMessage";
import logger from "@/utils/logger";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  logger.error("Error caught by errorHandler", {
    error,
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
    ip: req.ip,
  });

  // if response already sent or during debug mode, let the express.js default error handlers handle it
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  // if error is in our custom format, we can format it as our way
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  // default
  res.status(500).json({
    error: {
      message: getErrorMessage(error),
    },
  });
}
