"use client";

import { useState } from "react";
import { createEntryAction } from "@/app/entries/actions";

export function EntryForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);
    try {
      await createEntryAction({
        title: trimmedTitle,
        content: trimmedContent,
      });
   
      setTitle("");
      setContent("");
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-800">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Short title"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-800">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[96px] rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Optional notes..."
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Creating…" : "Create entry"}
        </button>

        <span className="text-xs text-slate-500">
          Stored in Neon via Drizzle
        </span>
      </div>
    </form>
  );
}
