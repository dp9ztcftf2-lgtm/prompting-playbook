// app/entries/ui/EntriesPage.tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EntriesClient } from "./EntriesClient";

import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";
import type { Entry } from "@/db/schema";

export default async function EntriesPage({
  initialQuery,
}: {
  initialQuery: string;
}) {
  // 🔹 Server read belongs here
  const q = initialQuery.trim();

  const rows: Entry[] = await db
    .select()
    .from(entries)
    .where(
      q
        ? or(
            ilike(entries.title, `%${q}%`),
            ilike(entries.content, `%${q}%`)
          )
        : undefined
    )
    .orderBy(desc(entries.createdAt));  

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entries"
        subtitle="Create, edit inline, and delete entries (DB-backed)."
      />

      <Card>
        <CardHeader>
          <div className="text-sm font-medium text-slate-900">New entry</div>
        </CardHeader>
        <CardContent>
        <EntriesClient initialEntries={rows} initialQuery={initialQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
