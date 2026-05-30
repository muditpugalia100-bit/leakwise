import {
  amazonDeals,
  amazonReviews,
  trendsInterestOverTime,
  type AmazonReview,
  type TrendsTimePoint,
} from "../wire/actions";
import type { DealSignal, TrendsSignal, WorthWaitingVerdict } from "./types";

// ── Deals ───────────────────────────────────────────────────────────────────

export async function checkDeal(
  productTitle: string,
  asin?: string,
): Promise<DealSignal> {
  const r = await amazonDeals({ timeoutMs: 18_000 });
  if (!r.ok) {
    return { kind: "no-deal", message: "No active deal signal." };
  }

  type Hit = { asin?: string; title?: string; discount_percent?: number };
  const data = r.data as { deals?: Hit[]; results?: Hit[] };
  const hits = data.deals ?? data.results ?? [];

  const lcTitle = productTitle.toLowerCase();
  // Match by ASIN if we have it, else by substring of title (loose).
  const match = hits.find((h) => {
    if (asin && h.asin && h.asin.toUpperCase() === asin.toUpperCase()) return true;
    if (!h.title) return false;
    const t = h.title.toLowerCase();
    return lcTitle.length > 8 && (t.includes(lcTitle.slice(0, 14)) || lcTitle.includes(t.slice(0, 14)));
  });

  if (match) {
    const disc = match.discount_percent ? ` (${Math.round(match.discount_percent)}% off)` : "";
    return {
      kind: "active-deal",
      message: `This product is on Amazon's daily deals${disc} — price is likely better than usual for the next 24 hours.`,
      expiresHint: "~24 hours",
    };
  }
  return {
    kind: "no-deal",
    message: "Not in Amazon's daily deals. Price is the standard listing.",
  };
}

// ── Trends ──────────────────────────────────────────────────────────────────

function slope(points: TrendsTimePoint[]): number {
  // Simple linear-ish slope: (last quarter avg − first quarter avg) / first quarter avg
  const filtered = points.filter((p) => typeof p.value === "number");
  if (filtered.length < 4) return 0;
  const q = Math.max(1, Math.floor(filtered.length / 4));
  const first = filtered.slice(0, q);
  const last = filtered.slice(-q);
  const avg = (xs: TrendsTimePoint[]) =>
    xs.reduce((s, p) => s + (p.value ?? 0), 0) / Math.max(1, xs.length);
  const a = avg(first);
  const b = avg(last);
  if (a < 1) return b > 30 ? 1 : 0;
  return (b - a) / a;
}

export async function checkTrends(keyword: string): Promise<TrendsSignal> {
  const r = await trendsInterestOverTime(keyword, { timeoutMs: 18_000 });
  if (!r.ok) {
    return {
      kind: "flat",
      index: 0,
      message: "No trends data — assuming stable demand.",
    };
  }
  const data = r.data as { timeline?: TrendsTimePoint[]; series?: TrendsTimePoint[] };
  const series = data.timeline ?? data.series ?? [];
  if (!series.length) {
    return { kind: "flat", index: 0, message: "No trends data for this keyword." };
  }
  const last = series[series.length - 1]?.value ?? 0;
  const s = slope(series);

  if (s > 0.25) {
    return {
      kind: "rising",
      index: last,
      message: `Search interest is rising (+${Math.round(s * 100)}% vs early in the window). Demand may push prices up — leaning buy-now.`,
    };
  }
  if (s < -0.25) {
    return {
      kind: "falling",
      index: last,
      message: `Search interest is falling (${Math.round(s * 100)}%). Sellers often discount fading items — waiting a week or two may pay off.`,
    };
  }
  return {
    kind: "flat",
    index: last,
    message: `Search interest is stable. No urgency from demand.`,
  };
}

// ── Reviews (raw fetch — synthesis happens later) ───────────────────────────

export async function fetchAmazonReviewSamples(
  asin: string | undefined,
): Promise<AmazonReview[]> {
  if (!asin) return [];
  const r = await amazonReviews(asin, { timeoutMs: 22_000 });
  if (!r.ok) return [];
  const data = r.data as { reviews?: AmazonReview[]; results?: AmazonReview[] };
  return (data.reviews ?? data.results ?? []).slice(0, 8);
}

// ── Worth waiting? combiner ─────────────────────────────────────────────────

export function combineWorthWaiting(
  deal: DealSignal,
  trends: TrendsSignal,
  isFakeDiscount: boolean,
): WorthWaitingVerdict {
  const reasons: string[] = [];

  if (deal.kind === "active-deal") {
    reasons.push("Currently on Amazon's daily deals.");
  }
  if (trends.kind === "rising") {
    reasons.push("Search demand is rising — sellers won't drop prices.");
  } else if (trends.kind === "falling") {
    reasons.push("Search demand is falling — sellers tend to discount these.");
  }
  if (isFakeDiscount) {
    reasons.push("The current 'discount' is mostly cosmetic — the real average isn't far below.");
  }

  let buyNow = true;
  let headline = "Buy now — the timing's fine.";

  if (isFakeDiscount && trends.kind !== "rising") {
    buyNow = false;
    headline = "Worth waiting — the discount isn't real and there's no urgency.";
  } else if (trends.kind === "falling" && deal.kind !== "active-deal") {
    buyNow = false;
    headline = "Worth waiting — interest is fading and a real drop is likely.";
  } else if (deal.kind === "active-deal") {
    buyNow = true;
    headline = "Buy now — this is a genuine deal window.";
  }

  return { buyNow, headline, reasons };
}
