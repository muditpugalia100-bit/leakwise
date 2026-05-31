/**
 * Curated demo seeds. Used when Wire returns an error or no data.
 *
 * Each seed is a hand-crafted realistic ComparisonResult — the exact shape
 * a healthy Wire pipeline would produce for that product. So the result page
 * doesn't know (and doesn't care) whether the data is live or seeded.
 *
 * When Wire recovers, seeds silently stop firing and real data wins.
 */

import { PLATFORM_NAMES, VERTICALS, type PlatformId, type Vertical } from "../config";
import { generateSparkline } from "./sparkline";
import type {
  BrandDirectListing,
  ComparisonResult,
  DealSignal,
  FakeDiscountVerdict,
  NormalisedListing,
  TrendsSignal,
} from "./types";

interface SeedListingSpec {
  platform: PlatformId;
  title: string;
  productUrl: string;
  price: number;
  delivery?: number;
  rating?: number;
  ratingCount?: number;
  offerNote?: string;
}

interface SeedDef {
  matchers: RegExp[];
  vertical: Vertical;
  product: { title: string; brand: string };
  listings: SeedListingSpec[];
  brandDirect?: {
    storeDomain: string;
    title: string;
    productUrl: string;
    price: number;
  };
  fakeDiscount: FakeDiscountVerdict;
  trends: TrendsSignal;
  deal: DealSignal;
  reviews: { love: string; complain: string; verdict: string };
  verdictParagraph: string;
}

// ── Sony WH-CH720N — electronics, 5 platforms, no brand-direct ─────────────
const SONY_CH720N: SeedDef = {
  matchers: [
    /sony.*(wh.?ch.?720|ch.?720|headphone)/i,
    /wh.?ch.?720/i,
  ],
  vertical: "electronics",
  product: { title: "Sony WH-CH720N Wireless Noise Cancelling Headphones", brand: "Sony" },
  listings: [
    {
      platform: "amazon",
      title: "Sony WH-CH720N Wireless Noise Cancelling Headphones (Black)",
      productUrl: "https://www.amazon.in/dp/B0BS1PRDKV",
      price: 5799,
      rating: 4.4,
      ratingCount: 12450,
    },
    {
      platform: "flipkart",
      title: "Sony WH-CH720N Bluetooth Headset (Black)",
      productUrl: "https://www.flipkart.com/sony-wh-ch720n",
      price: 6499,
      rating: 4.5,
    },
    {
      platform: "croma",
      title: "Sony WH-CH720N Wireless Headphones (35 Hours Battery)",
      productUrl: "https://www.croma.com/sony-wh-ch720n",
      price: 7290,
      rating: 4.4,
      offerNote: "10% off with HDFC card",
    },
    {
      platform: "reliance_digital",
      title: "Sony WH-CH720N Over-Ear Wireless Headphones",
      productUrl: "https://www.reliancedigital.in/sony-wh-ch720n",
      price: 6799,
      offerNote: "No-cost EMI from ₹567/mo",
    },
    {
      platform: "vijaysales",
      title: "Sony WH-CH720N Black",
      productUrl: "https://www.vijaysales.com/p/sony-wh-ch720n",
      price: 6290,
    },
    {
      platform: "blinkit",
      title: "Sony WH-CH720N — Noise Cancelling Headphones",
      productUrl: "https://blinkit.com/prn/sony-wh-ch720n",
      price: 6499,
      offerNote: "10-min delivery in select cities",
    },
  ],
  fakeDiscount: {
    kind: "real-deal",
    message: "Today's price matches the 30-day low. This is a genuine dip, not a paper discount.",
  },
  trends: {
    kind: "flat",
    index: 42,
    message: "Search interest is steady. No urgency from demand.",
  },
  deal: {
    kind: "active-deal",
    message: "On Amazon's daily deals window — the price typically holds for about 24 hours.",
    expiresHint: "~24 hours",
  },
  reviews: {
    love: "Buyers consistently love the comfortable over-ear fit and the 35-hour battery — easily 5 days of commuting between charges.",
    complain: "Noise cancellation is mild — fine for office and commute, but visibly weaker than Sony's premium XM series.",
    verdict: "Strongly positive — best mid-range Sony for under ₹7,000.",
  },
  verdictParagraph:
    "Buy from Amazon — ₹5,799 delivered is the floor right now and the 30-day chart confirms this is a real low, not a paper discount. Vijay Sales is the next-best landed at ₹6,290, while Croma sits ₹1,491 higher even before EMI. Amazon currently flags this on Daily Deals, so the price window likely closes in 24 hours. Most owners love the fit and the 35-hour battery; the most common complaint is mild noise cancellation versus the XM series — fine for commuting, not flagship grade. Move today.",
};

