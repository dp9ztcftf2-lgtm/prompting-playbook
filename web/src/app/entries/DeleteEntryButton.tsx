"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteEntryButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Delete this entry? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to delete entry.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50 underline-offset-2 hover:underline"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <span className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
