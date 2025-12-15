import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b px-4 py-3">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4">{children}</div>;
}
