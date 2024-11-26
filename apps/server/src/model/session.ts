import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sessionSchema = pgTable("t_session", {
  userId: uuid("id").defaultRandom().primaryKey().notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("updated_at").$onUpdateFn(() => new Date()), //create session for 2 days
});

export type SessionTable = typeof sessionSchema;
