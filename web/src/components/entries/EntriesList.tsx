"use client";

import { Entry, EntryRow } from "./EntryRow";

export function EntriesList({
  entries,
  onChanged,
}: {
  entries: Entry[];
  onChanged?: () => void;
}) {
  if (!entries.length) {
    return (
      <div className="rounded-lg border bg-white px-4 py-10 text-center text-sm text-slate-500">
        No entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <EntryRow key={e.id} entry={e} onChanged={onChanged} />
      ))}
    </div>
  );
}
