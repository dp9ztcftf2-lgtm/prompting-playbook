// app/entries/ui/EntriesPage.tsx
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EntriesClient } from "./EntriesClient";

import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { desc, ilike, or, sql } from "drizzle-orm";

const PAGE_SIZE = 5;

function buildHref(params: { q?: string; sort: "created" | "updated"; page: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  sp.set("sort", params.sort);
  sp.set("page", String(params.page));
  return `/entries?${sp.toString()}`;
}

export default async function EntriesPage(props: {
  q?: string;
  sort: "created" | "updated";
  page: number;
}) {
  const q = (props.q ?? "").trim();
  const sort = props.sort;
  const page = props.page;

  const whereClause = q
    ? or(ilike(entries.title, `%${q}%`), ilike(entries.content, `%${q}%`))
    : undefined;

  // 1) totalCount (server truth)
  const countRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(entries)
    .where(whereClause);

  const totalCount = Number(countRows[0]?.count ?? 0);
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Clamp page after we know pageCount
  const safePage = Math.min(Math.max(1, page), pageCount);
  const offset = (safePage - 1) * PAGE_SIZE;

  const orderByCol = sort === "updated" ? entries.updatedAt : entries.createdAt;

  // 2) fetch just the current page
  const rows = await db
  .select({
    id: entries.id,
    title: entries.title,
    content: entries.content,
    createdAt: entries.createdAt,
    updatedAt: entries.updatedAt,
    summary: entries.summary,
    summaryUpdatedAt: entries.summaryUpdatedAt,
  })
  .from(entries)
  .where(whereClause)
  .orderBy(desc(orderByCol))
  .limit(PAGE_SIZE)
  .offset(offset);


  const resultsLabel = q
    ? `${totalCount} result${totalCount === 1 ? "" : "s"} for “${q}”`
    : `${totalCount} total`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entries"
        subtitle="Create, edit inline, and delete entries (DB-backed)."
      />

      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-700">{resultsLabel}</div>

        <div className="flex items-center gap-3">
          <span className="text-slate-600">
            Page {safePage} of {pageCount}
          </span>

          <Link
            href={buildHref({ q: q || undefined, sort, page: safePage - 1 })}
            aria-disabled={safePage === 1}
            className={
              safePage === 1
                ? "pointer-events-none text-slate-400"
                : "text-slate-900 hover:underline"
            }
          >
            Prev
          </Link>

          <Link
            href={buildHref({ q: q || undefined, sort, page: safePage + 1 })}
            aria-disabled={safePage === pageCount}
            className={
              safePage === pageCount
                ? "pointer-events-none text-slate-400"
                : "text-slate-900 hover:underline"
            }
          >
            Next
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium text-slate-900">New entry</div>
        </CardHeader>
        <CardContent>
          {/* Client owns interaction; server owns truth */}
          <EntriesClient
            initialEntries={rows}
            initialQuery={q}
            sort={sort}
            page={safePage}
            totalCount={totalCount}
            pageCount={pageCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
