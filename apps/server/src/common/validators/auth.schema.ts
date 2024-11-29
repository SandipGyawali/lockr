import { Request } from "express";
import * as z from "zod";

const _email = z.string().trim().email().min(1);
const _password = z.string().trim().min(6).max(16);

/**
 * user register endPoint req body schema
 */
export const _registerSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    email: _email,
    password: _password,
    confirmPassword: _password,
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Password doesn't match",
  });

export type RegisterRequest = Request<
  any,
  any,
  Required<z.infer<typeof _registerSchema>>
>;

/**
 * user login req body schema
 */
export const _loginSchema = z.object({
  email: _email,
  password: _password,
});

/**
 * user logout request body schema
 */
export const _logoutSchema = z.object({
  sessionId: z.string().min(2, { message: "SessionId not provided" }),
});
