ALTER TABLE "feedfollows" RENAME TO "feed_follows";--> statement-breakpoint
ALTER TABLE "feed_follows" DROP CONSTRAINT "feedfollows_user_id_feed_id_unique";--> statement-breakpoint
ALTER TABLE "feed_follows" DROP CONSTRAINT "feedfollows_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_follows" DROP CONSTRAINT "feedfollows_feed_id_feeds_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_user_id_feed_id_unique" UNIQUE("user_id","feed_id");