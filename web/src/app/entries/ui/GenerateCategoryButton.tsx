"use client";

import { useState } from "react";
import { generateEntryCategoryAction } from "@/app/entries/actions";

export function GenerateCategoryButton(props: { id: number; disabled?: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const disabled = !!props.disabled || isPending;

  async function onClick() {
    setIsPending(true);
    try {
      await generateEntryCategoryAction({ id: props.id });
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
      {isPending ? "Categorizing…" : "Generate Category"}
    </button>
  );
}
