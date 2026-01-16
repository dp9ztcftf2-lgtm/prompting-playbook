import {
  pgTable,
  serial,
  text,
  timestamp,
  real,
  integer,
} from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // AI-ready derived fields
  summary: text("summary"),
  summaryUpdatedAt: timestamp("summary_updated_at"),

  // Day 15: provenance + versioning (summary)
  summaryModel: text("summary_model"), // nullable
  summaryVersion: integer("summary_version"), // nullable
  summaryPromptVersion: text("summary_prompt_version"), // nullable (optional)

  // Day 11: AI-generated tags
  tags: text("tags").array(), // nullable
  tagsUpdatedAt: timestamp("tags_updated_at"),

  // Day 15: provenance + versioning (tags)
  tagsModel: text("tags_model"), // nullable
  tagsVersion: integer("tags_version"), // nullable
  tagsPromptVersion: text("tags_prompt_version"), // nullable (optional)

  // Day 12: AI-derived category classification
  category: text("category"), // nullable
  categoryUpdatedAt: timestamp("category_updated_at"),

  // Day 13: confidence + rationale (confidence-aware classification)
  categoryConfidence: real("category_confidence"), // nullable, 0..1
  categoryRationale: text("category_rationale"), // nullable

  // Day 14: provenance + versioning (category only)
  categoryModel: text("category_model"), // nullable
  categoryVersion: integer("category_version"), // nullable
  categoryPromptVersion: text("category_prompt_version"), // nullable (optional)

  // Day 16: human review + override loop (category)
  categoryReviewStatus: text("category_review_status"), // "auto" | "reviewed" | "overridden"
  categoryOverride: text("category_override"),
  categoryOverrideReason: text("category_override_reason"),
  categoryOverriddenAt: timestamp("category_overridden_at"),

  // Day 16: minimal Iris ingestion bridge
  sourceType: text("source_type"), // e.g. "note" | "irs_pub" | "web"
  sourceUrl: text("source_url"),

});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
