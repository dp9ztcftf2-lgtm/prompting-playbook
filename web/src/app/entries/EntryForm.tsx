"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to create entry.");
      }

      setTitle("");
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-900">
          Title
        </label>
        <input
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short name for this prompt pattern"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-900">
          Content
        </label>
        <textarea
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Details, example prompts, notes..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Add entry"}
      </button>
    </form>
  );
}
