"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { openai } from "@/lib/openai";


async function generateConciseSummary(input: { title: string; content: string | null }) {
  const title = (input.title ?? "").trim();
  const content = (input.content ?? "").trim();

  const source = content || title;
  if (!source) return "No content to summarize.";

  const resp = await openai.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    input: [
      {
        role: "system",
        content:
          "You summarize user-written notes. Return a concise summary of 2–3 sentences. No bullet points. No prefacing.",
      },
      {
        role: "user",
        content: `Title: ${title}\n\nContent:\n${content}`,
      },
    ],
  });

  return resp.output_text.trim();
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

  const summary = await generateConciseSummary({
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
