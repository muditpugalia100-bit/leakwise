export type LeakCategory =
  | "subscriptions"
  | "bills"
  | "idle-cash"
  | "cashback";

export type LeakColor = "red" | "orange" | "yellow" | "green";

export interface LeakSummary {
  category: LeakCategory;
  title: string;
  description: string;
  monthlyLeak: number;
  color: LeakColor;
  href: string;
}

export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  lastUsedDays: number | null; // null = no usage data
  unused: boolean;
  reason?: string;
  cheaperAlternative?: { label: string; saves: number };
  logoColor: string;
}

export interface UtilityBill {
  id: string;
  name: string;
  provider: string;
  series: { month: string; amount: number }[];
  latest: number;
  sixMonthAverage: number;
  percentChange: number; // vs 6-month average
  flagged: boolean;
  reason?: string;
}

export interface IdleAccount {
  id: string;
  bank: string;
  accountMask: string;
  balance: number;
  savingsRateAPR: number;
  liquidFundRateAPR: number;
}

export interface AmazonOrder {
  id: string;
  productName: string;
  amount: number;
  date: string;
  cardUsed: string;
  cardUsedCashbackRate: number;
  bestCard: string;
  bestCashbackRate: number;
  missedCashback: number;
}
