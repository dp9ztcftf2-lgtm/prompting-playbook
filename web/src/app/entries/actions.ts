"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";


function makeStubSummary(input: { title: string; content: string | null }) {
  const base = ((input.content ?? "").trim() || input.title.trim()).replace(
    /\s+/g,
    " "
  );
  if (!base) return "No content to summarize.";
  return base.slice(0, 240).trim();
}

export async function generateEntrySummaryAction(input: { id: number }) {
  const id = Number(input.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid id.");
  }

  const row = await db
    .select({
      id: entries.id,
      title: entries.title,
      content: entries.content,
    })
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  const entry = row[0];
  if (!entry) {
    throw new Error("Entry not found.");
  }

  const summary = makeStubSummary({
    title: entry.title ?? "",
    content: entry.content ?? null,
  });

  await db
    .update(entries)
    .set({
      summary,
      summaryUpdatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(entries.id, id));

  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
}


export async function createEntryAction(input: {
  title: string;
  content?: string | null;
}) {
  const title = (input.title ?? "").trim();
  const content =
    input.content === undefined ? null : (input.content ?? "").trim();

  if (!title) {
    throw new Error("Title is required.");
  }

  await db.insert(entries).values({
    title,
    content,
    updatedAt: new Date(),
  });

  revalidatePath("/entries");
}

export async function updateEntryAction(input: {
  id: number;
  title: string;
  content?: string | null;
}) {
  const id = Number(input.id);
  const title = (input.title ?? "").trim();
  const content =
    input.content === undefined ? null : (input.content ?? "").trim();

  if (!Number.isFinite(id)) {
    throw new Error("Invalid id.");
  }
  if (!title) {
    throw new Error("Title is required.");
  }

  await db
    .update(entries)
    .set({
      title,
      content,
      updatedAt: new Date(),
    })
    .where(eq(entries.id, id));

  revalidatePath("/entries");
}

export async function deleteEntryAction(input: { id: number }) {
  const id = Number(input.id);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid id.");
  }

  await db.delete(entries).where(eq(entries.id, id));

  revalidatePath("/entries");
}
