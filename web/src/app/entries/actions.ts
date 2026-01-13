"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { openai } from "@/lib/openai";

import { buildCategoryPrompt } from "@/lib/categoryPrompt";
import { safeJsonParse } from "@/lib/safeJson";
import { sanitizeCategoryClassification } from "@/lib/categoryClassification";

const CATEGORY_MODEL = "gpt-5";
const CATEGORY_VERSION = 1;
const CATEGORY_PROMPT_VERSION = "category_v1";

const SUMMARY_MODEL = "gpt-5";
const SUMMARY_VERSION = 1;
const SUMMARY_PROMPT_VERSION = "summary_v1";

const TAGS_MODEL = "gpt-5";
const TAGS_VERSION = 1;
const TAGS_PROMPT_VERSION = "tags_v1";


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

function sanitizeTag(raw: string) {
  const t = (raw ?? "")
    .toLowerCase()
    .trim()
    // remove punctuation/symbols, keep letters/numbers/spaces/hyphen
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ");

  // max 2 words
  const words = t.split(" ").filter(Boolean).slice(0, 2);
  return words.join(" ");
}

function uniq(tags: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    if (!tag) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

async function generateTags(input: { title: string; content: string | null }) {
  const title = (input.title ?? "").trim();
  const content = (input.content ?? "").trim();

  const source = content || title;
  if (!source) return [] as string[];

  const resp = await openai.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    // Key: force machine-safe output
    text: { format: { type: "json_object" } },
    input: [
      {
        role: "system",
        content: [
          "You generate tags for user-written notes.",
          'Return ONLY valid JSON with the shape: {"tags": string[]}.',
          "Rules for each tag:",
          "- lowercase",
          "- no punctuation",
          "- no duplicates",
          "- max 2 words per tag",
          "- noun phrase",
          "Return 3 to 6 tags.",
        ].join("\n"),
      },
      {
        role: "user",
        content: `Title: ${title}\n\nContent:\n${content}`,
      },
    ],
  });

  // Parse JSON safely
  let parsed: unknown;
  try {
    parsed = JSON.parse(resp.output_text);
  } catch {
    throw new Error("AI tags output was not valid JSON.");
  }

  const obj = parsed as { tags?: unknown };
  const rawTags = Array.isArray(obj.tags) ? obj.tags : [];

  const cleaned = uniq(
    rawTags
      .filter((t): t is string => typeof t === "string")
      .map(sanitizeTag)
      .filter(Boolean)
  ).slice(0, 6);

  // Ensure we meet the contract: 3–6 if possible; otherwise return what we have
  return cleaned;
}

async function generateCategoryClassification(input: {
  title: string;
  content: string | null;
}) {
  const title = (input.title ?? "").trim();
  const content = (input.content ?? "").trim();

  const source = content || title;
  if (!source) {
    return { category: "other", confidence: 0.5, rationale: "" };
  }

  const prompt = buildCategoryPrompt({ title, content });

  const resp = await openai.responses.create({
    model: "gpt-5",
    reasoning: { effort: "low" },
    // force machine-safe JSON
    text: { format: { type: "json_object" } },
    input: [
      {
        role: "system",
        content: "Return only valid JSON. No extra text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = safeJsonParse(resp.output_text);
  return sanitizeCategoryClassification(raw);
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
      summary: entries.summary,
    })
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  const entry = row[0];
  if (!entry) {
    throw new Error("Entry not found.");
  }

  // Guardrail: prevent accidental regen loops (Day 15 default behavior)
  if (entry.summary && entry.summary.trim().length > 0) {
    revalidatePath("/entries");
    revalidatePath(`/entries/${id}`);
    return;
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

      // Day 15: provenance (written only when generation happens)
      summaryModel: SUMMARY_MODEL,
      summaryVersion: SUMMARY_VERSION,
      summaryPromptVersion: SUMMARY_PROMPT_VERSION,

      updatedAt: new Date(),
    })
    .where(eq(entries.id, id));

  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
}


export async function generateEntryTagsAction(input: { id: number }) {
  const id = Number(input.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid id.");
  }

  const row = await db
    .select({
      id: entries.id,
      title: entries.title,
      content: entries.content,
      tags: entries.tags,
    })
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  const entry = row[0];
  if (!entry) {
    throw new Error("Entry not found.");
  }

  // Guardrail: prevent accidental regen loops (Day 11 default behavior)
  if (entry.tags && entry.tags.length > 0) {
    revalidatePath("/entries");
    revalidatePath(`/entries/${id}`);
    return;
  }

  const tags = await generateTags({
    title: entry.title ?? "",
    content: entry.content ?? null,
  });

  await db
    .update(entries)
    .set({
      tags,
      tagsUpdatedAt: new Date(),

      // Day 15: provenance (written only when generation happens)
      tagsModel: TAGS_MODEL,
      tagsVersion: TAGS_VERSION,
      tagsPromptVersion: TAGS_PROMPT_VERSION,

      updatedAt: new Date(),
    })
    .where(eq(entries.id, id));

  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
}

export async function generateEntryCategoryAction(input: { id: number }) {
  const id = Number(input.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid id.");
  }

  const row = await db
    .select({
      id: entries.id,
      title: entries.title,
      content: entries.content,
      category: entries.category,
    })
    .from(entries)
    .where(eq(entries.id, id))
    .limit(1);

  const entry = row[0];
  if (!entry) {
    throw new Error("Entry not found.");
  }

  // Guardrail: prevent accidental regen loops (Day 12 default behavior)
  if (entry.category && entry.category.trim().length > 0) {
    revalidatePath("/entries");
    revalidatePath(`/entries/${id}`);
    return;
  }

  const result = await generateCategoryClassification({
    title: entry.title ?? "",
    content: entry.content ?? null,
  });

  await db
  .update(entries)
  .set({
    category: result.category,
    categoryConfidence: result.confidence,
    categoryRationale: result.rationale,
    categoryUpdatedAt: new Date(),

    // Day 14: provenance (written only when generation happens)
    categoryModel: CATEGORY_MODEL,
    categoryVersion: CATEGORY_VERSION,
    categoryPromptVersion: CATEGORY_PROMPT_VERSION,

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
