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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 px-16 py-32 text-center">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Health Check
        </h1>
        {error ? (
          <div className="flex flex-col gap-2">
            <p className="text-lg text-red-600 dark:text-red-400">
              Error: {error}
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              The health check endpoint could not be reached.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-lg text-green-600 dark:text-green-400">
              Status: {status}
            </p>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              The API is responding correctly.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

