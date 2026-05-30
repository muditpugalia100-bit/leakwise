import type {
  AmazonOrder,
  IdleAccount,
  Subscription,
  UtilityBill,
} from "../types";

/**
 * Realistic Indian mock data. Tuned so the four leak categories sum near
 * ₹6,420 — the hero number shown on the home screen.
 *   subscriptions   ~₹2,127
 *   bill creep      ~₹3,016
 *   idle cash       ~₹720
 *   missed cashback ~₹550
 */

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-1",
    name: "Netflix",
    monthlyCost: 649,
    lastUsedDays: 2,
    unused: false,
    logoColor: "#E50914",
  },
  {
    id: "sub-2",
    name: "Disney+ Hotstar",
    monthlyCost: 499,
    lastUsedDays: 87,
    unused: true,
    reason: "No watch activity in 87 days.",
    cheaperAlternative: {
      label: "Free with Jio postpaid ₹399 plan",
      saves: 499,
    },
    logoColor: "#1F80E0",
  },
  {
    id: "sub-3",
    name: "Spotify Premium",
    monthlyCost: 119,
    lastUsedDays: 1,
    unused: false,
    logoColor: "#1DB954",
  },
  {
    id: "sub-4",
    name: "Apple iCloud+ 2TB",
    monthlyCost: 629,
    lastUsedDays: null,
    unused: true,
    reason: "Storage used is 84 GB — the 200 GB tier (₹219) would fit.",
    cheaperAlternative: {
      label: "Downgrade to 200 GB tier",
      saves: 410,
    },
    logoColor: "#1F1B16",
  },
  {
    id: "sub-5",
    name: "ChatGPT Plus",
    monthlyCost: 1700,
    lastUsedDays: 0,
    unused: false,
    logoColor: "#10A37F",
  },
  {
    id: "sub-6",
    name: "Cult.fit Live",
    monthlyCost: 999,
    lastUsedDays: 64,
    unused: true,
    reason: "Last class attended 64 days ago.",
    cheaperAlternative: {
      label: "Pause membership — keeps streak protection",
      saves: 999,
    },
    logoColor: "#C44E4E",
  },
  {
    id: "sub-7",
    name: "Google One 2TB",
    monthlyCost: 650,
    lastUsedDays: 0,
    unused: false,
    logoColor: "#4285F4",
  },
  {
    id: "sub-8",
    name: "LinkedIn Premium",
    monthlyCost: 1199,
    lastUsedDays: 5,
    unused: false,
    logoColor: "#0A66C2",
  },
];

export const MOCK_BILLS: UtilityBill[] = [
  {
    id: "bill-1",
    name: "Electricity",
    provider: "BSES Rajdhani",
    series: [
      { month: "Dec", amount: 9200 },
      { month: "Jan", amount: 9800 },
      { month: "Feb", amount: 9500 },
      { month: "Mar", amount: 10100 },
      { month: "Apr", amount: 10400 },
      { month: "May", amount: 12600 },
    ],
    latest: 12600,
    sixMonthAverage: 10267,
    percentChange: 22.7,
    flagged: true,
    reason:
      "Two new appliances (AC + geyser) detected in the kWh shape. ₹2,333 above your 6-month average.",
  },
  {
    id: "bill-2",
    name: "Broadband",
    provider: "ACT Fibernet",
    series: [
      { month: "Dec", amount: 999 },
      { month: "Jan", amount: 999 },
      { month: "Feb", amount: 999 },
      { month: "Mar", amount: 1199 },
      { month: "Apr", amount: 1199 },
      { month: "May", amount: 1899 },
    ],
    latest: 1899,
    sixMonthAverage: 1216,
    percentChange: 56.2,
    flagged: true,
    reason: "Plan auto-upgraded to 300 Mbps. Your average peak use is under 100 Mbps.",
  },
  {
    id: "bill-3",
    name: "Mobile",
    provider: "Airtel postpaid",
    series: [
      { month: "Dec", amount: 599 },
      { month: "Jan", amount: 599 },
      { month: "Feb", amount: 599 },
      { month: "Mar", amount: 599 },
      { month: "Apr", amount: 599 },
      { month: "May", amount: 599 },
    ],
    latest: 599,
    sixMonthAverage: 599,
    percentChange: 0,
    flagged: false,
  },
  {
    id: "bill-4",
    name: "Piped Gas",
    provider: "IGL",
    series: [
      { month: "Dec", amount: 920 },
      { month: "Jan", amount: 880 },
      { month: "Feb", amount: 940 },
      { month: "Mar", amount: 900 },
      { month: "Apr", amount: 920 },
      { month: "May", amount: 950 },
    ],
    latest: 950,
    sixMonthAverage: 918,
    percentChange: 3.5,
    flagged: false,
  },
];

export const MOCK_ACCOUNTS: IdleAccount[] = [
  {
    id: "acc-1",
    bank: "HDFC Bank",
    accountMask: "•••• 4218",
    balance: 2_72_000,
    savingsRateAPR: 0.03,
    liquidFundRateAPR: 0.065,
  },
];

export const MOCK_ORDERS: AmazonOrder[] = [
  {
    id: "ord-1",
    productName: "Sony WH-CH720N headphones",
    amount: 5_999,
    date: "2026-05-04",
    cardUsed: "Axis Magnus",
    cardUsedCashbackRate: 0.012,
    bestCard: "Amazon Pay ICICI",
    bestCashbackRate: 0.05,
    missedCashback: 228,
  },
  {
    id: "ord-2",
    productName: "Philips air fryer HD9252",
    amount: 4_999,
    date: "2026-05-12",
    cardUsed: "HDFC Millennia",
    cardUsedCashbackRate: 0.01,
    bestCard: "Amazon Pay ICICI",
    bestCashbackRate: 0.05,
    missedCashback: 200,
  },
  {
    id: "ord-3",
    productName: "Mi Smart Band 8",
    amount: 2_499,
    date: "2026-05-18",
    cardUsed: "SBI SimplyCLICK",
    cardUsedCashbackRate: 0.025,
    bestCard: "Amazon Pay ICICI",
    bestCashbackRate: 0.05,
    missedCashback: 62,
  },
  {
    id: "ord-4",
    productName: "boAt Airdopes 161 earbuds",
    amount: 1_499,
    date: "2026-05-22",
    cardUsed: "HDFC Millennia",
    cardUsedCashbackRate: 0.01,
    bestCard: "Amazon Pay ICICI",
    bestCashbackRate: 0.05,
    missedCashback: 60,
  },
];
