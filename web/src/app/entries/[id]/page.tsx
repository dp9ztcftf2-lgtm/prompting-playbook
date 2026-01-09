import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GenerateSummaryButton } from "../ui/GenerateSummaryButton";
import { GenerateTagsButton } from "../ui/GenerateTagsButton";
import { GenerateCategoryButton } from "../ui/GenerateCategoryButton";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ q?: string; sort?: string; page?: string }>;
};

export default async function EntryDetailPage(props: PageProps) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  const rawId = (params.id ?? "").trim();

  // Your EntryRow has id: number, so parse to number
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const row = await db.query.entries.findFirst({
    where: eq(entries.id, id),
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      summary: true,
      summaryUpdatedAt: true,
      tags: true,
      tagsUpdatedAt: true,

      // Day 12
      category: true,
      categoryUpdatedAt: true,

      // Day 13
      categoryConfidence: true,
      categoryRationale: true,
    },

  });


  if (!row) notFound();

  const confidenceText =
    row.categoryConfidence === null || row.categoryConfidence === undefined
      ? null
      : Number(row.categoryConfidence).toFixed(2);

  const sp = new URLSearchParams();
  if (searchParams?.q) sp.set("q", searchParams.q);
  if (searchParams?.sort) sp.set("sort", searchParams.sort);
  if (searchParams?.page) sp.set("page", searchParams.page);
  const backHref = sp.toString() ? `/entries?${sp.toString()}` : "/entries";

  return (
    <main id="top" className="mx-auto max-w-3xl p-6 space-y-6">

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{row.title}</h1>

        <div className="flex items-center gap-4 text-sm">
          <a href="#bottom" className="underline-offset-4 hover:underline">
            Bottom
          </a>

          <Link href={backHref} className="underline-offset-4 hover:underline">
            Back to results
          </Link>
        </div>
      </div>


      {row.content ? (
        <div className="whitespace-pre-wrap rounded-lg border p-4">
          {row.content}
        </div>
      ) : (
        <div className="rounded-lg border p-4 text-sm text-slate-500">
          No content.
        </div>
      )}

      {/* Summary */}
      <section className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Summary</h2>
          <GenerateSummaryButton id={row.id} />
        </div>

        {row.summary ? (
          <>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {row.summary}
            </p>
            {row.summaryUpdatedAt ? (
              <p className="text-xs text-slate-500">
                Updated {new Date(row.summaryUpdatedAt).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-slate-500">No summary yet.</p>
        )}
      </section>

      {/* Category */}
      <section className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Category</h2>
          <GenerateCategoryButton id={row.id} disabled={!!row.category} />
        </div>

        {row.category ? (
          <>
            <div className="flex items-center gap-2">
              <span className="rounded-full border px-2 py-0.5 text-xs">
                {row.category}
              </span>

              {confidenceText ? (
                <span className="text-xs text-slate-500">
                  confidence {confidenceText}
                </span>
              ) : null}
            </div>

            {row.categoryRationale ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {row.categoryRationale}
              </p>
            ) : null}

            {row.categoryUpdatedAt ? (
              <p className="text-xs text-slate-500">
                Updated {new Date(row.categoryUpdatedAt).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-slate-500">No category yet.</p>
        )}

      </section>


      {/* Tags */}
      <section className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Tags</h2>
          <GenerateTagsButton id={row.id} disabled={!!row.tags?.length} />
        </div>

        {row.tags && row.tags.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {row.tags.map((t) => (
                <span key={t} className="rounded-full border px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>

            {row.tagsUpdatedAt ? (
              <p className="text-xs text-slate-500">
                Updated {new Date(row.tagsUpdatedAt).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-slate-500">No tags yet.</p>
        )}
      </section>

      {/* Created / Updated */}
      <div className="grid gap-2 text-sm text-slate-600">
        <div>
          <span className="font-medium text-slate-900">Created:</span>{" "}
          {new Date(row.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium text-slate-900">Updated:</span>{" "}
          {new Date(row.updatedAt).toLocaleString()}
        </div>
      </div>

      <div className="flex justify-end gap-4 text-sm">
        <a href="#top" className="underline-offset-4 hover:underline">
          Back to top
        </a>
        <Link href={backHref} className="underline-offset-4 hover:underline">
          Back to results
        </Link>
      </div>

      <div id="bottom" />

    </main>
  );
}
