import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Entry not found</h1>
      <p className="text-sm text-slate-600">
        That entry doesn’t exist, may have been deleted, or the URL is invalid.
      </p>

      <div className="pt-2">
        <Link href="/entries" className="text-sm underline-offset-4 hover:underline">
          Back to entries
        </Link>
      </div>
    </main>
  );
}
