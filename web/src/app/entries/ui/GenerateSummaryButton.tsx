"use client";

import { useTransition } from "react";
import { generateEntrySummaryAction } from "@/app/entries/actions";

export function GenerateSummaryButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await generateEntrySummaryAction({ id });
        })
      }
    >
      {isPending ? "Generating…" : "Generate summary"}
    </button>
  );
}
