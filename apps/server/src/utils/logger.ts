import { createLogger, format, transports } from "winston";
import { env } from "../lib/env";

const _format = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:ss" }),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

// logger instance
export const logger = createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: _format,
  transports: [new transports.Console()],
});
