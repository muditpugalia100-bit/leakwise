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

interface SeedReviewSample {
  rating: number;
  title: string;
  text: string;
}

export interface SeedDef {
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
  /** Hand-crafted review samples — used when Gemini re-synthesises a seed verdict. */
  reviewSamples: SeedReviewSample[];
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
  reviewSamples: [
    { rating: 5, title: "Great mid-range Sony", text: "Battery genuinely lasts a full work week. Comfortable for long meetings. Sound is balanced — not bass-heavy. Worth the price." },
    { rating: 4, title: "ANC is okay, not great", text: "Solid headphones but the noise cancellation is mild compared to the XM5. Fine for office, won't kill plane engine noise." },
    { rating: 5, title: "Comfort is the best part", text: "I forget I'm wearing them after a couple of hours. The earcups are soft and the clamp is just right. Sony build quality intact." },
    { rating: 4, title: "Good buy under 6k", text: "If you want something better than budget earbuds without spending XM money, this is the sweet spot. Mic for calls is average though." },
    { rating: 2, title: "Bluetooth flaky on Windows 11", text: "Pairs fine with phone but drops every 10 min on my laptop. Returned. Phone-only use case is solid, just be aware." },
  ],
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
  reviewSamples: [
    { rating: 5, title: "Insane value", text: "Bass is punchy, battery lasts forever, case is compact. For ₹1k these are genuinely better than they have any right to be." },
    { rating: 4, title: "Sound is great, build is meh", text: "Audio is solid for the price but the case latch feels cheap. Mic picks up wind. Still recommend if you're on a budget." },
    { rating: 2, title: "Left earbud died in 3 months", text: "Worked great for two months then the left one stopped charging. Replacement process was painful. Take the warranty seriously." },
    { rating: 5, title: "Daily driver", text: "Wear them through gym sessions, commute, calls. Battery lasts the full day on one charge. Bass is fun without being muddy." },
    { rating: 3, title: "L/R sync drifts after a few weeks", text: "Within a month one earbud started lagging by half a second. Re-pairing fixes it but it comes back. Annoying for video calls." },
    { rating: 4, title: "Punchy bass, light fit", text: "Comfortable to wear for hours. Sounds clearly tuned for bass which I like. Touch controls are sometimes finicky." },
  ],
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
  reviewSamples: [
    { rating: 5, title: "Changed how I approach habits", text: "The habit-stacking idea alone was worth the price. Started small, kept the streak, three months later I'm doing things I never thought I'd stick with." },
    { rating: 5, title: "Practical, not preachy", text: "Unlike most self-help books this one gives you specific systems you can apply tomorrow. The 1% better idea is simple but powerful." },
    { rating: 3, title: "First half >> second half", text: "First 120 pages are gold. After that it starts repeating itself in different words. Could've been 60% shorter without losing value." },
    { rating: 4, title: "Worth buying, will re-read", text: "Came back to it three months later and got more out of it the second time. Not flashy writing but the ideas are clean." },
    { rating: 5, title: "Recommended to my whole team", text: "We did this as a workplace book club and everyone walked out with at least one habit they actually kept. Rare for a non-fiction book." },
  ],
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
  reviewSamples: [
    { rating: 5, title: "Soft rotis every time", text: "Switched from local mill to this and the difference in roti texture is real. Soft, doesn't dry out, kids eat without complaining." },
    { rating: 4, title: "Reliable choice", text: "Default-trust brand for atta. Smell is fresh, no impurities, packaging is sturdy. Price varies week to week but worth it." },
    { rating: 3, title: "Pack arrived torn from Blinkit", text: "The flour itself is great but the pack came with one corner ripped open. Asked for replacement, got it next day. QC on delivery is the issue." },
    { rating: 5, title: "Same quality every pack", text: "Buy this every month, never had a bad pack. Consistency is what I'm paying for over cheaper alternatives." },
    { rating: 4, title: "BigBasket BB Star is the best price", text: "Cross-checked across apps — BigBasket with the membership comes out cheapest. Quick commerce charges a premium for the 10-min delivery." },
  ],
  verdictParagraph:
    "Buy from BigBasket — ₹229 with BB Star beats every other delivered price by ₹16–₹60 and arrives the same day. Blinkit is the right pick at ₹245 only if you need it in 10 minutes; Amazon Fresh and JioMart trail. Atta prices barely move so there's nothing to gain by waiting. The per-pack saving is small, but at ~18 grocery runs a year the projected savings on the bottom card stop being a rounding error.",
};

