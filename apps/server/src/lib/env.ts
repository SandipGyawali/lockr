import * as z from "zod";

const ENV = z.object({
  DATABASE_URL: z
    .string({
      description: "Database Connection String",
      required_error: "DatabaseUrl not mentioned",
    })
    .url()
    .min(5),
  NODE_ENV: z
    .enum(["development", "production"], {
      description: "Environment setup for server",
    })
    .default("development"),
  PORT: z.coerce
    .number({
      description: "PORT to expose the server on.",
    })
    .positive()
    .max(65535)
    .default(8001),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
});

export const env = ENV.parse(process.env);
