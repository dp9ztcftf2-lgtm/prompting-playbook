import { isEntryCategory, type EntryCategory } from "@/lib/category";

export type CategoryClassification = {
  category: EntryCategory;
  confidence: number; // 0..1
  rationale: string; // <= 200 chars
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0.5;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toShortString(v: unknown, maxLen: number) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (!s) return "";
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

/**
 * Sanitizes unknown JSON into safe, durable classification data.
 * Defaults:
 * - invalid/missing category -> "other"
 * - invalid/missing confidence -> 0.5 (then clamped to 0..1)
 * - invalid/missing rationale -> ""
 */
export function sanitizeCategoryClassification(raw: unknown): CategoryClassification {
  const obj =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const categoryRaw = obj.category;
  const category: EntryCategory =
    typeof categoryRaw === "string" && isEntryCategory(categoryRaw)
      ? categoryRaw
      : "other";

  const confRaw = toNumber(obj.confidence);
  const confidence = clamp01(confRaw ?? 0.5);

  const rationale = toShortString(obj.rationale, 200);

  return { category, confidence, rationale };
}
