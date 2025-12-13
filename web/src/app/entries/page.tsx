import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import EntryForm from "./EntryForm";

async function getEntries() {
  return db
    .select()
    .from(entries)
    .orderBy(desc(entries.createdAt));
}

export default async function EntriesPage() {
  const allEntries = await getEntries();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <header className="space-y-2 border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Prompting Playbook
          </h1>
          <p className="text-sm text-slate-800">
            Store and refine your best prompts, patterns, and notes. Everything
            here is persisted in Neon via Drizzle.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Add a new entry
          </h2>
          <EntryForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Your entries
          </h2>

          {allEntries.length === 0 ? (
            <p className="text-sm text-slate-800">
              No entries yet. Add your first one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {allEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-sm text-slate-900">
                      {entry.title}
                    </h3>
                    <span className="text-xs text-slate-600 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