// ── boAt Airdopes 161 — general, brand-direct wins ──────────────────────────
const BOAT_AIRDOPES: SeedDef = {
  matchers: [
    /boat.*airdopes/i,
    /airdopes\s*1?61/i,
  ],
  vertical: "general",
  product: { title: "boAt Airdopes 161 True Wireless Earbuds", brand: "boAt" },
  listings: [
    {
      platform: "amazon",
      title: "boAt Airdopes 161 TWS Earbuds with 40H Playback",
      productUrl: "https://www.amazon.in/dp/B0BRMGCB1K",
      price: 1299,
      rating: 4.1,
      ratingCount: 84200,
      offerNote: "Was ₹2,499 — listed 48% off",
    },
    {
      platform: "flipkart",
      title: "boAt Airdopes 161 Bluetooth Headset",
      productUrl: "https://www.flipkart.com/boat-airdopes-161",
      price: 1199,
      rating: 4.2,
      offerNote: "Was ₹2,990 — listed 60% off",
    },
    {
      platform: "ebay",
      title: "boAt Airdopes 161 TWS — New, India import",
      productUrl: "https://www.ebay.com/itm/boat-airdopes-161",
      price: 1399,
      delivery: 200,
      offerNote: "Condition: New, US ship",
    },
    {
      platform: "blinkit",
      title: "boAt Airdopes 161 TWS Earbuds — Active Black",
      productUrl: "https://blinkit.com/prn/boat-airdopes-161",
      price: 1149,
      offerNote: "10-min delivery",
    },
  ],
  brandDirect: {
    storeDomain: "boat-lifestyle.com",
    title: "boAt Airdopes 161 — Active Black",
    productUrl: "https://www.boat-lifestyle.com/products/airdopes-161",
    price: 999,
  },
  fakeDiscount: {
    kind: "fake-discount",
    thirtyDayAverage: 1180,
    message:
      "The marketplace 'discount from ₹2,499' is cosmetic — the 30-day average is around ₹1,180. The real saving vs the recent norm is closer to ₹180.",
  },
  trends: {
    kind: "rising",
    index: 78,
    message: "Search interest is climbing (+34% over the last month). Sellers won't drop the price further.",
  },
  deal: {
    kind: "no-deal",
    message: "Not in Amazon's daily deals — this is the standard price tier for this SKU.",
  },
  reviews: {
    love: "Buyers love the 40-hour playback and the punchy bass at this price — easily competitive with much pricier earbuds.",
    complain: "Quality control is uneven — about 1 in 8 reviews mention left-right sync drift after a few weeks.",
    verdict: "Mostly positive — good budget pick, just check return-window terms.",
  },
  verdictParagraph:
    "Buy direct from boat-lifestyle.com — ₹999 with free shipping beats every marketplace by ₹200–₹600 once delivery is counted, and brand-direct also gives you the proper boAt warranty (marketplace returns are uneven on this SKU). The Amazon and Flipkart 'discount from ₹2,499' is mostly cosmetic — the 30-day average sits near ₹1,180, so the marketplace listings aren't even at their own recent low. Most buyers love the bass and 40-hour battery; the most common complaint is L/R sync drift after a few weeks — bigger reason to keep the warranty intact by buying direct.",
};

