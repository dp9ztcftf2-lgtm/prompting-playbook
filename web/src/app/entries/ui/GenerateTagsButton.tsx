"use client";

import { useTransition } from "react";
import { generateEntryTagsAction } from "@/app/entries/actions";

export function GenerateTagsButton({
  id,
  hasTags,
}: {
  id: number;
  hasTags: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const label = hasTags ? "Regenerate tags" : "Generate tags";

  return (
    <button
      type="button"
      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          if (hasTags) {
            const ok = window.confirm(
              "Regenerate tags? This will overwrite the current tags."
            );
            if (!ok) return;
          }

          await generateEntryTagsAction({ id, force: hasTags });
        })
      }
    >
      {isPending ? "Generating…" : label}
    </button>
  );
}
