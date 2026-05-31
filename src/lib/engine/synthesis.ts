import { GoogleGenerativeAI } from "@google/generative-ai";

import type {
  BrandDirectListing,
  ComparisonResult,
  NormalisedListing,
  ReviewSentiment,
} from "./types";
import type { AmazonReview } from "../wire/actions";

// ── Review sentiment synthesis ──────────────────────────────────────────────

function templateReviewSummary(samples: AmazonReview[]): ReviewSentiment {
  if (!samples.length) {
    return {
      love: "Not enough reviews to summarise yet.",
      complain: "No notable complaints surfaced.",
      verdict: "Reviews are sparse — rely on the price comparison.",
      source: "template",
    };
  }
  const avg =
    samples.reduce((s, r) => s + (r.rating ?? 0), 0) / samples.length;
  const positives = samples.filter((r) => (r.rating ?? 0) >= 4).length;
  const negatives = samples.filter((r) => (r.rating ?? 0) <= 2).length;
  const verdict =
    avg >= 4.2
      ? "Strongly positive — most buyers would buy again."
      : avg >= 3.5
        ? "Mostly positive with a few real concerns."
        : "Mixed — read the complaints carefully before committing.";
  return {
    love: `Roughly ${positives}/${samples.length} sampled reviews are 4★ or higher.`,
    complain:
      negatives > 0
        ? `${negatives} sampled reviews flagged real problems — check return policy.`
        : "No 2★-or-lower reviews in the sample.",
    verdict,
    source: "template",
  };
}

async function geminiReviewSummary(
  samples: AmazonReview[],
): Promise<ReviewSentiment | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("[gemini.reviews] skipped: no GEMINI_API_KEY set");
    return null;
  }
  if (!samples.length) {
    console.log("[gemini.reviews] skipped: no review samples passed");
    return null;
  }

  try {
    const genai = new GoogleGenerativeAI(key);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const reviewBlock = samples
      .map(
        (r, i) =>
          `Review ${i + 1} (${r.rating ?? "?"}★): ${r.title ?? ""} ${r.text ?? r.body ?? ""}`,
      )
      .join("\n");
    const prompt = `Summarise these product reviews into exactly three short sentences. Format as JSON only — no preamble, no markdown fences.
{
  "love": "one sentence on what buyers consistently love",
  "complain": "one sentence on the most common real complaint",
  "verdict": "one sentence overall verdict on whether to buy"
}

Reviews:
${reviewBlock}`;
    const res = await model.generateContent(prompt);
    const text = res.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned) as {
      love?: string;
      complain?: string;
      verdict?: string;
    };
    if (!parsed.love || !parsed.complain || !parsed.verdict) return null;
    console.log("[gemini.reviews] success");
    return {
      love: parsed.love,
      complain: parsed.complain,
      verdict: parsed.verdict,
      source: "gemini",
    };
  } catch (err) {
    console.log(
      "[gemini.reviews] failed:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}

export async function synthesiseReviews(samples: AmazonReview[]): Promise<ReviewSentiment> {
  const g = await geminiReviewSummary(samples);
  if (g) return g;
  return templateReviewSummary(samples);
}

// ── Verdict paragraph (the hero output) ─────────────────────────────────────

interface VerdictInput {
  productTitle: string;
  cheapest: NormalisedListing;
  mostExpensive: NormalisedListing;
  savings: number;
  brandDirect?: BrandDirectListing;
  fakeDiscount: ComparisonResult["fakeDiscount"];
  deal: ComparisonResult["deal"];
  trends: ComparisonResult["trends"];
  reviews: ReviewSentiment;
}

function templateVerdict(v: VerdictInput): string {
  const winner = v.brandDirect ?? v.cheapest;
  const winnerName = v.brandDirect ? v.brandDirect.platformName : winner.platformName;
  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const parts: string[] = [];
  parts.push(`Buy from ${winnerName} — ${inr(winner.deliveredPrice)} delivered.`);
  if (v.savings > 0) {
    parts.push(
      `That's ${inr(v.savings)} less than the most expensive option (${v.mostExpensive.platformName}).`,
    );
  }
  if (v.brandDirect) {
    parts.push(
      `The brand's own site beats every marketplace once delivery is in.`,
    );
  }
  if (v.fakeDiscount.kind === "fake-discount") {
    parts.push(
      `The marketplace 'discount' is mostly cosmetic — the 30-day average sits at ${inr(v.fakeDiscount.thirtyDayAverage)}.`,
    );
  } else if (v.fakeDiscount.kind === "real-deal") {
    parts.push(`The current price is near a real 30-day low.`);
  }
  if (v.deal.kind === "active-deal") {
    parts.push(
      `It's on a live Amazon deal window — moving today locks the price in.`,
    );
  } else if (v.trends.kind === "rising") {
    parts.push(`Search interest is climbing, so don't expect this price to fall.`);
  }
  parts.push(`Reviews: ${v.reviews.verdict.toLowerCase()}`);
  return parts.join(" ");
}

async function geminiVerdict(v: VerdictInput): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("[gemini.verdict] skipped: no GEMINI_API_KEY set");
    return null;
  }
  try {
    const genai = new GoogleGenerativeAI(key);
    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const winner = v.brandDirect ?? v.cheapest;
    const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

    const facts = [
      `Product: ${v.productTitle}`,
      `Cheapest delivered: ${winner.platformName} at ${inr(winner.deliveredPrice)}`,
      `Most expensive delivered: ${v.mostExpensive.platformName} at ${inr(v.mostExpensive.deliveredPrice)}`,
      `Savings vs most expensive: ${inr(v.savings)}`,
      v.brandDirect
        ? `Brand's own store (${v.brandDirect.storeDomain}) is in the mix at ${inr(v.brandDirect.deliveredPrice)}.`
        : "No brand-direct match found.",
      `Price-history verdict: ${v.fakeDiscount.message}`,
      `Deal signal: ${v.deal.message}`,
      `Trends signal: ${v.trends.message}`,
      `Review verdict: ${v.reviews.verdict}; love: ${v.reviews.love}; complain: ${v.reviews.complain}`,
    ].join("\n");

    const prompt = `You are TrueDeal, a no-nonsense shopping agent for Indian buyers. Write a single paragraph (3 to 5 sentences) explaining the verdict for this product. Be specific about where to buy and why. Cite the discount-honesty check and the demand signal if relevant. Mention the most common complaint. Do not use bullet points, markdown, or headings. Do not say "as an AI". Use ₹ for prices.

Facts:
${facts}`;
    const res = await model.generateContent(prompt);
    console.log("[gemini.verdict] success");
    return res.response.text().trim();
  } catch (err) {
    console.log(
      "[gemini.verdict] failed:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}

export async function buildVerdictParagraph(v: VerdictInput): Promise<string> {
  const g = await geminiVerdict(v);
  return g ?? templateVerdict(v);
}
