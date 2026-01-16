export const CATEGORY_OPTIONS = [
    "General",
    "Tax Rules",
    "Deductions & Credits",
    "Income",
    "Filing & Payments",
    "Business",
    "Retirement",
    "Investing",
    "Health",
    "Education",
    "International",
    "Other",
  ] as const;
  
  export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
  
  export function isValidCategory(value: unknown): value is CategoryOption {
    return typeof value === "string" && (CATEGORY_OPTIONS as readonly string[]).includes(value);
  }
  
  /**
   * For AI output sanitation: convert unknown strings to a safe default.
   * If you want stricter behavior later, change the fallback to "Other".
   */
  export function coerceCategory(value: unknown): CategoryOption {
    return isValidCategory(value) ? value : "Other";
  }
  