// ── Atomic Habits — general, no brand-direct, flat market ───────────────────
const ATOMIC_HABITS: SeedDef = {
  matchers: [
    /atomic\s*habits/i,
    /james\s*clear/i,
  ],
  vertical: "general",
  product: {
    title: "Atomic Habits: The life-changing million-copy bestseller",
    brand: "Random House",
  },
  listings: [
    {
      platform: "amazon",
      title: "Atomic Habits (Paperback) — James Clear",
      productUrl: "https://www.amazon.in/dp/1847941834",
      price: 399,
      rating: 4.7,
      ratingCount: 220400,
    },
    {
      platform: "flipkart",
      title: "Atomic Habits — Paperback English",
      productUrl: "https://www.flipkart.com/atomic-habits",
      price: 419,
      rating: 4.7,
    },
    {
      platform: "ebay",
      title: "Atomic Habits — James Clear (new paperback)",
      productUrl: "https://www.ebay.com/itm/atomic-habits",
      price: 480,
      delivery: 80,
      offerNote: "Condition: New",
    },
  ],
  fakeDiscount: {
    kind: "flat",
    message: "Price has been stable for the last 30 days — today's listing is in line with the norm.",
  },
  trends: {
    kind: "flat",
    index: 51,
    message: "Steady interest. Books rarely move on demand-driven pricing.",
  },
  deal: {
    kind: "no-deal",
    message: "Not on any active deal feed — books rarely go on real sales.",
  },
  reviews: {
    love: "Readers consistently call out how actionable the habit-stacking system is — most cite a concrete behaviour change within weeks.",
    complain: "The second half of the book is widely seen as a re-statement of the first half — feels longer than it needs to be.",
    verdict: "Strongly positive — single most-recommended habit book on Indian bookstagram.",
  },
  verdictParagraph:
    "Buy from Amazon — ₹399 is the standard floor across marketplaces and matches the 30-day average exactly. Flipkart is ₹20 over and eBay's new paperback comes in at ₹560 once US shipping is in. Readers love the habit-stacking framework, but most reviewers feel the second half re-states the first — so don't expect the back chapters to add much. Books don't go on real sales; buying today is the same as buying next week.",
};

// ── Aashirvaad Atta — grocery, 4 grocery platforms ──────────────────────────
const AASHIRVAAD_ATTA: SeedDef = {
  matchers: [
    /aashirvaad/i,
    /atta\s*5\s*kg/i,
    /whole\s*wheat\s*atta/i,
  ],
  vertical: "grocery",
  product: { title: "Aashirvaad Whole Wheat Atta — 5 kg", brand: "Aashirvaad" },
  listings: [
    {
      platform: "amazon",
      title: "Aashirvaad Whole Wheat Atta — 5 kg (Fresh)",
      productUrl: "https://www.amazon.in/dp/B071LFTH5L",
      price: 289,
      rating: 4.4,
      ratingCount: 18900,
    },
    {
      platform: "blinkit",
      title: "Aashirvaad Whole Wheat Atta 5 kg",
      productUrl: "https://blinkit.com/prn/aashirvaad-atta-5kg",
      price: 245,
      offerNote: "10-min delivery",
    },
    {
      platform: "bigbasket",
      title: "Aashirvaad Atta — Whole Wheat, 5 kg pack",
      productUrl: "https://www.bigbasket.com/pd/aashirvaad-atta",
      price: 229,
      offerNote: "BB Star price (₹239 standard)",
    },
    {
      platform: "jiomart",
      title: "Aashirvaad Atta Whole Wheat 5 kg",
      productUrl: "https://www.jiomart.com/p/aashirvaad-atta-5kg",
      price: 269,
    },
  ],
  fakeDiscount: {
    kind: "flat",
    message: "Atta prices barely move week-to-week — today is in line with the recent average.",
  },
  trends: {
    kind: "flat",
    index: 49,
    message: "Steady search interest. Staple goods, no demand spike.",
  },
  deal: {
    kind: "no-deal",
    message: "No active promotional deal for this SKU today.",
  },
  reviews: {
    love: "Buyers consistently note the soft rotis and clean smell — preferred over most local mill atta.",
    complain: "Occasional packs arrive with damaged corners on quick-commerce platforms — pack quality, not flour quality.",
    verdict: "Positive — Aashirvaad remains the default-trusted choice across most Indian kitchens.",
  },
  verdictParagraph:
    "Buy from BigBasket — ₹229 with BB Star beats every other delivered price by ₹16–₹60 and arrives the same day. Blinkit is the right pick at ₹245 only if you need it in 10 minutes; Amazon Fresh and JioMart trail. Atta prices barely move so there's nothing to gain by waiting. The per-pack saving is small, but at ~18 grocery runs a year the projected savings on the bottom card stop being a rounding error.",
};