// ── Goa weekend hotel — travel ──────────────────────────────────────────────
const GOA_HOTEL: SeedDef = {
  matchers: [
    /hotel.*goa/i,
    /goa.*(hotel|stay|weekend|resort)/i,
    /weekend.*goa/i,
    /stay.*goa/i,
  ],
  vertical: "travel",
  product: { title: "Weekend stay in North Goa — 2 nights, 2 guests", brand: "—" },
  listings: [
    {
      platform: "booking",
      title: "Boutique stay near Anjuna Beach — Sea view room",
      productUrl: "https://www.booking.com/hotel/in/goa-anjuna-stay.html",
      price: 8400,
      rating: 8.6,
      ratingCount: 1240,
      offerNote: "Free cancellation till 24h",
    },
    {
      platform: "agoda",
      title: "Anjuna Beachside — Deluxe room, breakfast included",
      productUrl: "https://www.agoda.com/anjuna-beachside",
      price: 9100,
      rating: 8.4,
      offerNote: "Pay at property",
    },
    {
      platform: "airbnb",
      title: "Private villa with pool — Vagator, 2BR",
      productUrl: "https://www.airbnb.co.in/rooms/goa-vagator-villa",
      price: 7600,
      rating: 4.9,
      ratingCount: 86,
      offerNote: "Superhost · Self check-in",
    },
  ],
  fakeDiscount: {
    kind: "real-deal",
    message:
      "Booking.com is at the 30-day floor for this weekend's date range. No fake markdown here.",
  },
  trends: {
    kind: "rising",
    index: 71,
    message:
      "Search interest for Goa stays is climbing into the long weekend — prices will firm up over the next 48h.",
  },
  deal: {
    kind: "active-deal",
    message:
      "Booking flash sale: 12% off if you book within 24 hours with the BKINGFLASH code.",
    expiresHint: "~24 hours",
  },
  reviews: {
    love: "Most stays in this cluster get praised for the private pool access and proximity to the Anjuna flea market.",
    complain: "Wifi reliability is hit-or-miss across all three options — call out a backup workspace if you're working remote.",
    verdict: "Solid picks for a 2-night weekend — Airbnb wins on cost AND privacy for two.",
  },
  reviewSamples: [
    { rating: 5, title: "Quiet villa, easy beach access", text: "Stayed two nights, pool was clean, hosts handled airport drop. Walking distance to a few cafés. Exactly what I wanted for a weekend break." },
    { rating: 4, title: "Lovely property, slow wifi", text: "Place is beautiful and the views from the deluxe room are great. The catch is wifi — fine for messaging, useless for video calls. Came as a leisure trip so it didn't matter." },
    { rating: 5, title: "Superhost delivered", text: "Self-check-in worked perfectly, instructions were clear, and the kitchen was stocked with the basics. Worth every rupee for a private pool stay this close to Vagator." },
    { rating: 3, title: "Anjuna gets noisy on weekends", text: "If you're booking for a weekend, ask for the back-facing room. The beachside has live music until 11pm-ish. Property itself is great." },
  ],
  verdictParagraph:
    "Book the Airbnb in Vagator — ₹7,600 for 2 nights with a private pool beats Booking.com by ₹800 and Agoda by ₹1,500. Booking's flash sale lands you closer to Agoda even with the code, and Agoda's 'pay at property' tag isn't a real saving here. Search interest is rising into the long weekend, so locking the Airbnb today is the safer play. Heads-up across all three: wifi reliability is patchy — fine for a getaway, plan around it if you're remote-working.",
};

