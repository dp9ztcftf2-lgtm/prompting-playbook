export function resultsUrl(params: {
  q?: string | null;
  sort?: string | null;
  page?: string | null;
}) {
  const sp = new URLSearchParams();

  const q = (params.q ?? "").trim();
  const sort = (params.sort ?? "").trim();
  const page = (params.page ?? "").trim();

  if (q) sp.set("q", q);
  if (sort) sp.set("sort", sort);
  if (page) sp.set("page", page);

  const qs = sp.toString();
  return qs ? `/entries?${qs}` : "/entries";
}
