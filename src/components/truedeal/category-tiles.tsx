"use client";

import { useState } from "react";

import { VERTICALS, PLATFORM_NAMES } from "@/lib/config";
import { cn } from "@/lib/utils";

export function CategoryTiles({
  onPick,
}: {
  onPick?: (placeholder: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const placeholders: Record<string, string> = {
    general: "Atomic Habits by James Clear",
    electronics: "Sony WH-CH720N headphones",
    grocery: "Aashirvaad Atta 5kg",
    travel: "Hotel in Goa for the weekend",
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {Object.values(VERTICALS).map((v) => {
        const disabled = !!v.comingSoon;
        const platformList = v.platforms
          .map((p) => PLATFORM_NAMES[p])
          .filter(Boolean)
          .join(" · ");
        return (
          <button
            key={v.id}
            type="button"
            disabled={disabled}
            onMouseEnter={() => setHovered(v.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => !disabled && onPick?.(placeholders[v.id] ?? "")}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-surface px-4 py-3.5 text-left transition-all",
              disabled
                ? "cursor-not-allowed border-border/60 opacity-50"
                : "border-border hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_8px_30px_rgb(0_0_0_/0.04)]",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: v.accent }}
              />
              <span className="text-sm font-medium text-foreground">
                {v.shortLabel}
              </span>
              {disabled && (
                <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Soon
                </span>
              )}
            </div>
            <div
              className={cn(
                "mt-1 text-[11px] text-muted-foreground transition-opacity",
                hovered === v.id && !disabled ? "opacity-100" : "opacity-70",
              )}
            >
              {hovered === v.id && !disabled && platformList
                ? platformList
                : v.tagline}
            </div>
          </button>
        );
      })}
    </div>
  );
}
