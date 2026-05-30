import { CreditCard } from "lucide-react";

import { DetailPageHeader } from "@/components/page-header";
import { MockCashbackAdapter } from "@/lib/adapters/cashback";
import { formatINR } from "@/lib/format";

export default async function CashbackPage() {
  const orders = await MockCashbackAdapter.fetch("demo");
  const summary = MockCashbackAdapter.calculateLeak(orders);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <DetailPageHeader eyebrow="Missed cashback" />

        <section className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Left on the table this month
          </p>
          <h1 className="mt-3 font-serif-display text-6xl sm:text-7xl tracking-tightest text-foreground">
            {formatINR(summary.monthlyLeak)}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            across {orders.length} Amazon orders where a different card would
            have paid more back.
          </p>
        </section>

        <section className="mt-14 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl bg-surface border border-border/70 p-5 sm:p-6"
            >
              <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <h3 className="mt-1 text-base font-medium tracking-tight truncate">
                    {order.productName}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {formatINR(order.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif-display text-2xl tracking-tight text-leak-green">
                    +{formatINR(order.missedCashback)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    you could have earned
                  </div>
                </div>
              </header>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Used
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-foreground/70" />
                    <span className="text-sm font-medium">
                      {order.cardUsed}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {(order.cardUsedCashbackRate * 100).toFixed(1)}% back ={" "}
                    {formatINR(order.amount * order.cardUsedCashbackRate)}
                  </div>
                </div>
                <div className="rounded-xl bg-leak-green/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-leak-green">
                    Should have used
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-leak-green" />
                    <span className="text-sm font-medium">
                      {order.bestCard}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-leak-green/90">
                    {(order.bestCashbackRate * 100).toFixed(1)}% back ={" "}
                    {formatINR(order.amount * order.bestCashbackRate)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl bg-foreground p-6 text-background">
          <div className="text-xs uppercase tracking-[0.18em] text-background/70">
            Fix this once
          </div>
          <p className="mt-3 text-base">
            Set Amazon Pay ICICI as your default Amazon card. Future orders
            auto-route to it — no thinking needed.
          </p>
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          Card offers are simplified for the MVP. The live build reads each
          card&apos;s active offers via Wire.
        </footer>
      </div>
    </div>
  );
}
