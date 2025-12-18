export default function Loading() {
    return (
      <main className="mx-auto max-w-4xl p-6 space-y-4">
        {/* Top area: title + controls */}
        <div className="h-8 w-56 rounded bg-slate-200 animate-pulse" />
        <div className="h-10 w-full rounded bg-slate-200 animate-pulse" />
  
        {/* Rows */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-2/3 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="mt-2 h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
  
        {/* Pagination footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
          <div className="h-8 w-24 rounded bg-slate-200 animate-pulse" />
        </div>
      </main>
    );
  }
  