CREATE TYPE "public"."verification_enum" AS ENUM('email_verification', 'password_reset');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t_session" (
	"id" uuid NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t_user_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enable2FA" boolean DEFAULT false,
	"email_notification" boolean DEFAULT true,
	"tw_factor_secret" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"user_preferences" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" varchar(24),
	"type" "verification_enum",
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t_session" ADD CONSTRAINT "t_session_id_t_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."t_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t_user" ADD CONSTRAINT "t_user_user_preferences_t_user_preference_id_fk" FOREIGN KEY ("user_preferences") REFERENCES "public"."t_user_preference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t_verification" ADD CONSTRAINT "t_verification_user_id_t_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."t_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
