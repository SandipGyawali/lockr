import { Request, Response, NextFunction } from "express";

type _AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler =
  (controller: _AsyncControllerType): _AsyncControllerType =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.log(`The error is: ${err}`);
      next(err);
    }
  };
