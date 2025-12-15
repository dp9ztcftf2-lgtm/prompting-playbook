"use client";

import { useMemo, useState } from "react";

export type Entry = {
  id: number;
  title: string;
  content: string | null;
  createdAt?: string; // optional depending on your API
  created_at?: string; // optional depending on your API
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
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString();
  }, [entry.createdAt, entry.created_at]);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title ?? "");
  const [content, setContent] = useState(entry.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch(`/api/entries/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update entry.");
      }

      setIsEditing(false);
      onChanged?.();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteEntry() {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/entries/${entry.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete entry.");
      }

      onChanged?.();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
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
                  {entry.title}
                </h3>
                {created ? (
                  <span className="text-xs text-slate-500">· {created}</span>
                ) : null}
              </div>
              {entry.content ? (
                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
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
