import {
  boolean,
  pgTable,
  text,
  timestamp,
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
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

/**
 * user preference definition
 */
export const userPreferenceSchema = pgTable("t_user_preference", {
  enable2FA: boolean("enable2FA").default(false),
  emailNotification: boolean("email_notification").default(true),
  twoFactorSecret: text("tw_factor_secret"),
});
