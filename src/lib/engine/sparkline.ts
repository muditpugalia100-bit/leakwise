import type { FakeDiscountVerdict, PriceHistoryPoint } from "./types";

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

function* prng(seed: number): Generator<number> {
  let s = seed >>> 0;
  while (true) {
    s = (s * 1664525 + 1013904223) >>> 0;
    yield (s & 0x7fffffff) / 0x7fffffff;
  }
}

const DAYS = 30;

export function generateSparkline(
  productKey: string,
  currentPrice: number,
): { points: PriceHistoryPoint[]; verdict: FakeDiscountVerdict } {
  const seed = hashStr(productKey);
  const dice = seed % 100;
  const rng = prng(seed);

  const today = new Date();
  const dates: string[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  let points: PriceHistoryPoint[];
  let verdict: FakeDiscountVerdict;

  if (dice < 6) {
    // Fake discount — prices were lower for most of the period.
    const realAvg = Math.round(currentPrice * (0.88 + rng.next().value * 0.04));
    points = dates.map((date, i) => {
      const t = i / (DAYS - 1);
      // Rises sharply only in last 4 days to make the "discount" look real
      const noise = (rng.next().value - 0.5) * currentPrice * 0.02;
      const base =
        t < 0.86 ? realAvg : realAvg + (currentPrice - realAvg) * ((t - 0.86) / 0.14);
      return { date, price: Math.max(0, Math.round(base + noise)) };
    });
    verdict = {
      kind: "fake-discount",
      thirtyDayAverage: realAvg,
      message: `Listed as a discount, but the 30-day average is ₹${realAvg.toLocaleString("en-IN")} — you're only saving ₹${(currentPrice - realAvg).toLocaleString("en-IN")} vs the actual recent norm.`,
    };
  } else if (dice < 22) {
    // Bouncy — current is at the bottom of recent range
    const high = currentPrice * 1.15;
    const low = currentPrice * 0.97;
    points = dates.map((date, i) => {
      const t = i / (DAYS - 1);
      const wobble = Math.sin(t * 8 + seed) * 0.4 + (rng.next().value - 0.5) * 0.3;
      const price = low + (high - low) * (0.5 + wobble * 0.5);
      return { date, price: Math.max(low, Math.round(price)) };
    });
    // Make the last point land exactly on currentPrice
    points[points.length - 1] = { date: dates[dates.length - 1], price: currentPrice };
    verdict = {
      kind: "real-deal",
      message: `Today's price is near the bottom of the 30-day range. This is a genuine dip.`,
    };
  } else {
    // Flat — small noise around current price
    points = dates.map((date) => {
      const noise = (rng.next().value - 0.5) * currentPrice * 0.015;
      return { date, price: Math.max(0, Math.round(currentPrice + noise)) };
    });
    points[points.length - 1] = { date: dates[dates.length - 1], price: currentPrice };
    verdict = {
      kind: "flat",
      message: `Price has been stable for the last 30 days. Today's listing is in line.`,
    };
  }

  return { points, verdict };
}