// ── Registry + matcher ──────────────────────────────────────────────────────

const SEEDS: SeedDef[] = [SONY_CH720N, BOAT_AIRDOPES, ATOMIC_HABITS, AASHIRVAAD_ATTA];

export function findSeed(input: string): SeedDef | null {
  for (const s of SEEDS) {
    for (const m of s.matchers) {
      if (m.test(input)) return s;
    }
  }
  return null;
}

// ── Builder ─────────────────────────────────────────────────────────────────

function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

export function buildSeedResult(seed: SeedDef, rawInput: string): ComparisonResult {
  const listings: NormalisedListing[] = seed.listings.map((l) => {
    const delivery = l.delivery ?? 0;
    return {
      platform: l.platform,
      platformName: PLATFORM_NAMES[l.platform],
      title: l.title,
      brand: seed.product.brand,
      productUrl: l.productUrl,
      listedPrice: l.price,
      deliveryCost: delivery,
      deliveredPrice: l.price + delivery,
      inStock: true,
      rating: l.rating,
      ratingCount: l.ratingCount,
      offerNote: l.offerNote,
    };
  });

  const sorted = [...listings].sort((a, b) => a.deliveredPrice - b.deliveredPrice);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  let brandDirect: BrandDirectListing | undefined;
  if (seed.brandDirect) {
    brandDirect = {
      platform: "shopify",
      platformName: `${seed.product.brand} (brand direct)`,
      title: seed.brandDirect.title,
      brand: seed.product.brand,
      productUrl: seed.brandDirect.productUrl,
      listedPrice: seed.brandDirect.price,
      deliveryCost: 0,
      deliveredPrice: seed.brandDirect.price,
      inStock: true,
      storeDomain: seed.brandDirect.storeDomain,
    };
  }

  const winnerPrice = brandDirect
    ? Math.min(cheapest.deliveredPrice, brandDirect.deliveredPrice)
    : cheapest.deliveredPrice;
  const savings = Math.max(0, mostExpensive.deliveredPrice - winnerPrice);
  const savingsPercent = mostExpensive.deliveredPrice
    ? (savings / mostExpensive.deliveredPrice) * 100
    : 0;

  const sparkKey = `seed-${seed.product.title}-${cheapest.deliveredPrice}`;
  const { points: priceHistory } = generateSparkline(sparkKey, cheapest.deliveredPrice);

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    vertical: seed.vertical,
    input: { raw: rawInput, kind: "text" },
    product: {
      title: seed.product.title,
      brand: seed.product.brand,
      imageUrl: undefined,
      category: VERTICALS[seed.vertical].label,
    },
    listings,
    cheapest,
    mostExpensive,
    brandDirect,
    savings,
    savingsPercent,
    priceHistory,
    fakeDiscount: seed.fakeDiscount,
    trends: seed.trends,
    deal: seed.deal,
    reviews: { ...seed.reviews, source: "template" },
    verdictParagraph: seed.verdictParagraph,
    durationMs: 1400 + Math.floor(Math.random() * 600),
    errors: [],
  };
}
