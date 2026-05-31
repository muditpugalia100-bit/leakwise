import { PLATFORM_NAMES } from "../config";
import { checkBrandDirect } from "./brand";
import { combineWorthWaiting, checkDeal, checkTrends, fetchAmazonReviewSamples } from "./enrichers";
import { buildAnchor, fanoutPlatforms } from "./fanout";
import { parseInput } from "./parser";
import { routeVertical } from "./router";
import { buildSeedResult, findSeed, type SeedDef } from "./seed";
import { generateSparkline } from "./sparkline";
import { buildVerdictParagraph, synthesiseReviews } from "./synthesis";
import type { ComparisonResult, NormalisedListing } from "./types";

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/**
 * Public pipeline entry point.
 *
 * Strategy: try the live Wire pipeline first. If it throws (Wire degraded,
 * empty results, network) AND the input matches a curated seed, return the
 * seed instead so the demo never breaks. When Wire recovers, the seed path
 * silently stops firing — real data wins.
 */
export async function runPipeline(raw: string): Promise<ComparisonResult> {
  const seed = findSeed(raw);
  try {
    return await runWirePipeline(raw);
  } catch (err) {
    if (seed) {
      console.log(
        `[truedeal] Wire pipeline failed (${
          err instanceof Error ? err.message : String(err)
        }); falling back to seed for "${raw.slice(0, 60)}"`,
      );
      const base = buildSeedResult(seed, raw);
      return enhanceSeedWithGemini(base, seed);
    }
    throw err;
  }
}

/**
 * When GEMINI_API_KEY is present, let Gemini regenerate the verdict paragraph
 * and the 3-line review summary from the seed's structured data. Keeps the
 * seed as the canonical truth (prices, deals, brand-direct) but upgrades the
 * narrative from hand-written to model-generated — visible on the result page
 * as the "Synthesised by Gemini" tag.
 *
 * Gracefully degrades to the seed's hand-written paragraph if Gemini fails.
 */
async function enhanceSeedWithGemini(
  base: ComparisonResult,
  seed: SeedDef,
): Promise<ComparisonResult> {
  if (!process.env.GEMINI_API_KEY) return base;
  try {
    const reviews = await synthesiseReviews(
      seed.reviewSamples.map((s) => ({
        rating: s.rating,
        title: s.title,
        text: s.text,
      })),
    );
    const verdictParagraph = await buildVerdictParagraph({
      productTitle: base.product.title,
      cheapest: base.cheapest,
      mostExpensive: base.mostExpensive,
      savings: base.savings,
      brandDirect: base.brandDirect,
      fakeDiscount: base.fakeDiscount,
      deal: base.deal,
      trends: base.trends,
      reviews,
    });
    return { ...base, reviews, verdictParagraph };
  } catch (err) {
    console.log(
      `[truedeal] Gemini enhancement failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return base;
  }
}

async function runWirePipeline(raw: string): Promise<ComparisonResult> {
  const start = Date.now();
  const input = parseInput(raw);

  // 1. Anchor — find the canonical product on Amazon
  const anchor = await buildAnchor(input.raw.replace(/^https?:\/\/\S+$/, "").trim() || input.raw, input.asin);
  const query = anchor?.title ?? input.raw;

  // 2. Vertical routing
  const vertical = routeVertical(input, anchor ?? undefined);

  // 3. Fan out across the rest of the vertical's platforms
  const fanout = await fanoutPlatforms(vertical, query);

  // 4. Brand-direct check (in parallel with enrichers below)
  const brandDirectP = checkBrandDirect(anchor?.brand, query);

  // 5. Enrichments
  const dealP = checkDeal(query, anchor?.asin);
  const trendsP = checkTrends(query);
  const reviewSamplesP = fetchAmazonReviewSamples(anchor?.asin);

  const [brandDirect, deal, trends, reviewSamples] = await Promise.all([
    brandDirectP,
    dealP,
    trendsP,
    reviewSamplesP,
  ]);

  // 6. Build the listings array
  const listings: NormalisedListing[] = [];
  if (anchor?.amazonListing) listings.push(anchor.amazonListing);
  listings.push(...fanout.listings);

  if (listings.length === 0) {
    throw new Error(
      "Couldn't find this product on any marketplace. Try a more specific query.",
    );
  }

  // 7. Determine cheapest / most expensive (excluding brand-direct so we can show its premium-or-discount)
  const sorted = [...listings].sort((a, b) => a.deliveredPrice - b.deliveredPrice);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  // Effective winner — brand-direct is the winner if it's the cheapest
  const effectiveWinnerPrice = brandDirect
    ? Math.min(cheapest.deliveredPrice, brandDirect.deliveredPrice)
    : cheapest.deliveredPrice;
  const savings = Math.max(0, mostExpensive.deliveredPrice - effectiveWinnerPrice);
  const savingsPercent = mostExpensive.deliveredPrice
    ? (savings / mostExpensive.deliveredPrice) * 100
    : 0;

  // 8. Price history (deterministic mock per brief)
  const sparkKey = anchor?.asin ?? anchor?.title ?? input.raw;
  const { points: priceHistory, verdict: fakeDiscount } = generateSparkline(
    sparkKey,
    cheapest.deliveredPrice,
  );

  // 9. Worth waiting?
  combineWorthWaiting(deal, trends, fakeDiscount.kind === "fake-discount");
  // (we expose this on the result via the deal+trends+fakeDiscount fields; the
  //  UI can call combineWorthWaiting again client-side if it wants. Keeping
  //  the call here primarily as a sanity warm-up.)

  // 10. Synthesise reviews + verdict paragraph
  const reviews = await synthesiseReviews(reviewSamples);
  const verdictParagraph = await buildVerdictParagraph({
    productTitle: anchor?.title ?? query,
    cheapest,
    mostExpensive,
    savings,
    brandDirect: brandDirect ?? undefined,
    fakeDiscount,
    deal,
    trends,
    reviews,
  });

  const result: ComparisonResult = {
    id: uid(),
    createdAt: new Date().toISOString(),
    vertical,
    input,
    product: {
      title: anchor?.title ?? query,
      brand: anchor?.brand,
      imageUrl: anchor?.image,
      category: PLATFORM_NAMES[vertical === "general" ? "amazon" : "amazon"], // placeholder
    },
    listings,
    cheapest,
    mostExpensive,
    brandDirect: brandDirect ?? undefined,
    savings,
    savingsPercent,
    priceHistory,
    fakeDiscount,
    trends,
    deal,
    reviews,
    verdictParagraph,
    durationMs: Date.now() - start,
    errors: fanout.errors,
  };

  return result;
}
