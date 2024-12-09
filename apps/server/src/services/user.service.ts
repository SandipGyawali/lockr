import { eq } from "drizzle-orm";
import { db } from "../db";
import { userSchema } from "../model/user";

export class UserService {
  constructor() {}

  /**
   * Note: find user By it's user id
   * @param userId
   * @returns
   */
  public async findById(userId: string): Promise<any | null> {
    const user = (
      await db.select().from(userSchema).where(eq(userSchema.id, userId))
    ).at(0);

    delete user.password;
    return user || null;
  }
}

const userService = new UserService();
export { userService };
