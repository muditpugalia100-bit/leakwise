import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { CountUp } from "@/components/count-up";
import { LeakCard } from "@/components/leak-card";
import { fetchAllLeaks } from "@/lib/adapters";
import { formatINRShort } from "@/lib/format";

const ANNUAL_INVEST_RATE = 0.12;
const HORIZON_YEARS = 10;

function projectFutureValue(monthlyLeak: number): number {
  const annual = monthlyLeak * 12;
  const r = ANNUAL_INVEST_RATE;
  const n = HORIZON_YEARS;
  return annual * (((1 + r) ** n - 1) / r) * (1 + r);
}

export default async function Home() {
  const { summaries, total } = await fetchAllLeaks();
  const tenYear = projectFutureValue(total);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <AppHeader />

        <section className="mt-20 sm:mt-28 flex flex-col items-center text-center animate-fade-up">
          <p className="text-sm tracking-wide text-muted-foreground">
            You leaked this much last month
          </p>
          <h1 className="mt-4 font-serif-display text-7xl sm:text-[9rem] font-medium leading-none tracking-tightest text-foreground">
            <CountUp to={total} />
          </h1>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Spread across four quiet drains. Tap any to see the breakdown — and
            the easiest fix.
          </p>
        </section>

        <section className="mt-16 sm:mt-20 space-y-3">
          {summaries.map((s, i) => (
            <LeakCard key={s.category} summary={s} index={i} />
          ))}
        </section>

        <section className="mt-10 animate-fade-up" style={{ animationDelay: "560ms" }}>
          <Link
            href="/projection"
            className="group block rounded-2xl bg-foreground p-6 sm:p-8 text-background transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/70">
              <Sparkles className="h-3.5 w-3.5" />
              What this costs you over 10 years
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="font-serif-display text-4xl sm:text-5xl tracking-tight">
                  {formatINRShort(tenYear)}
                </div>
                <p className="mt-2 text-sm text-background/70">
                  if you fix nothing and the leaks keep flowing
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-background/70 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          Mock data shown. Connect a real account to see your own leaks.
        </footer>
      </div>
    </div>
  );
}
