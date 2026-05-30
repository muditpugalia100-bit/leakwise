import type { IdleAccount, LeakSummary } from "../types";
import { MOCK_ACCOUNTS } from "./mock-data";
import type { LeakDetector } from "./types";

const BUFFER = 25_000;

export function calculateIdleCashLeak(accounts: IdleAccount[]): LeakSummary {
  let monthlyLeak = 0;
  let totalIdle = 0;
  for (const acc of accounts) {
    const idle = Math.max(0, acc.balance - BUFFER);
    totalIdle += idle;
    monthlyLeak += (idle * (acc.liquidFundRateAPR - acc.savingsRateAPR)) / 12;
  }
  return {
    category: "idle-cash",
    title: "Idle cash",
    description: `₹${(totalIdle / 1_00_000).toFixed(2)} lakh sitting in savings`,
    monthlyLeak,
    color: "yellow",
    href: "/idle-cash",
  };
}

export const MockIdleCashAdapter: LeakDetector<IdleAccount> = {
  async fetch() {
    return MOCK_ACCOUNTS;
  },
  calculateLeak: calculateIdleCashLeak,
};

export const WireIdleCashAdapter: LeakDetector<IdleAccount> = {
  async fetch() {
    throw new Error("WireIdleCashAdapter not implemented yet.");
  },
  calculateLeak: calculateIdleCashLeak,
};

export { BUFFER as IDLE_CASH_BUFFER };
