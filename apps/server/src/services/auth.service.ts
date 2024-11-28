import { db } from "../db";
import type { LoginDto, RegisterDto } from "../dto/auth.dto";
import { sessionSchema, userSchema, verificationSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/AppError";
import { HTTPStatusCode } from "../config/status.code";
import { Verification } from "../common/enums/verification.enum";
import { compareValue, hashValue } from "../utils/bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor() {}

  /**
   * auth_register service
   */
  public async register(registerDto: RegisterDto) {
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
  public async login(loginDto: LoginDto) {
    /**
     * find if the user exists
     */
    const user = (
      await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, loginDto.email))
    ).at(0);

    if (user)
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
    const _token = jwt.sign(
      {
        userId: user.id,
        session: session[0].userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN },
    );

    const _refreshToken = jwt.sign(
      {
        userId: user.id,
        session: session[0].userId,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRES_IN,
      },
    );

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
}

const authService = new AuthService();
export { authService };
