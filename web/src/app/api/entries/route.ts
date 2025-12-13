import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/entries
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(entries)
      .orderBy(desc(entries.createdAt));

    return NextResponse.json({
      ok: true,
      count: rows.length,
      entries: rows,
    });
  } catch (error) {
    console.error("Failed to fetch entries:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error fetching entries",
      },
      { status: 500 }
    );
  }
}

// POST /api/entries
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!title || !content) {
      return NextResponse.json(
        {
          ok: false,
          error: "Both 'title' and 'content' are required.",
        },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(entries)
      .values({ title, content })
      .returning();

    return NextResponse.json(
      {
        ok: true,
        entry: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create entry:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error creating entry",
      },
      { status: 500 }
    );
  }
}
