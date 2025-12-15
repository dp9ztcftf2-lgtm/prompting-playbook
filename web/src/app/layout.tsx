import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Entries Playground | AI Curriculum",
  description: "Day 5: Next.js + Drizzle + Neon Entries app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen bg-slate-50 text-slate-900"}>
        <div className="min-h-screen flex flex-col">
          {/* Global header */}
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-sky-700 uppercase">
                  AI Curriculum
                </span>
                <span className="text-sm font-medium text-slate-800">
                  Entries Playground
                </span>
              </div>

              {/* Right side: simple status / future nav */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Next.js 15 · Drizzle · Neon</span>
              </div>
            </div>
          </header>

          {/* Main content container */}
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-6">
              {children}
            </div>
          </main>

          {/* Global footer */}
          <footer className="border-t bg-white/60">
            <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-slate-400 flex items-center justify-between">
              <span>
                Built as part of your AI Engineering Curriculum.
              </span>
              <span className="hidden sm:inline">
                /entries · DB-backed CRUD · Inline editing
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
