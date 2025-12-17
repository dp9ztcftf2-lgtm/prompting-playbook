// app/entries/page.tsx
import EntriesPage from "./ui/EntriesPage";

type SearchParams = {
  q?: string | string[];
  sort?: string | string[];
  page?: string | string[];
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

  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);


  //  return <EntriesPage initialQuery={q ?? ""} sort={sort} />;
  return <EntriesPage q={q} sort={sort} page={page} />;

}
