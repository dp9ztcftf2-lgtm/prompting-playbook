ALTER TABLE "entries" ADD COLUMN "tags_model" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "tags_version" integer;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "tags_prompt_version" text;