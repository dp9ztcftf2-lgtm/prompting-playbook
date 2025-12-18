export default function Loading() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-8 w-2/3 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
        </div>
  
        {/* Content block */}
        <div className="h-40 w-full rounded border bg-slate-100 animate-pulse" />
  
        {/* Metadata lines */}
        <div className="space-y-2">
          <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
        </div>
      </main>
    );
  }
  