"use client";

import { useTransition } from "react";
import { generateEntryTagsAction } from "@/app/entries/actions";

export function GenerateTagsButton({ id, disabled }: { id: number; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => { await generateEntryTagsAction({ id }); })}
      disabled={disabled || isPending}
      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {isPending ? "Generating..." : "Generate tags"}
    </button>
  );
}
