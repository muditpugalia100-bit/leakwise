import { ArrowRight } from "lucide-react";

import { DetailPageHeader } from "@/components/page-header";
import {
  IDLE_CASH_BUFFER,
  MockIdleCashAdapter,
} from "@/lib/adapters/idle-cash";
import { formatINR } from "@/lib/format";

export default async function IdleCashPage() {
  const accounts = await MockIdleCashAdapter.fetch("demo");
  const summary = MockIdleCashAdapter.calculateLeak(accounts);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <DetailPageHeader eyebrow="Idle cash" />

        <section className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;re leaving on the table, every month
          </p>
          <h1 className="mt-3 font-serif-display text-6xl sm:text-7xl tracking-tightest text-foreground">
            {formatINR(summary.monthlyLeak)}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            in opportunity cost — your savings account earns 3%, a liquid fund
            earns 6.5%.
          </p>
        </section>

        <section className="mt-14 space-y-4">
          {accounts.map((acc) => {
            const idle = Math.max(0, acc.balance - IDLE_CASH_BUFFER);
            const monthlyDiff =
              (idle * (acc.liquidFundRateAPR - acc.savingsRateAPR)) / 12;
            return (
              <article
                key={acc.id}
                className="rounded-2xl bg-surface border border-border/70 p-6 sm:p-7"
              >
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {acc.bank}
                    </div>
                    <h3 className="mt-1 text-xl sm:text-2xl font-medium tracking-tight">
                      Savings {acc.accountMask}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-serif-display text-3xl tracking-tight">
                      {formatINR(acc.balance)}
                    </div>
                    <div className="text-xs text-muted-foreground">balance</div>
                  </div>
                </header>

                <dl className="mt-6 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Safety buffer
                    </dt>
                    <dd className="mt-1 font-medium">{formatINR(IDLE_CASH_BUFFER)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Sitting idle
                    </dt>
                    <dd className="mt-1 font-medium">{formatINR(idle)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Savings rate
                    </dt>
                    <dd className="mt-1 font-medium">
                      {(acc.savingsRateAPR * 100).toFixed(1)}% APR
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Liquid fund rate
                    </dt>
                    <dd className="mt-1 font-medium text-leak-green">
                      {(acc.liquidFundRateAPR * 100).toFixed(1)}% APR
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-xl bg-muted px-5 py-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Opportunity cost
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <div className="font-serif-display text-2xl tracking-tight">
                      {formatINR(monthlyDiff)}/mo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatINR(monthlyDiff * 12)} / year
                    </div>
                  </div>
                </div>

                <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  Move {formatINR(idle)} to ICICI Liquid Fund
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          Past returns aren&apos;t a guarantee. Liquid funds carry minor market
          risk.
        </footer>
      </div>
    </div>
  );
}
