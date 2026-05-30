import type { PlatformId, Vertical } from "../config";
import { PLATFORM_NAMES, VERTICALS } from "../config";
import {
  amazonDetails,
  amazonSearch,
  ebaySearch,
  flipkartSearch,
} from "../wire/actions";
import type { NormalisedListing } from "./types";

// ── Normalisers ─────────────────────────────────────────────────────────────

function asNumber(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
    return Number((v as { value?: number }).value ?? 0);
  }
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function normAmazonHit(raw: Record<string, unknown>): NormalisedListing | null {
  const price = asNumber(raw.price);
  if (!price) return null;
  const asin = (raw.asin as string) ?? "";
  const title = (raw.title as string) ?? "Unknown product";
  const url =
    (raw.url as string) ??
    (asin ? `https://www.amazon.in/dp/${asin}` : "https://www.amazon.in");
  return {
    platform: "amazon",
    platformName: PLATFORM_NAMES.amazon,
    title,
    brand: (raw.brand as string) ?? undefined,
    productUrl: url,
    imageUrl: (raw.image as string) ?? (raw.images as string[] | undefined)?.[0],
    listedPrice: price,
    deliveryCost: 0, // assume Prime / free delivery on amazon.in
    deliveredPrice: price,
    inStock: true,
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    ratingCount: typeof raw.rating_count === "number" ? raw.rating_count : undefined,
  };
}

function normFlipkartHit(raw: Record<string, unknown>): NormalisedListing | null {
  const price = asNumber(raw.price);
  if (!price) return null;
  const title = (raw.title as string) ?? "Unknown product";
  const url = (raw.url as string) ?? "https://www.flipkart.com";
  return {
    platform: "flipkart",
    platformName: PLATFORM_NAMES.flipkart,
    title,
    brand: (raw.brand as string) ?? undefined,
    productUrl: url,
    imageUrl: (raw.image as string) ?? undefined,
    listedPrice: price,
    deliveryCost: 0, // most India listings show free delivery
    deliveredPrice: price,
    inStock: true,
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
  };
}

function normEbayHit(raw: Record<string, unknown>): NormalisedListing | null {
  const price = asNumber(raw.price);
  if (!price) return null;
  const shipping = asNumber(raw.shipping);
  const freeShip = Boolean(raw.free_shipping);
  const delivery = freeShip ? 0 : shipping;
  const title = (raw.title as string) ?? "Unknown listing";
  const url = (raw.url as string) ?? "https://www.ebay.com";
  return {
    platform: "ebay",
    platformName: PLATFORM_NAMES.ebay,
    title,
    productUrl: url,
    imageUrl: (raw.image as string) ?? undefined,
    listedPrice: price,
    deliveryCost: delivery,
    deliveredPrice: price + delivery,
    inStock: true,
    offerNote: (raw.condition as string) ? `Condition: ${raw.condition}` : undefined,
  };
}

const HIT_LIST_KEYS = ["results", "products", "listings"] as const;

function firstHit<T = Record<string, unknown>>(
  payload: unknown,
): T | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  for (const k of HIT_LIST_KEYS) {
    const arr = obj[k];
    if (Array.isArray(arr) && arr.length > 0) return arr[0] as T;
  }
  return null;
}

// ── Anchor (find what we're actually comparing) ─────────────────────────────

export interface Anchor {
  title: string;
  brand?: string;
  asin?: string;
  image?: string;
  amazonListing?: NormalisedListing;
}

export async function buildAnchor(query: string, asinHint?: string): Promise<Anchor | null> {
  // If we have an ASIN already, go straight to details.
  if (asinHint) {
    const det = await amazonDetails(asinHint, { timeoutMs: 22_000 });
    if (det.ok) {
      const d = det.data;
      const price = asNumber(d.price);
      const listing = price
        ? normAmazonHit({
            asin: d.asin ?? asinHint,
            title: d.title,
            price,
            image: d.image ?? d.images?.[0],
            url: d.url ?? `https://www.amazon.in/dp/${asinHint}`,
            brand: d.brand,
            rating: d.rating,
            rating_count: d.rating_count,
          })
        : null;
      return {
        title: d.title ?? query,
        brand: d.brand,
        asin: d.asin ?? asinHint,
        image: d.image ?? d.images?.[0],
        amazonListing: listing ?? undefined,
      };
    }
  }

  // Otherwise, anchor via Amazon search.
  const search = await amazonSearch(query, { timeoutMs: 22_000 });
  if (!search.ok) return null;
  const top = firstHit<Record<string, unknown>>(search.data);
  if (!top) return null;
  const listing = normAmazonHit(top);
  return {
    title: (top.title as string) ?? query,
    brand: (top.brand as string) ?? undefined,
    asin: (top.asin as string) ?? undefined,
    image: (top.image as string) ?? undefined,
    amazonListing: listing ?? undefined,
  };
}

// ── Per-platform search ─────────────────────────────────────────────────────

async function searchFlipkart(query: string): Promise<NormalisedListing | null> {
  const r = await flipkartSearch(query, { timeoutMs: 22_000 });
  if (!r.ok) return null;
  const top = firstHit<Record<string, unknown>>(r.data);
  return top ? normFlipkartHit(top) : null;
}

async function searchEbay(query: string): Promise<NormalisedListing | null> {
  const r = await ebaySearch(query, { timeoutMs: 22_000 });
  if (!r.ok) return null;
  const top = firstHit<Record<string, unknown>>(r.data);
  return top ? normEbayHit(top) : null;
}

// ── Fan-out across the vertical's platforms ─────────────────────────────────

const PLATFORM_RUNNERS: Partial<Record<PlatformId, (q: string) => Promise<NormalisedListing | null>>> = {
  flipkart: searchFlipkart,
  ebay: searchEbay,
};

export async function fanoutPlatforms(
  vertical: Vertical,
  query: string,
): Promise<{
  listings: NormalisedListing[];
  errors: { platform: PlatformId; message: string }[];
}> {
  // Amazon is handled by buildAnchor (we already have it). Skip it here.
  const platforms = VERTICALS[vertical].platforms.filter(
    (p) => p !== "amazon" && PLATFORM_RUNNERS[p],
  );

  const settled = await Promise.allSettled(
    platforms.map((p) => PLATFORM_RUNNERS[p]!(query)),
  );

  const listings: NormalisedListing[] = [];
  const errors: { platform: PlatformId; message: string }[] = [];
  settled.forEach((r, i) => {
    const platform = platforms[i];
    if (r.status === "fulfilled" && r.value) {
      listings.push(r.value);
    } else if (r.status === "rejected") {
      errors.push({ platform, message: String(r.reason) });
    } else if (r.status === "fulfilled" && !r.value) {
      errors.push({ platform, message: "no matching product found" });
    }
  });

  return { listings, errors };
}
