import Link from "next/link";
import { Sliders } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-2">
        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
          <span className="absolute h-2 w-2 rounded-full bg-background" />
        </span>
        <span className="font-display text-xl tracking-tightest">TrueDeal</span>
      </Link>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Settings"
      >
        <Sliders className="h-3.5 w-3.5" />
        Settings
      </button>
    </header>
  );
}
