import { Check } from "lucide-react";

import { DetailPageHeader } from "@/components/page-header";
import { MockSubscriptionAdapter } from "@/lib/adapters/subscriptions";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function SubscriptionsPage() {
  const subs = await MockSubscriptionAdapter.fetch("demo");
  const summary = MockSubscriptionAdapter.calculateLeak(subs);

  const unused = subs.filter((s) => s.unused);
  const active = subs.filter((s) => !s.unused);

  return (
    <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <DetailPageHeader eyebrow="Silent subscriptions" />

        <section className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;re paying every month for
          </p>
          <h1 className="mt-3 font-serif-display text-6xl sm:text-7xl tracking-tightest text-foreground">
            {formatINR(summary.monthlyLeak)}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            spread across {unused.length} subscriptions you barely touch.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Cancel candidates ({unused.length})
          </h2>
          <div className="mt-4 space-y-3">
            {unused.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl bg-surface border border-border/70 p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-lg shrink-0"
                      style={{ backgroundColor: sub.logoColor }}
                    />
                    <div>
                      <div className="font-medium text-foreground">
                        {sub.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {sub.lastUsedDays !== null
                          ? `Last used ${sub.lastUsedDays} days ago`
                          : "No login activity detected"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif-display text-2xl tracking-tight">
                      {formatINR(sub.monthlyCost)}
                    </div>
                    <div className="text-xs text-muted-foreground">/month</div>
                  </div>
                </div>
                {sub.reason && (
                  <p className="mt-4 text-sm text-foreground/80">{sub.reason}</p>
                )}
                {sub.cheaperAlternative && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-muted px-4 py-3">
                    <div className="text-sm text-foreground/80">
                      {sub.cheaperAlternative.label}
                    </div>
                    <div className="text-sm font-medium text-leak-green">
                      Saves {formatINR(sub.cheaperAlternative.saves)}/mo
                    </div>
                  </div>
                )}
                <button className="mt-4 w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  Cancel {sub.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Active and worth it ({active.length})
          </h2>
          <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/70 bg-surface">
            {active.map((sub) => (
              <div
                key={sub.id}
                className={cn("flex items-center gap-3 px-5 py-4")}
              >
                <span
                  className="h-7 w-7 rounded-md shrink-0"
                  style={{ backgroundColor: sub.logoColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">
                    {sub.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sub.lastUsedDays === 0
                      ? "Used today"
                      : `Used ${sub.lastUsedDays} day${sub.lastUsedDays === 1 ? "" : "s"} ago`}
                  </div>
                </div>
                <div className="text-sm text-foreground/80">
                  {formatINR(sub.monthlyCost)}
                </div>
                <Check className="h-4 w-4 text-leak-green" />
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 mb-6 text-center text-xs text-muted-foreground">
          Cancellations would happen through Wire by Anakin in the live build.
        </footer>
      </div>
    </div>
  );
}
