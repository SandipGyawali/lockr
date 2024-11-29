import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/async.handler";
import { authService, AuthService } from "../services/auth.service";
import { HTTPStatusCode } from "../config/status.code";
import {
  _registerSchema,
  RegisterRequest,
} from "../common/validators/auth.schema";

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
    async (
      req: RegisterRequest,
      res: Response,
      next: NextFunction,
    ): Promise<any> => {
      const input = req.body;
      const { user } = await this.authService.register(input);

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
  public refresh = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // const refreshToken = req.headers["authorization"];
      // console.log(refreshToken);
      // await this.authService.refreshToken({ refreshToken });
      // return res.status(HTTPStatusCode.Ok).json({
      //   message: "Refresh Token sent successful",
      // });
    },
  );

  /**
   *
   * @param email
   * forgot password controller
   */
  public async forgotPassword(email: string) {}

  /**
   * logout controller
   */
  public logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { sessionId } = req.body;
      const response = await this.authService.logout({ sessionId });

      return res.status(HTTPStatusCode.Ok).json({
        message: "Logout Successful",
        isSuccess: response,
      });
    },
  );
}

const authController = new AuthController(authService);
export { authController };
