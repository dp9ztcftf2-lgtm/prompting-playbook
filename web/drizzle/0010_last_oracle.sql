ALTER TABLE "entries" ADD COLUMN "category_review_status" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "category_override" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "category_override_reason" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "category_overridden_at" timestamp;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "source_type" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "source_url" text;