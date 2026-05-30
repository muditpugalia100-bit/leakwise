export type Vertical = "general" | "electronics" | "grocery" | "travel";

export type PlatformId =
  | "amazon"
  | "flipkart"
  | "ebay"
  | "croma"
  | "reliance_digital"
  | "vijaysales"
  | "blinkit"
  | "bigbasket"
  | "jiomart"
  | "shopify"
  | "trustpilot"
  | "google_trends";

export interface VerticalConfig {
  id: Vertical;
  label: string;
  shortLabel: string;
  tagline: string;
  accent: string;
  platforms: PlatformId[];
  comingSoon?: boolean;
}

export const VERTICALS: Record<Vertical, VerticalConfig> = {
  general: {
    id: "general",
    label: "General Shopping",
    shortLabel: "General",
    tagline: "Books, gadgets, household, anything not specialised.",
    accent: "#3D4A7C",
    platforms: ["amazon", "flipkart", "ebay"],
  },
  electronics: {
    id: "electronics",
    label: "Electronics",
    shortLabel: "Electronics",
    tagline: "TVs, laptops, headphones, appliances.",
    accent: "#C85A3C",
    platforms: ["amazon", "flipkart", "croma", "reliance_digital", "vijaysales"],
  },
  grocery: {
    id: "grocery",
    label: "Grocery",
    shortLabel: "Grocery",
    tagline: "Daily essentials, snacks, household.",
    accent: "#3A6B4F",
    platforms: ["amazon", "blinkit", "bigbasket", "jiomart"],
  },
  travel: {
    id: "travel",
    label: "Travel",
    shortLabel: "Travel",
    tagline: "Flights and hotels — coming soon.",
    accent: "#B8624F",
    platforms: [],
    comingSoon: true,
  },
};

export const PLATFORM_NAMES: Record<PlatformId, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  ebay: "eBay",
  croma: "Croma",
  reliance_digital: "Reliance Digital",
  vijaysales: "Vijay Sales",
  blinkit: "Blinkit",
  bigbasket: "BigBasket",
  jiomart: "JioMart",
  shopify: "Brand site",
  trustpilot: "Trustpilot",
  google_trends: "Google Trends",
};

/**
 * D2C Indian brands on Shopify. Lowercased brand → Shopify storefront domain.
 * Looked up against the brand string from the matched product listing.
 */
export const SHOPIFY_BRANDS: Record<string, string> = {
  boat: "boat-lifestyle.com",
  "boat lifestyle": "boat-lifestyle.com",
  mamaearth: "mamaearth.in",
  "the souled store": "thesouledstore.com",
  "souled store": "thesouledstore.com",
  wakefit: "wakefit.co",
  "sleepy owl": "sleepyowl.in",
  bluestone: "bluestone.com",
  boldfit: "boldfit.in",
  bewakoof: "bewakoof.com",
  wrogn: "wrogn.com",
};

export const DEMO_PINCODE = "110001"; // Delhi central — used for pincode-aware Wire calls

export const SAVINGS_PROJECTION = {
  annualRate: 0.12,
  horizonYears: 10,
  bigPurchasesPerYear: 18, // assume ~1.5 major purchases per month
};
