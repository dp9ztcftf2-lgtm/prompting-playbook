"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EntryForm } from "@/components/entries/EntryForm";
import { EntriesList } from "@/components/entries/EntriesList";
import type { Entry } from "@/components/entries/EntryRow";

export function EntriesClient({
  initialEntries,
  initialQuery,
  sort,
  page,
  totalCount,
  pageCount,
}: {
  initialEntries: Entry[];
  initialQuery: string;
  sort: "created" | "updated";
  page: number;
  totalCount: number;
  pageCount: number;
}) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const currentSort = sort;


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

      // Current q in the URL (normalized to "")
      const currentQ = (params.get("q") ?? "").trim();

      // Compute what q *would* be after this change
      const nextQ = next;

      // Apply q update
      if (nextQ.length === 0) params.delete("q");
      else params.set("q", nextQ);

      // Only reset pagination if q actually changed
      if (currentQ !== nextQ) {
        params.set("page", "1");
      }

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

  // Keep URL page in sync if server clamps page (e.g., deep link page=999)
  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const currentPage = params.get("page") ?? "1";
    const nextPage = String(page);

    if (currentPage !== nextPage) {
      params.set("page", nextPage);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [page, pathname, router, searchParamsString]);


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
            const nextSort = e.target.value === "updated" ? "updated" : "created";
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", nextSort);
            params.set("page", "1");
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
            {totalCount} {isSearching ? "results" : "total"}
            {isSearching ? (
              <>
                {" "}
                for <span className="font-medium text-slate-700">“{trimmed}”</span>
              </>
            ) : null}
            {pageCount > 1 ? (
              <>
                {" "}
                · showing {initialEntries.length} on this page (page {page} of {pageCount})
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
