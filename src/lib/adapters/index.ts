import { MockBillAdapter } from "./bills";
import { MockCashbackAdapter } from "./cashback";
import { MockIdleCashAdapter } from "./idle-cash";
import { MockSubscriptionAdapter } from "./subscriptions";

/**
 * Central data fetch for the home screen.
 * Swap Mock* adapters for Wire* adapters once the Wire API key is wired up.
 */
export async function fetchAllLeaks(userId = "demo") {
  const [subs, bills, accounts, orders] = await Promise.all([
    MockSubscriptionAdapter.fetch(userId),
    MockBillAdapter.fetch(userId),
    MockIdleCashAdapter.fetch(userId),
    MockCashbackAdapter.fetch(userId),
  ]);

  const summaries = [
    MockSubscriptionAdapter.calculateLeak(subs),
    MockBillAdapter.calculateLeak(bills),
    MockIdleCashAdapter.calculateLeak(accounts),
    MockCashbackAdapter.calculateLeak(orders),
  ];

  const total = summaries.reduce((sum, s) => sum + s.monthlyLeak, 0);

  return { summaries, total, subs, bills, accounts, orders };
}

export * from "./bills";
export * from "./cashback";
export * from "./idle-cash";
export * from "./subscriptions";
export * from "./types";
