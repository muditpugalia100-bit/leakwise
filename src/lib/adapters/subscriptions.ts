import type { LeakSummary, Subscription } from "../types";
import { MOCK_SUBSCRIPTIONS } from "./mock-data";
import type { LeakDetector } from "./types";

export function calculateSubscriptionLeak(items: Subscription[]): LeakSummary {
  const unused = items.filter((s) => s.unused);
  const monthlyLeak = unused.reduce((sum, s) => sum + s.monthlyCost, 0);
  return {
    category: "subscriptions",
    title: "Silent subscriptions",
    description: `${unused.length} subscriptions you barely used`,
    monthlyLeak,
    color: "red",
    href: "/subscriptions",
  };
}

export const MockSubscriptionAdapter: LeakDetector<Subscription> = {
  async fetch() {
    return MOCK_SUBSCRIPTIONS;
  },
  calculateLeak: calculateSubscriptionLeak,
};

/**
 * Wire by Anakin adapter. Stub for now — wired up when WIRE_API_KEY is set.
 */
export const WireSubscriptionAdapter: LeakDetector<Subscription> = {
  async fetch() {
    throw new Error("WireSubscriptionAdapter not implemented yet.");
  },
  calculateLeak: calculateSubscriptionLeak,
};
