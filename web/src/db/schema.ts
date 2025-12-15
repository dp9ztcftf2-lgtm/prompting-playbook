import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
