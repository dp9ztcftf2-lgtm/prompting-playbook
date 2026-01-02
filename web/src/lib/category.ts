export const ENTRY_CATEGORIES = [
    "overview",
    "definitions",
    "eligibility",
    "procedure",
    "calculation",
    "reference",
    "other",
  ] as const;
  
  export type EntryCategory = (typeof ENTRY_CATEGORIES)[number];
  
  export function isEntryCategory(value: string): value is EntryCategory {
    return (ENTRY_CATEGORIES as readonly string[]).includes(value);
  }
  