import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { entries } from "@/db/schema";
import { eq } from "drizzle-orm";

type ParamsContext = {
  params: Promise<{ id: string }>;
};

function parseId(idStr: string): number | null {
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /api/entries/:id
export async function GET(
  _request: Request,
  context: ParamsContext
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseId(idStr);

    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    const [entry] = await db
      .select()
      .from(entries)
      .where(eq(entries.id, id))
      .limit(1);

    if (!entry) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, entry });
  } catch (error) {
    console.error("Failed to fetch entry:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error fetching entry",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/entries/:id
export async function PATCH(
  request: Request,
  context: ParamsContext
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseId(idStr);

    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updates: { title?: string; content?: string } = {};

    if (typeof body.title === "string") {
      const t = body.title.trim();
      if (t) updates.title = t;
    }

    if (typeof body.content === "string") {
      const c = body.content.trim();
      if (c) updates.content = c;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Nothing to update." },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(entries)
      .set(updates)
      .where(eq(entries.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, entry: updated });
  } catch (error) {
    console.error("Failed to update entry:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error updating entry",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/entries/:id
export async function DELETE(
  _request: Request,
  context: ParamsContext
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseId(idStr);

    if (id === null) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    const [deleted] = await db
      .delete(entries)
      .where(eq(entries.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error deleting entry",
      },
      { status: 500 }
    );
  }
}
