import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userSchema } from "./user";

export const sessionSchema = pgTable("t_session", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("id")
    .references(() => userSchema.id)
    .notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("updated_at").$onUpdateFn(
    () => new Date(new Date().getDate() + 2),
  ), //create session for 2 days
});

export type SessionTable = typeof sessionSchema;
