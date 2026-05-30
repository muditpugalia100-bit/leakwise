"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { VERTICALS } from "@/lib/config";
import { formatINR, formatINRShort } from "@/lib/format";
import type { ComparisonResult } from "@/lib/engine/types";
import { combineWorthWaiting } from "@/lib/engine/enrichers";
import { CountUp } from "@/components/count-up";
import { PriceHistoryChart } from "./price-history-chart";

const ANNUAL_RATE = 0.12;
const HORIZON_YEARS = 10;
const PURCHASES_PER_YEAR = 18;

function futureValue(savingsPerPurchase: number): number {
  const annual = savingsPerPurchase * PURCHASES_PER_YEAR;
  const r = ANNUAL_RATE;
  const n = HORIZON_YEARS;
  return annual * (((1 + r) ** n - 1) / r) * (1 + r);
}

export function ResultView({ id }: { id: string }) {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`td:${id}`);
      if (!raw) {
        setMissing(true);
        return;
      }
      setResult(JSON.parse(raw) as ComparisonResult);
    } catch {
      setMissing(true);
    }
  }, [id]);

  if (missing) {
    return (
      <div className="mx-auto mt-32 max-w-md text-center">
        <h2 className="font-display text-3xl tracking-tight">Result expired</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We don&apos;t store results between sessions yet. Run the search again
          from the home page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background"
        >
          <ArrowLeft className="h-4 w-4" /> Back to TrueDeal
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto mt-32 max-w-md text-center text-sm text-muted-foreground">
        Loading result…
      </div>
    );
  }

  const vertical = VERTICALS[result.vertical];
  const accent = vertical.accent;
  const winner = result.brandDirect ?? result.cheapest;
  const ten = futureValue(result.savings);

  const worthWaiting = combineWorthWaiting(
    result.deal,
    result.trends,
    result.fakeDiscount.kind === "fake-discount",
  );

  return (
    <div
      className={`vertical-${result.vertical} min-h-screen`}
      style={{ ["--accent" as never]: accent }}
    >
      <div className="mx-auto max-w-page px-5 py-6 sm:px-8 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span
            className="small-caps text-xs"
            style={{ color: accent }}
          >
            {vertical.label}
          </span>
        </header>

        {/* Title */}
        <section className="mt-12 sm:mt-16 animate-fade-up">
          <p className="text-xs text-muted-foreground">
            {result.product.brand ?? "Comparing across marketplaces"}
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl tracking-tightest text-balance">
            {result.product.title}
          </h1>
        </section>

        {/* Hero verdict */}
        <section
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <p className="small-caps text-xs" style={{ color: accent }}>
            Verdict
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <h2
              className="font-display text-6xl sm:text-7xl tracking-tightest"
              style={{ color: accent }}
            >
              <CountUp to={Math.round(result.savings)} />
            </h2>
            <span className="text-sm text-muted-foreground">saved</span>
          </div>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Cheapest delivered:{" "}
            <span className="text-foreground">{winner.platformName}</span> at{" "}
            <span className="text-foreground">
              {formatINR(winner.deliveredPrice)}
            </span>
            . Most expensive:{" "}
            <span className="text-foreground">
              {result.mostExpensive.platformName}
            </span>{" "}
            at {formatINR(result.mostExpensive.deliveredPrice)}.
          </p>
        </section>

        {/* Agent verdict paragraph — the wow */}
        <section
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground text-balance">
            {result.verdictParagraph}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {result.reviews.source === "gemini"
              ? "Synthesised by Gemini from live data"
              : "Composed from live Wire data"}
          </div>
        </section>

        {/* Comparison cards */}
        <section
          className="mt-12 animate-fade-up"
          style={{ animationDelay: "280ms" }}
        >
          <h3 className="small-caps text-xs text-muted-foreground">
            Where it&apos;s available
          </h3>
          <div className="mt-3 space-y-2.5">
            {result.listings
              .slice()
              .sort((a, b) => a.deliveredPrice - b.deliveredPrice)
              .map((l, i) => {
                const isCheapest = l === result.cheapest && !result.brandDirect;
                const delta = l.deliveredPrice - result.cheapest.deliveredPrice;
                return (
                  <a
                    key={l.platform + i}
                    href={l.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0_0_0_/0.04)]"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {l.platformName}
                        </span>
                        {isCheapest && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                            style={{ backgroundColor: accent }}
                          >
                            Cheapest
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {l.title}
                      </div>
                      {l.offerNote && (
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {l.offerNote}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl tracking-tight">
                        {formatINR(l.deliveredPrice)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {l.deliveryCost > 0
                          ? `incl. ${formatINR(l.deliveryCost)} delivery`
                          : "delivery included"}
                      </div>
                      {delta > 0 && (
                        <div className="mt-0.5 text-[11px] text-signal-bad">
                          +{formatINR(delta)}
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                );
              })}
          </div>
        </section>

        {/* Brand direct */}
        {result.brandDirect && (
          <section
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            <div
              className="rounded-2xl border bg-surface p-5 sm:p-6"
              style={{ borderColor: `${accent}33` }}
            >
              <div
                className="small-caps text-xs"
                style={{ color: accent }}
              >
                Direct from brand
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-foreground">
                    {result.brandDirect.platformName}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {result.brandDirect.storeDomain}
                  </div>
                  <p className="mt-3 max-w-md text-sm text-foreground/80">
                    {result.brandDirect.deliveredPrice <
                    result.cheapest.deliveredPrice ? (
                      <>
                        Brand site is{" "}
                        <span className="font-medium" style={{ color: accent }}>
                          {formatINR(
                            result.cheapest.deliveredPrice -
                              result.brandDirect.deliveredPrice,
                          )}{" "}
                          cheaper
                        </span>{" "}
                        than any marketplace once delivery is in.
                      </>
                    ) : (
                      <>
                        Brand site sells the same product at{" "}
                        {formatINR(result.brandDirect.deliveredPrice)} — slightly
                        higher than the marketplace, but cuts out the middleman.
                      </>
                    )}
                  </p>
                </div>
                <a
                  href={result.brandDirect.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                  style={{ backgroundColor: accent }}
                >
                  Open <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Price history + fake discount */}
        <section
          className="mt-12 animate-fade-up"
          style={{ animationDelay: "440ms" }}
        >
          <h3 className="small-caps text-xs text-muted-foreground">
            30-day price
          </h3>
          <div className="mt-3 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="-ml-2">
              <PriceHistoryChart data={result.priceHistory} accent={accent} />
            </div>
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                result.fakeDiscount.kind === "fake-discount"
                  ? "bg-signal-bad/8 text-signal-bad"
                  : result.fakeDiscount.kind === "real-deal"
                    ? "bg-signal-ok/8 text-signal-ok"
                    : "bg-muted text-foreground/80"
              }`}
              style={
                result.fakeDiscount.kind === "fake-discount"
                  ? { backgroundColor: "rgba(159,57,57,0.08)" }
                  : result.fakeDiscount.kind === "real-deal"
                    ? { backgroundColor: "rgba(58,107,79,0.08)" }
                    : undefined
              }
            >
              <div className="small-caps text-[10px] opacity-70">
                {result.fakeDiscount.kind === "fake-discount"
                  ? "Fake discount"
                  : result.fakeDiscount.kind === "real-deal"
                    ? "Real deal"
                    : "Stable price"}
              </div>
              <div className="mt-1">{result.fakeDiscount.message}</div>
            </div>
          </div>
        </section>

        {/* Review sentiment */}
        <section
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "520ms" }}
        >
          <h3 className="small-caps text-xs text-muted-foreground">
            What reviewers say
          </h3>
          <div className="mt-3 rounded-2xl border border-border bg-muted/60 p-5 sm:p-6">
            <ReviewLine icon="love" text={result.reviews.love} />
            <ReviewLine icon="complain" text={result.reviews.complain} />
            <ReviewLine icon="verdict" text={result.reviews.verdict} />
            <div className="mt-3 text-[11px] text-muted-foreground">
              {result.reviews.source === "gemini"
                ? "Synthesised by Gemini from Amazon reviews."
                : "Templated from Amazon review samples — add a Gemini API key to upgrade."}
            </div>
          </div>
        </section>

        {/* Worth waiting? */}
        <section
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "600ms" }}
        >
          <h3 className="small-caps text-xs text-muted-foreground">
            Worth waiting?
          </h3>
          <div className="mt-3 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-3">
              {worthWaiting.buyNow ? (
                <CheckCircle2
                  className="h-5 w-5"
                  style={{ color: accent }}
                />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="font-display text-xl tracking-tight">
                {worthWaiting.headline}
              </div>
            </div>
            {worthWaiting.reasons.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                {worthWaiting.reasons.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-muted-foreground">
                      ·
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                {result.trends.kind === "rising" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : result.trends.kind === "falling" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <span aria-hidden>·</span>
                )}
                Trends: {result.trends.kind}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                Deal: {result.deal.kind === "active-deal" ? "active" : "none"}
              </span>
            </div>
          </div>
        </section>

        {/* 10-year projection */}
        <section
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "680ms" }}
        >
          <div className="rounded-2xl bg-foreground p-7 sm:p-9 text-background">
            <div className="flex items-center gap-2 text-xs uppercase tracking-eyebrow text-background/70">
              <Sparkles className="h-3.5 w-3.5" />
              If you shop like this every time
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight tracking-tightest">
              {formatINRShort(ten)}
            </h2>
            <p className="mt-3 max-w-md text-sm text-background/70">
              Save {formatINR(result.savings)} on a purchase, do that ~
              {PURCHASES_PER_YEAR} times a year, invest the difference at 12%
              annual returns. In 10 years that becomes the number above. Compound
              interest does the rest.
            </p>
          </div>
        </section>

        {/* Errors / debug */}
        {result.errors.length > 0 && (
          <section className="mt-8 text-[11px] text-muted-foreground">
            Couldn&apos;t reach{" "}
            {result.errors.map((e) => e.platform).join(", ")} — verdict based on
            the rest.
          </section>
        )}

        <footer className="mt-16 mb-8 text-center text-[11px] text-muted-foreground">
          Phase 1 demo · pipeline ran in {Math.round(result.durationMs / 100) / 10}
          s
        </footer>
      </div>
    </div>
  );
}

function ReviewLine({
  icon,
  text,
}: {
  icon: "love" | "complain" | "verdict";
  text: string;
}) {
  const label =
    icon === "love"
      ? "Love"
      : icon === "complain"
        ? "Complain"
        : "Verdict";
  return (
    <div className="mt-2 first:mt-0">
      <span className="small-caps text-[10px] text-muted-foreground">
        {label}
      </span>
      <p className="mt-1 text-sm text-foreground/85 leading-snug">{text}</p>
    </div>
  );
}
