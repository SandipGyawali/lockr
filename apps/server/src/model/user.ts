import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

/**
 * user table definition
 */
export const userSchema = pgTable("t_user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  userPreferences: uuid("user_preferences").references(
    () => userPreferenceSchema.id,
  ), // relations holing the uuid of userPreferenceSchema creating fk_constraint
});

/**
 * user preference definition
 */
export const userPreferenceSchema = pgTable("t_user_preference", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  enable2FA: boolean("enable2FA").default(false),
  emailNotification: boolean("email_notification").default(true),
  twoFactorSecret: text("tw_factor_secret"),
});
