import type { LeakSummary, UtilityBill } from "../types";
import { MOCK_BILLS } from "./mock-data";
import type { LeakDetector } from "./types";

export function calculateBillLeak(items: UtilityBill[]): LeakSummary {
  const flagged = items.filter((b) => b.flagged);
  const monthlyLeak = flagged.reduce(
    (sum, b) => sum + Math.max(0, b.latest - b.sixMonthAverage),
    0,
  );
  return {
    category: "bills",
    title: "Bill creep",
    description: `${flagged.length} bills jumped more than 15% this cycle`,
    monthlyLeak,
    color: "orange",
    href: "/bills",
  };
}

export const MockBillAdapter: LeakDetector<UtilityBill> = {
  async fetch() {
    return MOCK_BILLS;
  },
  calculateLeak: calculateBillLeak,
};

export const WireBillAdapter: LeakDetector<UtilityBill> = {
  async fetch() {
    throw new Error("WireBillAdapter not implemented yet.");
  },
  calculateLeak: calculateBillLeak,
};
