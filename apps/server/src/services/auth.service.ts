import { db } from "../db";
import type { RegisterDto, LoginDto } from "../dto/auth.dto";
import { userSchema, verificationSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/AppError";
import { HTTPStatusCode } from "../config/status.code";
import { Verification } from "../common/enums/verification.enum";
import { format, formatDistanceToNow } from "date-fns";
import { hashValue } from "../utils/bcrypt";
import { v4 as uuid } from "uuid";

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
}

const authService = new AuthService();
export { authService };
