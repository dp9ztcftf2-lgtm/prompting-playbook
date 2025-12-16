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
  const searchParamsString = searchParams.toString();
  const currentSort =
    searchParams.get("sort") === "updated" ? "updated" : "created";

  const [query, setQuery] = useState(initialQuery);
  const trimmed = initialQuery.trim();
  const isSearching = trimmed.length > 0;

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
  
      const params = new URLSearchParams(searchParamsString);
  
      if (next.length === 0) params.delete("q");
      else params.set("q", next);
  
      const qs = params.toString();
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
  
      const currentUrl = searchParamsString
        ? `${pathname}?${searchParamsString}`
        : pathname;
  
      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 300);
  
    return () => clearTimeout(handle);
  }, [query, pathname, router, searchParamsString]);  

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

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900" htmlFor="entries-sort">
          Sort
        </label>
        <select
          id="entries-sort"
          value={currentSort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", e.target.value);
            const qs = params.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
          }}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        >
          <option value="created">Created (newest first)</option>
          <option value="updated">Updated (newest first)</option>
        </select>
      </div>


      <EntryForm onCreated={refresh} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-900">
            {isSearching ? "Search results" : "All entries"}
          </div>

          <div className="text-xs text-slate-500">
            {initialEntries.length} {isSearching ? "results" : "total"}
            {isSearching ? (
              <>
                {" "}
                for <span className="font-medium text-slate-700">“{trimmed}”</span>
              </>
            ) : null}
          </div>
        </div>
        {initialEntries.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
            {isSearching ? (
              <>
                No results for <span className="font-medium">“{trimmed}”</span>. Try a
                different term or clear search.
              </>
            ) : (
              <>No entries yet. Create your first entry above.</>
            )}
          </div>
        ) : (
          <EntriesList entries={initialEntries} onChanged={refresh} />
        )}
      </div>
    </div>
  );
}
