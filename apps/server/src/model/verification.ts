import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user";

export const verificationSchema = pgTable("t_verification", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => userSchema.id)
    .notNull(),
  code: varchar("code", { length: 24 }),
  type: text("type"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type VerificationTable = typeof verificationSchema;
