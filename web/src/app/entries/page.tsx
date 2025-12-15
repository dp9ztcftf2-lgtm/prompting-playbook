import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EntriesClient } from "./ui/EntriesClient";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { Entry } from "@/db/schema";

export default async function EntriesPage() {
  const rows:  Entry[] = await db
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
          <EntriesClient initialEntries={rows} />
        </CardContent>
      </Card>

    </div>
  );
}
