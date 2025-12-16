"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EntryForm } from "@/components/entries/EntryForm";
import { EntriesList } from "@/components/entries/EntriesList";
import type { Entry } from "@/components/entries/EntryRow";

export function EntriesClient({
  initialEntries,
  initialQuery,
}: {
  initialEntries: Entry[];
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);

  // Keep input in sync if user navigates back/forward or arrives via deep link
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function refresh() {
    router.refresh();
  }

  // Debounce: update URL only after the user stops typing
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = query.trim();

      // Preserve other query params (if any)
      const params = new URLSearchParams(searchParams.toString());

      if (next.length === 0) params.delete("q");
      else params.set("q", next);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 300);

    return () => clearTimeout(handle);
  }, [query, pathname, router, searchParams]);

  const placeholder = useMemo(() => "Search title or content…", []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900" htmlFor="entries-search">
          Search
        </label>
        <input
          id="entries-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
        />
        <div className="text-xs text-slate-500">
          Server search will run after you pause typing.
        </div>
      </div>

      <EntryForm onCreated={refresh} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-900">All entries</div>
          <div className="text-xs text-slate-500">{initialEntries.length} total</div>
        </div>
        <EntriesList entries={initialEntries} onChanged={refresh} />
      </div>
    </div>
  );
}
