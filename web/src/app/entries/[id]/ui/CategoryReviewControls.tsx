"use client";

import * as React from "react";
import {
  clearCategoryOverrideAction,
  markCategoryReviewedAction,
  setCategoryOverrideAction,
} from "../../actions";
import { CATEGORY_OPTIONS, isValidCategory } from "@/lib/categoryTaxonomy";

type Props = {
  entryId: number;
  currentOverride: string | null;
  currentOverrideReason: string | null;
  reviewStatus: string | null;
};

export function CategoryReviewControls(props: Props) {
  const { entryId, currentOverride, currentOverrideReason, reviewStatus } = props;

  const [overrideValue, setOverrideValue] = React.useState<string>(currentOverride ?? "");
  const [reason, setReason] = React.useState<string>(currentOverrideReason ?? "");
  const [pending, setPending] = React.useState(false);

  const hasOverride = Boolean(currentOverride);

  async function onSaveOverride() {
    if (!isValidCategory(overrideValue)) return;

    setPending(true);
    try {
      await setCategoryOverrideAction({
        id: entryId,
        categoryOverride: overrideValue,
        reason,
      });
    } finally {
      setPending(false);
    }
  }

  async function onClearOverride() {
    setPending(true);
    try {
      await clearCategoryOverrideAction({ id: entryId });
      setOverrideValue("");
      setReason("");
    } finally {
      setPending(false);
    }
  }

  async function onMarkReviewed() {
    setPending(true);
    try {
      await markCategoryReviewedAction({ id: entryId });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <span className="rounded-full border px-2 py-0.5 text-xs">
          {reviewStatus ?? "auto"}
        </span>

        {!hasOverride ? (
          <button
            type="button"
            onClick={onMarkReviewed}
            disabled={pending}
            className="ml-auto rounded-md border px-2 py-1 text-sm hover:bg-slate-50 disabled:opacity-50"
            title="Confirm the AI category is acceptable"
          >
            Mark reviewed
          </button>
        ) : null}
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="text-sm font-medium">Override category</label>
          <select
            value={overrideValue}
            onChange={(e) => setOverrideValue(e.target.value)}
            disabled={pending}
            className="mt-1 w-full rounded-md border px-2 py-2 text-sm disabled:opacity-50"
          >
            <option value="">— Select —</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Saving sets status to <span className="font-medium">overridden</span>.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Override reason (optional)</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={pending}
            placeholder="Why is the AI category not correct?"
            className="mt-1 w-full rounded-md border px-2 py-2 text-sm disabled:opacity-50"
          />

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onSaveOverride}
              disabled={pending || !isValidCategory(overrideValue)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              Save override
            </button>

            <button
              type="button"
              onClick={onClearOverride}
              disabled={pending || !hasOverride}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              title="Clear override and rely on the AI category"
            >
              Clear override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
