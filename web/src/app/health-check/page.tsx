import { headers } from "next/headers";

export default async function HealthCheckPage() {
  let status: string = "unknown";
  let error: string | null = null;

  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const response = await fetch(`${protocol}://${host}/api/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      error = `API returned status ${response.status}`;
    } else {
      const data = await response.json();
      status = data.status;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch health status";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-2 text-2xl font-semibold text-black dark:text-zinc-50">
            Application Health Check
          </h1>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Check the current status of the application API endpoint.
          </p>
          {error ? (
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 dark:bg-red-950/20">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Error: {error}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The health check endpoint could not be reached.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 dark:bg-green-950/20">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Status: {status}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The API is responding correctly.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

