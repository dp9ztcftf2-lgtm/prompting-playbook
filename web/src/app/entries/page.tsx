// app/entries/page.tsx
import EntriesPage from "./ui/EntriesPage";

type SearchParams = {
  q?: string | string[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const sp = (await searchParams) as SearchParams;

  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = raw?.trim() ? raw.trim() : undefined;

  return <EntriesPage initialQuery={q ?? ""} />;
}
