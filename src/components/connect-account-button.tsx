"use client";

import { Plus } from "lucide-react";

export function ConnectAccountButton() {
  return (
    <button
      type="button"
      onClick={() => {
        alert(
          "Account connection runs through Wire by Anakin.\n\nAdd WIRE_API_KEY to .env.local to switch from mock data to live accounts.",
        );
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <Plus className="h-4 w-4" />
      Connect account
    </button>
  );
}
