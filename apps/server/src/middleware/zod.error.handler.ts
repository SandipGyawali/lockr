import { Response } from "express";
import * as z from "zod";
import { HTTPStatusCode } from "../config/status.code";

export const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(HTTPStatusCode.BadRequest).json({
    message: "Validation failed",
    errors: errors,
  });
};
