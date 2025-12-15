import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EntryForm } from "@/components/entries/EntryForm";
import { EntriesClient } from "./ui/EntriesClient";
import { db } from "@/src/db";
import { entries } from "@/src/db/schema";
import { desc } from "drizzle-orm";

export default async function EntriesPage() {
  const rows = await db
    .select()
    .from(entries)
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
          <EntriesClient initialEntries={rows as any} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {/* list is rendered in client wrapper so it can refresh */}
      </div>
    </div>
  );
}