// ── Delhi → Goa flight — travel ─────────────────────────────────────────────
const DEL_GOI_FLIGHT: SeedDef = {
  matchers: [
    /delhi.*(goa|goi)/i,
    /(goa|goi).*delhi/i,
    /flight.*goa/i,
    /goa.*flight/i,
  ],
  vertical: "travel",
  product: { title: "Delhi → Goa, one-way, next Saturday", brand: "—" },
  listings: [
    {
      platform: "skyscanner",
      title: "IndiGo · 6E-5023 · 06:25 → 09:05 · non-stop",
      productUrl: "https://www.skyscanner.co.in/transport/flights/del/goi",
      price: 4380,
      offerNote: "1 cabin bag only · no meal",
    },
    {
      platform: "google_flights",
      title: "IndiGo · 6E-5023 · same itinerary",
      productUrl: "https://www.google.com/flights",
      price: 4420,
      offerNote: "Showed ₹4,380 yesterday — fare locked at booking time",
    },
    {
      platform: "booking",
      title: "IndiGo · 6E-2168 · 09:50 → 12:35 · non-stop",
      productUrl: "https://flights.booking.com",
      price: 4750,
      offerNote: "Booking.com convenience fee included",
    },
  ],
  fakeDiscount: {
    kind: "flat",
    message:
      "Airfare for this route held flat all week — today is in line with the 30-day median.",
  },
  trends: {
    kind: "rising",
    index: 64,
    message:
      "Searches for Delhi-Goa are climbing into the weekend — fares will harden over the next 36h.",
  },
  deal: {
    kind: "no-deal",
    message:
      "No active flight-deal banner for this route on any aggregator right now.",
  },
  reviews: {
    love: "Travellers consistently rate 6E-5023 as the most on-time IndiGo morning slot for this route.",
    complain: "Window-side allocation gets aggressive priced — pay only if you actively want it.",
    verdict: "IndiGo morning slot is the right pick — book on Skyscanner.",
  },
  reviewSamples: [
    { rating: 5, title: "Reliable morning IndiGo", text: "Took 6E-5023 twice in the last 6 months, on-time both times. Compact aircraft but for 2.5 hours it's fine. No frills, exactly what you want for a domestic hop." },
    { rating: 4, title: "Use Skyscanner, skip aggregator add-ons", text: "Found it ₹40 cheaper on Skyscanner than Google Flights showed me 20 minutes later. Convenience fees on third-party aggregators stack quickly — book direct via the airline if you can." },
    { rating: 3, title: "Don't pay for window seat", text: "₹450 for a window seat on a 2.5h flight is a scam. Skip the seat add-on, you'll get assigned a seat anyway." },
    { rating: 5, title: "Same-day rebooking went smooth", text: "Had to shift my flight by one day, IndiGo charged ₹1,800 change fee and it was done in 5 minutes via the app. No drama." },
  ],
  verdictParagraph:
    "Book IndiGo 6E-5023 via Skyscanner — ₹4,380 for the 06:25 non-stop beats Google Flights by ₹40 and Booking.com's later slot by ₹370 once their convenience fee lands. Fare for this route has been flat all week so there's no edge in waiting; demand is climbing into the weekend, which usually firms prices in the next 36h. Skip the window-seat add-on — it's the most-flagged complaint on this route and adds ₹450 for a 2.5h hop. Lock it today.",
};

// ── Registry + matcher ──────────────────────────────────────────────────────

const SEEDS: SeedDef[] = [
  SONY_CH720N,
  BOAT_AIRDOPES,
  ATOMIC_HABITS,
  AASHIRVAAD_ATTA,
  GOA_HOTEL,
  DEL_GOI_FLIGHT,
];

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
