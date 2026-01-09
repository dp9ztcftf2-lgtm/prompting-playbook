import { ENTRY_CATEGORIES } from "@/lib/category";

export function buildCategoryPrompt(input: { title: string; content: string }) {
  return `
You are classifying an entry into exactly one category.

Allowed categories:
${ENTRY_CATEGORIES.map((c) => `- ${c}`).join("\n")}

Return ONLY valid JSON with EXACTLY these keys:
- "category": one of the allowed categories
- "confidence": a number from 0.0 to 1.0
- "rationale": 1-2 sentences max, grounded in the title/content, no sensitive data, max 200 characters

No markdown. No code fences. No additional keys. No extra text.

TITLE:
${input.title}

CONTENT:
${input.content}
`.trim();
}
