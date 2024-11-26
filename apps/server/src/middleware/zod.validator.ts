import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HTTPStatusCode } from "../config/status.code";

/**
 *
 * @param schema
 * <T> -> Generic infer type based on the request body
 * zod input validation middleware
 */
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): any => {
    console.log(req.body);
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(HTTPStatusCode.BadRequest).json({
        error: result.error.errors,
      });
    }

    next();
  };
