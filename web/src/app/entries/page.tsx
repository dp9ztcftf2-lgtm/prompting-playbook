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
    <main className="max-w-2xl mx-auto py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Prompting Playbook Entries</h1>
        <p className="text-sm text-gray-600">
          These entries are stored in Neon via Drizzle and loaded on the server.
        </p>
      </header>

      <section>
        <EntryForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Existing entries</h2>

        {allEntries.length === 0 ? (
          <p className="text-sm text-gray-600">
            No entries yet. Add your first one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {allEntries.map((entry) => (
              <li
                key={entry.id}
                className="border rounded-lg p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-sm">{entry.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {entry.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
