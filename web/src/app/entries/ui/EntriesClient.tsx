"use client";

import { useRouter } from "next/navigation";
import { EntryForm } from "@/components/entries/EntryForm";
import { EntriesList } from "@/components/entries/EntriesList";
import type { Entry } from "@/components/entries/EntryRow";

export function EntriesClient({ initialEntries }: { initialEntries: Entry[] }) {
  const router = useRouter();

  function refresh() {
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <EntryForm onCreated={refresh} />

      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-900">All entries</div>
        <EntriesList entries={initialEntries} onChanged={refresh} />
      </div>
    </div>
  );
}
