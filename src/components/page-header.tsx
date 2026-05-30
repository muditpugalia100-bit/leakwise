import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DetailPageHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </span>
    </header>
  );
}
