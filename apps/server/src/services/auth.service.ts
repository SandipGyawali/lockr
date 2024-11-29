import { db } from "../db";
import type {
  LoginInterface,
  LogoutInterface,
  RegisterInterface,
  ResetPasswordInterface,
} from "../dto/auth.dto";
import { sessionSchema, userSchema, verificationSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/AppError";
import { HTTPStatusCode } from "../config/status.code";
import { Verification } from "../common/enums/verification.enum";
import { compareValue, hashValue } from "../utils/bcrypt";
import { v4 as uuid } from "uuid";
import { signToken, verifyToken } from "../utils/jwt";

export class AuthService {
  constructor() {}

  /**
   * auth_register service
   */
  public async register(registerDto: RegisterInterface) {
    // request input field
    const input = registerDto;

    /**
     * check for the existing user
     */
    const userExists = (
      await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, input.email))
    ).at(0);

    if (userExists) {
      throw new AppError(
        "User already exists with provided email",
        HTTPStatusCode.BadRequest,
      );
    }

    /**
     * hash password
     */
    const hashPassword: string = await hashValue(input.password);

    /**
     * insert user in database
     */
    const [user] = await db
      .insert(userSchema)
      .values({
        name: input.name,
        email: input.email,
        password: hashPassword,
      })
      .returning();

    /**
     * setup verification if user exists
     */
    if (!user)
      throw new AppError(
        "Error creating name",
        HTTPStatusCode.InternalServerError,
      );

    await db.insert(verificationSchema).values({
      userId: user.id,
      type: Verification.EMAIL_VERIFICATION,
      code: uuid().toString().substring(0, 20),
      expiresAt: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
    });

    return {
      user,
    };
  }

  /**
   * login service
   */
  public async login(loginDto: LoginInterface) {
    /**
     * find if the user exists
     */
    const user = (
      await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, loginDto.email))
    ).at(0);

    if (!user)
      throw new AppError(
        "Invalid email or password!",
        HTTPStatusCode.BadRequest,
      );

    // compare password
    const _matchPassword = await compareValue(loginDto.password, user.password);

    if (!_matchPassword) {
      throw new AppError(
        "Invalid password. Please Enter a valid Password",
        HTTPStatusCode.BadRequest,
      );
    }

    /**
     * store the session login with the userAgent and also
     * check if the user has enabled the 2fa.
     */
    const session = await db
      .insert(sessionSchema)
      .values({
        userId: user.id,
        userAgent: loginDto.userAgent,
      })
      .returning();

    /**
     * generate refresh and access token
     */
    const _token = signToken({
      expiresIn: "1d",
      isRefreshToken: false,
      session: session[0].userId,
      userId: user.id,
    });

    const _refreshToken = signToken({
      expiresIn: "3d",
      isRefreshToken: true,
      session: session[0].userId,
      userId: user.id,
    });

    delete user.password;

    return {
      data: {
        ...user,
      },
      token: {
        accessToken: _token,
        refreshToken: _refreshToken,
      },
    };
  }

  /**
   * refresh token handler
   */
  public async refreshToken({ refreshToken }: { refreshToken: string }) {
    /**
     * verify the incoming jwt request
     */
    const { payload } = verifyToken(refreshToken, true);

    if (!payload) {
      throw new AppError("Invalid refresh token");
    }

    const session = (
      await db
        .select()
        .from(sessionSchema)
        .where(eq(sessionSchema.userId, payload.session))
    ).at(0);

    const _date = Date.now();

    if (!session) {
      throw new AppError("Session Doesn't exists", HTTPStatusCode.NotFound);
    }

    if (session.expiresAt.getTime() <= _date) {
      throw new AppError("Session Expired", HTTPStatusCode.Unauthorized);
    }

    // refresh the session.
    const sessionRefresh = session.expiresAt.getTime() - _date;
  }

  public async forgotPassword(email: string) {
    // const user = (
    //   await db.select().from(userSchema).where(eq(userSchema.email, email))
    // ).at(0);
    // if(!user){
    //   throw new AppError("User not found")
    // }
  }

  public async resetPassword({
    password,
    _verificationCode,
  }: ResetPasswordInterface) {
    const _isValidCode = (
      await db
        .select()
        .from(verificationSchema)
        .where(eq(verificationSchema.code, _verificationCode))
    ).at(0);

    /**
     * case for validation not successful
     */
    if (_isValidCode)
      throw new AppError("Invalid or expired verification code.");

    /**
     * successful case after validating code
     */
    const hashedPassword = await hashValue(password);

    const updatedUser = (
      await db
        .update(userSchema)
        .set({
          password: hashedPassword,
        })
        .where(eq(userSchema.id, _isValidCode.userId))
        .returning()
    ).at(0);

    if (!updatedUser) throw new AppError("Failed to reset password");

    // remove the verification instance for the specific user
    await db
      .delete(verificationSchema)
      .where(eq(verificationSchema.userId, _isValidCode.userId));

    delete updatedUser.password;
    return {
      user: updatedUser,
    };
  }

  /**
   * logout service handler
   * @param sessionId
   * @returns boolean
   */
  public async logout({ sessionId }: LogoutInterface) {
    const _sessionRemove = (
      await db
        .delete(sessionSchema)
        .where(eq(sessionSchema.id, sessionId))
        .returning()
    ).at(0);

    if (!_sessionRemove)
      throw new AppError("Error while removing session. Please try again");

    return true;
  }
}

const authService = new AuthService();
export { authService };
