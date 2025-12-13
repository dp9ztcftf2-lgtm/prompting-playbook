import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { entries } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(entries).limit(5);

    return NextResponse.json({
      ok: true,
      count: rows.length,
      sample: rows,
    });
  } catch (error) {
    console.error("DB test failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
