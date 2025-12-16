// app/entries/page.tsx
import EntriesPage from "./ui/EntriesPage";

type SearchParams = {
  q?: string | string[];
  sort?: string | string[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const sp = (await searchParams) as SearchParams;

  const rawQ = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = rawQ?.trim() ? rawQ.trim() : undefined;

  const rawSort = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const sort = rawSort === "updated" ? "updated" : "created";

  return <EntriesPage initialQuery={q ?? ""} sort={sort} />;
}
