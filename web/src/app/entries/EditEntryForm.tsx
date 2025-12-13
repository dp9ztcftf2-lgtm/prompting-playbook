"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEntryForm({
    id,
    initialTitle,
    initialContent,
    onClose,
}: {
    id: number;
    initialTitle: string;
    initialContent: string;
    onClose: () => void;
}) {
    const router = useRouter();
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/entries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to update entry.");
            }

            router.refresh();
            onClose(); // close editing mode
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-slate-50 border border-slate-300 rounded-lg p-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-900">Title</label>
                <input
                    type="text"
                    className="border border-slate-400 rounded px-2 py-1 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-900">Content</label>
                <textarea
                    className="border border-slate-400 rounded px-2 py-1 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
            </div>

            {error && (
                <p className="text-sm text-red-700 bg-red-100 border border-red-300 rounded p-2">
                    {error}
                </p>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-3 py-1 border border-slate-600 text-slate-700 text-xs rounded hover:bg-slate-200 disabled:opacity-50"
                >
                    Cancel
                </button>

            </div>
        </form>

    );
}
