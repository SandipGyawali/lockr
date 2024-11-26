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

/**
 * user login req body schema
 */
export const _loginSchema = z.object({
  email: _email,
  password: _password,
  userAgent: z.string().optional(),
});
