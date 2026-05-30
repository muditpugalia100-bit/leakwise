import type { AmazonOrder, LeakSummary } from "../types";
import { MOCK_ORDERS } from "./mock-data";
import type { LeakDetector } from "./types";

export function calculateCashbackLeak(orders: AmazonOrder[]): LeakSummary {
  const monthlyLeak = orders.reduce((sum, o) => sum + o.missedCashback, 0);
  return {
    category: "cashback",
    title: "Missed cashback",
    description: `${orders.length} Amazon orders charged the wrong card`,
    monthlyLeak,
    color: "green",
    href: "/cashback",
  };
}

export const MockCashbackAdapter: LeakDetector<AmazonOrder> = {
  async fetch() {
    return MOCK_ORDERS;
  },
  calculateLeak: calculateCashbackLeak,
};

export const WireCashbackAdapter: LeakDetector<AmazonOrder> = {
  async fetch() {
    throw new Error("WireCashbackAdapter not implemented yet.");
  },
  calculateLeak: calculateCashbackLeak,
};
