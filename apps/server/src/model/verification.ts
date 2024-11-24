import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

const verificationSchema = pgTable("t_verification", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").$onUpdateFn(() => new Date()),
});

export type VerificationTable = typeof verificationSchema;
