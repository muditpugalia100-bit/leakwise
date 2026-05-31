/**
 * Typed Wire action wrappers.
 *
 * These return loosely-typed shapes — Wire's payloads vary by platform and
 * we don't have full schemas yet. The engine normaliser does the heavy lifting
 * downstream; here we just hand off raw `data` with rough type hints.
 */

import { tryRunAction, type RunOptions } from "./client";

// ── Amazon ──────────────────────────────────────────────────────────────────

export interface AmazonSearchHit {
  asin?: string;
  title?: string;
  price?: number | { value?: number };
  rating?: number | string;
  rating_count?: number;
  image?: string;
  url?: string;
}
export interface AmazonSearchResult {
  results?: AmazonSearchHit[];
  products?: AmazonSearchHit[]; // some payloads use this key
}

export const amazonSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<AmazonSearchResult>(
    "am_search_products",
    { query },
    { label: "amazon.search", ...opts },
  );

export interface AmazonProductDetails {
  asin?: string;
  title?: string;
  brand?: string;
  price?: number | { value?: number; currency?: string };
  mrp?: number;
  rating?: number;
  rating_count?: number;
  images?: string[];
  image?: string;
  bullets?: string[];
  category?: string;
  url?: string;
}

export const amazonDetails = (asin: string, opts: RunOptions = {}) =>
  tryRunAction<AmazonProductDetails>(
    "am_product_details",
    { asin },
    { label: "amazon.details", ...opts },
  );

export interface AmazonReview {
  rating?: number;
  title?: string;
  text?: string;
  body?: string;
  verified?: boolean;
  date?: string;
}
export interface AmazonReviewsResult {
  reviews?: AmazonReview[];
  results?: AmazonReview[];
}

export const amazonReviews = (asin: string, opts: RunOptions = {}) =>
  tryRunAction<AmazonReviewsResult>(
    "am_product_reviews",
    { asin },
    { label: "amazon.reviews", ...opts },
  );

export interface AmazonDealsHit {
  asin?: string;
  title?: string;
  discount_percent?: number;
  price?: number;
  was_price?: number;
  url?: string;
}
export interface AmazonDealsResult {
  deals?: AmazonDealsHit[];
  results?: AmazonDealsHit[];
}

export const amazonDeals = (opts: RunOptions = {}) =>
  tryRunAction<AmazonDealsResult>(
    "am_deals",
    {},
    { label: "amazon.deals", ...opts },
  );

// ── Flipkart ────────────────────────────────────────────────────────────────

export interface FlipkartSearchHit {
  title?: string;
  brand?: string;
  price?: number;
  mrp?: number;
  rating?: number;
  image?: string;
  url?: string;
  pid?: string;
}
export interface FlipkartSearchResult {
  results?: FlipkartSearchHit[];
  products?: FlipkartSearchHit[];
}

export const flipkartSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<FlipkartSearchResult>(
    "fk_search_products",
    { query },
    { label: "flipkart.search", ...opts },
  );

export const flipkartDetails = (productUrl: string, opts: RunOptions = {}) =>
  tryRunAction<FlipkartSearchHit>(
    "fk_product_details",
    { product_url: productUrl },
    { label: "flipkart.details", ...opts },
  );

// ── eBay ────────────────────────────────────────────────────────────────────

export interface EbaySearchHit {
  item_id?: string;
  title?: string;
  price?: number;
  shipping?: number;
  free_shipping?: boolean;
  url?: string;
  image?: string;
  condition?: string;
}
export interface EbaySearchResult {
  results?: EbaySearchHit[];
  listings?: EbaySearchHit[];
}

export const ebaySearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<EbaySearchResult>(
    "eb_search_listings",
    { query },
    { label: "ebay.search", ...opts },
  );

export const ebayDetails = (input: { item_id?: string; url?: string }, opts: RunOptions = {}) =>
  tryRunAction<EbaySearchHit>(
    "eb_listing_details",
    input,
    { label: "ebay.details", ...opts },
  );

