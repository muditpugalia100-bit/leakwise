import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { fetchAllLeaks } from "@/lib/adapters";
import { formatINR, formatINRShort } from "@/lib/format";

const ANNUAL_RATE = 0.12;
const HORIZON_YEARS = 10;

function projectFutureValue(monthlyContribution: number): number {
  const annual = monthlyContribution * 12;
  return annual * (((1 + ANNUAL_RATE) ** HORIZON_YEARS - 1) / ANNUAL_RATE) * (1 + ANNUAL_RATE);
}

export default async function ProjectionPage() {
  const { summaries, total } = await fetchAllLeaks();

  const annualLeak = total * 12;

  const topThree = [...summaries]
    .sort((a, b) => b.monthlyLeak - a.monthlyLeak)
    .slice(0, 3);
  const topThreeMonthly = topThree.reduce((s, x) => s + x.monthlyLeak, 0);
  const topThreeAnnual = topThreeMonthly * 12;

  const tenYearIfFixed = projectFutureValue(topThreeMonthly);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            10-year projection
          </span>
        </header>

        <section className="mt-20 text-center animate-fade-up">
          <p className="text-sm text-muted-foreground">
            If you fix nothing
          </p>
          <h1 className="mt-3 font-serif-display text-5xl sm:text-6xl tracking-tightest text-foreground">
            you&apos;ll leak{" "}
            <span className="text-leak-red">{formatINR(annualLeak)}</span>
            <br />
            this year
          </h1>
        </section>

        <section
          className="mt-16 rounded-2xl bg-surface border border-border/70 p-7 sm:p-8 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Fix your top 3 leaks
          </div>
          <div className="mt-4 space-y-2">
            {topThree.map((s) => (
              <div
                key={s.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground/80">{s.title}</span>
                <span className="font-medium">
                  {formatINR(s.monthlyLeak)}/mo
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-5">
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              You&apos;d save
            </div>
            <div className="mt-1 font-serif-display text-4xl tracking-tight">
              {formatINR(topThreeAnnual)}
              <span className="ml-2 text-base font-sans text-muted-foreground">
                / year
              </span>
            </div>
          </div>
        </section>

        <section
          className="mt-8 rounded-2xl bg-foreground p-7 sm:p-9 text-background animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/70">
            <Sparkles className="h-3.5 w-3.5" />
            Invested at 12% over 10 years, that becomes
          </div>
          <h2 className="mt-5 font-serif-display text-7xl sm:text-[8rem] font-medium leading-none tracking-tightest">
            {formatINRShort(tenYearIfFixed)}
          </h2>
          <p className="mt-6 text-sm text-background/70 max-w-md">
            Same amount you&apos;re already losing — just routed somewhere that
            grows instead of drains. Compound interest does the rest.
          </p>
        </section>

        <section
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "480ms" }}
        >
          <Link
            href="/subscriptions"
            className="block w-full rounded-2xl bg-accent py-5 text-center text-base font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Start fixing →
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Begin with subscriptions — it&apos;s the easiest win.
          </p>
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          Projection assumes monthly savings invested at a 12% annualised return,
          compounded yearly. Indicative — markets vary.
        </footer>
      </div>
    </div>
  );
}
