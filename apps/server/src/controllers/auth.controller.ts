import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/async.handler";
import { authService, AuthService } from "../services/auth.service";
import { HTTPStatusCode } from "../config/status.code";

class AuthController {
  /**
   * Instance of AuthService
   */
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * register user.
   */
  public register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { user } = await this.authService.register(req.body);

      return res.status(HTTPStatusCode.Created).json({
        message: "User Created Successfully",
        data: {
          ...user,
        },
      });
    },
  );

  /**
   * login method
   */
  public login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userAgent = req.headers["user-agent"];

      const response = await this.authService.login({ ...req.body, userAgent });

      return res
        .status(HTTPStatusCode.Ok)
        .json({ message: "Login Successful", ...response });
    },
  );

  /**
   * refresh method handler
   */
  refresh = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      return res.status(HTTPStatusCode.Ok).json({
        message: "Refresh Token sent successful",
      });
    },
  );
}

const authController = new AuthController(authService);
export { authController };
