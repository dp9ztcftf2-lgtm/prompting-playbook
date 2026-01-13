"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { deleteEntryAction, updateEntryAction, generateEntryCategoryAction } from "@/app/entries/actions";

export type Entry = {
  id: number;
  title: string;
  content: string | null;

  summary?: string | null;
  summaryUpdatedAt?: string | Date | null;

  // Day 11
  tags?: string[] | null;
  tagsUpdatedAt?: string | Date | null;

  // Day 12
  category?: string | null;
  categoryUpdatedAt?: string | Date | null;

  // Day 15: provenance + versioning (summary)
  summaryModel?: string | null;
  summaryVersion?: number | null;
  summaryPromptVersion?: string | null;

  // Day 15: provenance + versioning (tags)
  tagsModel?: string | null;
  tagsVersion?: number | null;
  tagsPromptVersion?: string | null;

  // Day 14: provenance + versioning (category)
  categoryModel?: string | null;
  categoryVersion?: number | null;
  categoryPromptVersion?: string | null;

  createdAt?: string | Date;
  created_at?: string | Date;

};


export function EntryRow({
  entry,
  onChanged,
}: {
  entry: Entry;
  onChanged?: () => void;
}) {
  const created = useMemo(() => {
    const raw = entry.createdAt ?? entry.created_at;
    if (!raw) return null;

    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return null;

    return d.toLocaleString();
  }, [entry.createdAt, entry.created_at]);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title ?? "");
  const [content, setContent] = useState(entry.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingCategory, setIsGeneratingCategory] = useState(false);

  function startEdit() {
    setError(null);
    setTitle(entry.title ?? "");
    setContent(entry.content ?? "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setError(null);
    setIsEditing(false);
    setTitle(entry.title ?? "");
    setContent(entry.content ?? "");
  }

  async function saveEdit() {
    setError(null);
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);
    try {
      await updateEntryAction({
        id: entry.id,
        title: trimmedTitle,
        content: trimmedContent,
      });

      setIsEditing(false);
      onChanged?.();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function generateCategory() {
    setError(null);
    setIsGeneratingCategory(true);

    try {
      await generateEntryCategoryAction({ id: entry.id });
      onChanged?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsGeneratingCategory(false);
    }
  }


  async function deleteEntry() {
    setError(null);
    setIsDeleting(true);

    try {
      await deleteEntryAction({ id: entry.id });
      onChanged?.();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {!isEditing ? (
            <>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="font-medium text-slate-900 truncate">
                  <Link
                    href={`/entries/${entry.id}`}
                    className="hover:underline underline-offset-4"
                  >
                    {entry.title}
                  </Link>
                </h3>

                {entry.category ? (
                  <span className="rounded-full border px-2 py-0.5 text-[11px] text-slate-700">
                    {entry.category}
                  </span>
                ) : null}

                {created ? (
                  <span className="text-xs text-slate-500">· {created}</span>
                ) : null}
              </div>

              {entry.summary ? (
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  Summary: {entry.summary}
                </p>
              ) : null}

              {entry.tags?.length ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {entry.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-[11px]">
                      {t}
                    </span>
                  ))}
                  {entry.tags.length > 2 ? (
                    <span className="text-[11px] text-slate-500">+{entry.tags.length - 2}</span>
                  ) : null}
                </div>
              ) : null}

              {entry.content ? (
                <p
                  className="mt-1 text-sm text-slate-700 whitespace-pre-wrap line-clamp-5"
                  title="Content truncated"
                >
                  {entry.content}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-400 italic">
                  No content
                </p>
              )}


            </>
          ) : (
            <div className="space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Title"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[88px] rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Content (optional)"
              />
            </div>
          )}

          {error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={startEdit}
                className="rounded-md border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              {!(entry.category && entry.category.trim().length > 0) ? (
                <button
                  onClick={generateCategory}
                  disabled={isGeneratingCategory}
                  className="rounded-md border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  {isGeneratingCategory ? "Categorizing…" : "Generate Category"}
                </button>
              ) : null}


              <button
                onClick={deleteEntry}
                disabled={isDeleting}
                className="rounded-md border px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={saveEdit}
                disabled={isSaving}
                className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={cancelEdit}
                className="rounded-md border px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
