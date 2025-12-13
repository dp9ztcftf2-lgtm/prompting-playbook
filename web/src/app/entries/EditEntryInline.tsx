"use client";

import { useState } from "react";
import EditEntryForm from "./EditEntryForm";

export default function EditEntryInline({ entry }: { entry: any }) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <EditEntryForm
                id={entry.id}
                initialTitle={entry.title}
                initialContent={entry.content}
                onClose={() => setEditing(false)}
            />
        );
    }

    return (
        <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
        >
            Edit
        </button>
    );
}
