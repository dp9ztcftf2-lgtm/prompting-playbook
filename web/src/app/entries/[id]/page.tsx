import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  });

  if (!row) notFound();

  const sp = new URLSearchParams();
  if (searchParams?.q) sp.set("q", searchParams.q);
  if (searchParams?.sort) sp.set("sort", searchParams.sort);
  if (searchParams?.page) sp.set("page", searchParams.page);
  const backHref = sp.toString() ? `/entries?${sp.toString()}` : "/entries";

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{row.title}</h1>
        <Link href={backHref} className="text-sm underline-offset-4 hover:underline">
          Back to results
        </Link>
      </div>

      {row.content ? (
        <div className="whitespace-pre-wrap rounded-lg border p-4">{row.content}</div>
      ) : (
        <div className="rounded-lg border p-4 text-sm text-slate-500">No content.</div>
      )}

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
    </main>
  );
}
