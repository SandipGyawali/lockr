import { AppError } from "../utils/AppError";
import { ErrorRequestHandler } from "express";
import { formatZodError } from "./zod.error.handler";
import { z } from "zod";
import { HTTPStatusCode } from "../config/status.code";

export const ErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): any => {
  console.error(error);

  /**
   * error handler for zod error
   */
  if (error instanceof z.ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      status: error.statusCode,
    });
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message: "Invalid Request body or json format.",
    });
  }

  return res.status(HTTPStatusCode.InternalServerError).json({
    message: "Internal Server Error",
    error: error?.message || "Something went wrong. Unknown error occurred",
  });
};
