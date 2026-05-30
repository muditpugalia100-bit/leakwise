const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const inrFormatterWithPaise = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatINR(amount: number): string {
  return `₹${inrFormatter.format(Math.round(amount))}`;
}

export function formatINRPrecise(amount: number): string {
  return `₹${inrFormatterWithPaise.format(amount)}`;
}

/**
 * Indian shorthand: ≥1 crore → "X.XX crore", ≥1 lakh → "X.XX lakh", else exact.
 */
export function formatINRShort(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) {
    const v = amount / 1_00_00_000;
    return `₹${trimZeros(v.toFixed(2))} crore`;
  }
  if (abs >= 1_00_000) {
    const v = amount / 1_00_000;
    return `₹${trimZeros(v.toFixed(2))} lakh`;
  }
  return formatINR(amount);
}

function trimZeros(s: string): string {
  if (s.includes(".")) {
    return s.replace(/\.?0+$/, "");
  }
  return s;
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

export function formatMonth(d: Date): string {
  return d.toLocaleString("en-IN", { month: "short" });
}
