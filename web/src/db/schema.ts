import { pgTable, serial, text, timestamp, real } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // AI-ready derived fields
  summary: text("summary"),
  summaryUpdatedAt: timestamp("summary_updated_at"),

  // Day 11: AI-generated tags
  tags: text("tags").array(), // nullable
  tagsUpdatedAt: timestamp("tags_updated_at"),

  // Day 12: AI-derived category classification
  category: text("category"), // nullable
  categoryUpdatedAt: timestamp("category_updated_at"),

  // Day 13: confidence + rationale (confidence-aware classification)
  categoryConfidence: real("category_confidence"), // nullable, 0..1
  categoryRationale: text("category_rationale"), // nullable
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
