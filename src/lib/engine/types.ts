import type { PlatformId, Vertical } from "../config";

export interface ProductInput {
  raw: string;
  kind: "url" | "text";
  hostname?: string;
  asin?: string;
  productSlug?: string;
}

export interface NormalisedListing {
  platform: PlatformId;
  platformName: string;
  title: string;
  brand?: string;
  productUrl: string;
  imageUrl?: string;
  listedPrice: number;
  deliveryCost: number;
  deliveredPrice: number;
  inStock: boolean;
  rating?: number;
  ratingCount?: number;
  /** Soft platform-side promo info ("Bank offer: 10% on HDFC") */
  offerNote?: string;
}

export interface BrandDirectListing extends NormalisedListing {
  storeDomain: string;
}

export interface PriceHistoryPoint {
  date: string; // ISO date
  price: number;
}

export type FakeDiscountVerdict =
  | { kind: "real-deal"; message: string }
  | { kind: "fake-discount"; thirtyDayAverage: number; message: string }
  | { kind: "flat"; message: string };

export interface ReviewSentiment {
  love: string;
  complain: string;
  verdict: string;
  source: "gemini" | "template";
}

export type DealSignal =
  | { kind: "active-deal"; message: string; expiresHint?: string }
  | { kind: "no-deal"; message: string };

export type TrendsSignal =
  | { kind: "rising"; index: number; message: string }
  | { kind: "falling"; index: number; message: string }
  | { kind: "flat"; index: number; message: string };

export interface WorthWaitingVerdict {
  buyNow: boolean;
  headline: string;
  reasons: string[];
}

export interface ComparisonResult {
  id: string;
  createdAt: string;
  vertical: Vertical;
  input: ProductInput;
  product: {
    title: string;
    brand?: string;
    imageUrl?: string;
    category: string;
  };
  listings: NormalisedListing[];
  cheapest: NormalisedListing;
  mostExpensive: NormalisedListing;
  brandDirect?: BrandDirectListing;
  savings: number;
  savingsPercent: number;
  priceHistory: PriceHistoryPoint[];
  fakeDiscount: FakeDiscountVerdict;
  trends: TrendsSignal;
  deal: DealSignal;
  reviews: ReviewSentiment;
  verdictParagraph: string;
  durationMs: number;
  errors: { platform: PlatformId; message: string }[];
}

export interface PipelineProgress {
  step: string;
  /** 0-1 progress hint */
  weight: number;
}

export type PipelineEvent =
  | { type: "progress"; step: string }
  | { type: "done"; result: ComparisonResult }
  | { type: "error"; message: string };
