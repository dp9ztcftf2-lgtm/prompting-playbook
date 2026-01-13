"use client";

import { useState } from "react";
import { generateEntryCategoryAction } from "@/app/entries/actions";

export function GenerateCategoryButton({
  id,
  hasCategory,
}: {
  id: number;
  hasCategory: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const disabled = isPending;

  async function onClick() {
    if (hasCategory) {
      const ok = window.confirm(
        "Regenerate category? This will overwrite the current category (and confidence/rationale)."
      );
      if (!ok) return;
    }

    setIsPending(true);
    try {
      await generateEntryCategoryAction({ id, force: hasCategory });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {isPending ? "Categorizing…" : hasCategory ? "Regenerate Category" : "Generate Category"}
    </button>
  );
}
