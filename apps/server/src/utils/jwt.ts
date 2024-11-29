import jwt, { VerifyOptions } from "jsonwebtoken";
import { env } from "../lib/env";

interface TokenParams {
  userId: string;
  session: string;
  expiresIn: "1d" | "2d" | "3d" | "4d" | "5d" | "6d" | "7d";
  isRefreshToken: boolean;
}

/**
 * sign jwt token based on the payload and option provided
 */
export const signToken = ({
  userId,
  session,
  isRefreshToken,
  expiresIn,
}: TokenParams): String => {
  const _key = isRefreshToken ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;

  return jwt.sign(
    {
      userId,
      session,
    },
    _key,
    {
      expiresIn,
    },
  );
};
/**
 * verify jwt-token based on the provided token params
 */
export const verifyToken = (
  token: string,
  isRefreshToken: boolean,
  options?: VerifyOptions & { secret: string },
): any => {
  try {
    let { secret, ...opts } = options || {};

    if (!secret) {
      secret = isRefreshToken
        ? env.JWT_REFRESH_SECRET
        : (env.JWT_SECRET as string);
    }

    const payload = jwt.verify(token, secret, {
      ...opts,
    });

    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
