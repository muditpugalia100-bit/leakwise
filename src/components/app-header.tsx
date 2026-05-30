import Link from "next/link";

import { ConnectAccountButton } from "./connect-account-button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-foreground" />
        <span className="font-serif-display text-xl tracking-tight">
          LeakWise
        </span>
      </Link>
      <ConnectAccountButton />
    </header>
  );
}
