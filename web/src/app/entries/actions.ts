"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";

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
