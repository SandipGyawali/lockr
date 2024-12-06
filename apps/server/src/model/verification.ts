import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user";
import { Verification } from "../common/enums/verification.enum";

/**
 * mapping typescript enum with
 */
export const verificationEnum = pgEnum(
  "verification_enum",
  Object.values(Verification) as [Verification, ...Verification[]],
);

export const verificationSchema = pgTable("t_verification", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => userSchema.id)
    .notNull(),
  code: varchar("code", { length: 24 }),
  type: verificationEnum("type"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type VerificationTable = typeof verificationSchema;