export const ebayCompleted = (query: string, opts: RunOptions = {}) =>
  tryRunAction<EbaySearchResult>(
    "eb_completed_listings",
    { query },
    { label: "ebay.completed", ...opts },
  );

// ── Shopify (generic D2C brand storefront) ──────────────────────────────────

export interface ShopifyVerifyResult {
  is_shopify?: boolean;
  is_accessible?: boolean;
  store_url?: string;
}

export const shopifyVerify = (url: string, opts: RunOptions = {}) =>
  tryRunAction<ShopifyVerifyResult>(
    "sh_verify",
    { url },
    { label: "shopify.verify", ...opts },
  );

export interface ShopifySearchHit {
  title?: string;
  handle?: string;
  vendor?: string;
  price?: number;
  compare_at_price?: number;
  image?: string;
  url?: string;
}
export interface ShopifySearchResult {
  results?: ShopifySearchHit[];
  products?: ShopifySearchHit[];
}

export const shopifySearch = (storeUrl: string, query: string, opts: RunOptions = {}) =>
  tryRunAction<ShopifySearchResult>(
    "sh_search",
    { store_url: storeUrl, query, limit: 6 },
    { label: "shopify.search", ...opts },
  );

// ── Trustpilot ──────────────────────────────────────────────────────────────

export interface TrustpilotCompany {
  domain?: string;
  name?: string;
  trust_score?: number;
  rating?: number;
  review_count?: number;
}

export const trustpilotSearchCompanies = (query: string, opts: RunOptions = {}) =>
  tryRunAction<{ companies?: TrustpilotCompany[]; results?: TrustpilotCompany[] }>(
    "tp_search_companies",
    { query },
    { label: "trustpilot.search", ...opts },
  );

export interface TrustpilotReview {
  headline?: string;
  text?: string;
  rating?: number;
  date?: string;
}

export const trustpilotReviews = (domain: string, opts: RunOptions = {}) =>
  tryRunAction<{ reviews?: TrustpilotReview[] }>(
    "tp_company_reviews",
    { domain },
    { label: "trustpilot.reviews", ...opts },
  );

// ── Google Trends ───────────────────────────────────────────────────────────

export interface TrendsTimePoint {
  date?: string;
  value?: number;
}
export interface TrendsResult {
  timeline?: TrendsTimePoint[];
  series?: TrendsTimePoint[];
}

export const trendsInterestOverTime = (
  keyword: string,
  opts: RunOptions = {},
) =>
  tryRunAction<TrendsResult>(
    "gt_interest_over_time",
    { keyword, geo: "IN", timeframe: "today 3-m" },
    { label: "trends.timeseries", ...opts },
  );

// ── Indian electronics retail (Phase 2) ─────────────────────────────────────

type RawHit = Record<string, unknown>;
type RawSearch = { results?: RawHit[]; products?: RawHit[]; items?: RawHit[] };

export const cromaSearch = (query: string, pincode: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "cr_search_products",
    { query, pincode },
    { label: "croma.search", ...opts },
  );

export const relianceDigitalSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "rd_search_products",
    { query },
    { label: "reliance.search", ...opts },
  );

export const vijaySalesSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "vs_search_products",
    { query },
    { label: "vijaysales.search", ...opts },
  );

// ── Indian grocery / quick-commerce (Phase 2) ───────────────────────────────

export const blinkitSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "act_blinkit_post_layout_search",
    { q: query, search_type: "type_to_search", search_page: "initial" },
    { label: "blinkit.search", ...opts },
  );

export const bigbasketSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "bb_search_products",
    { query },
    { label: "bigbasket.search", ...opts },
  );

export const jiomartSearch = (query: string, opts: RunOptions = {}) =>
  tryRunAction<RawSearch>(
    "jm_search_products",
    { query },
    { label: "jiomart.search", ...opts },
  );
