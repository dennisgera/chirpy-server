ALTER TABLE "chirps" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "chirps" DROP CONSTRAINT "chirps_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chirps" ADD CONSTRAINT "chirps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;