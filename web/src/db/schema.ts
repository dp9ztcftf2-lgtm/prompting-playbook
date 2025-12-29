import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
