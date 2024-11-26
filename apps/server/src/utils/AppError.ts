import { HTTPStatusCode } from "../config/status.code";

export class AppError extends Error {
  public statusCode: number;
  public isOperational?: boolean;

  constructor(
    message: string,
    statusCode: number = HTTPStatusCode.InternalServerError,
    isOperational: boolean = false,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
