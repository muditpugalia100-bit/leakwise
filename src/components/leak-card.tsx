import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import type { LeakSummary } from "@/lib/types";

const DOT_CLASS: Record<LeakSummary["color"], string> = {
  red: "bg-leak-red",
  orange: "bg-leak-orange",
  yellow: "bg-leak-yellow",
  green: "bg-leak-green",
};

const RING_CLASS: Record<LeakSummary["color"], string> = {
  red: "ring-leak-red/30",
  orange: "ring-leak-orange/30",
  yellow: "ring-leak-yellow/30",
  green: "ring-leak-green/30",
};

export function LeakCard({
  summary,
  index = 0,
}: {
  summary: LeakSummary;
  index?: number;
}) {
  return (
    <Link
      href={summary.href}
      className={cn(
        "group flex items-center gap-5 rounded-2xl bg-surface border border-border/70 px-5 py-5 sm:px-6 sm:py-6",
        "transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0_0_0_/0.04)]",
        "animate-fade-up",
      )}
      style={{ animationDelay: `${200 + index * 80}ms` }}
    >
      <span
        className={cn(
          "h-3 w-3 shrink-0 rounded-full ring-4",
          DOT_CLASS[summary.color],
          RING_CLASS[summary.color],
        )}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-lg font-medium tracking-tight text-foreground">
          {summary.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {summary.description}
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="font-serif-display text-2xl sm:text-3xl tracking-tight">
          {formatINR(summary.monthlyLeak)}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-accent group-hover:gap-1.5 transition-all">
          Fix this
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
