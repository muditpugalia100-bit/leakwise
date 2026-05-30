import { TrendingUp } from "lucide-react";

import { BillChart } from "@/components/bill-chart";
import { DetailPageHeader } from "@/components/page-header";
import { MockBillAdapter } from "@/lib/adapters/bills";
import { formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function BillsPage() {
  const bills = await MockBillAdapter.fetch("demo");
  const summary = MockBillAdapter.calculateLeak(bills);

  const flagged = bills.filter((b) => b.flagged);
  const stable = bills.filter((b) => !b.flagged);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <DetailPageHeader eyebrow="Bill creep" />

        <section className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Above your 6-month average this cycle
          </p>
          <h1 className="mt-3 font-serif-display text-6xl sm:text-7xl tracking-tightest text-foreground">
            {formatINR(summary.monthlyLeak)}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            across {flagged.length} bills that jumped more than 15%.
          </p>
        </section>

        <section className="mt-14 space-y-6">
          {flagged.map((bill) => (
            <article
              key={bill.id}
              className="rounded-2xl bg-surface border border-border/70 p-5 sm:p-7"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {bill.provider}
                  </div>
                  <h3 className="mt-1 text-xl sm:text-2xl font-medium tracking-tight">
                    {bill.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-serif-display text-3xl tracking-tight">
                    {formatINR(bill.latest)}
                  </div>
                  <div
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full bg-leak-orange/10 px-2 py-0.5 text-xs font-medium text-leak-orange",
                    )}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {formatPercent(bill.percentChange, 1)}
                  </div>
                </div>
              </header>

              <div className="mt-6 -ml-2">
                <BillChart data={bill.series} accent="orange" />
              </div>

              {bill.reason && (
                <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-foreground/80">
                  {bill.reason}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    6-mo avg
                  </div>
                  <div className="mt-1 font-medium">
                    {formatINR(bill.sixMonthAverage)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Above avg
                  </div>
                  <div className="mt-1 font-medium text-leak-orange">
                    {formatINR(bill.latest - bill.sixMonthAverage)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Stable ({stable.length})
          </h2>
          <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/70 bg-surface">
            {stable.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="font-medium text-sm text-foreground">
                    {bill.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bill.provider}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-foreground/80">
                    {formatINR(bill.latest)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bill.percentChange === 0
                      ? "no change"
                      : formatPercent(bill.percentChange, 1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          We pull bills via Wire by Anakin. Mock data shown here.
        </footer>
      </div>
    </div>
  );
}
