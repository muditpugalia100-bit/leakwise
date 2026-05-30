import type { ProductInput } from "./types";

const ASIN_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})/i,
  /\/gp\/product\/([A-Z0-9]{10})/i,
  /\/product\/([A-Z0-9]{10})/i,
];

function extractAsin(url: URL): string | null {
  for (const p of ASIN_PATTERNS) {
    const m = url.pathname.match(p);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

function extractFlipkartSlug(url: URL): string | null {
  // Flipkart URLs: /productname/p/itm123abc?pid=...
  const m = url.pathname.match(/\/([^/]+)\/p\//);
  return m ? m[1].replace(/-/g, " ") : null;
}

export function parseInput(raw: string): ProductInput {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Empty input");

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      const asin = extractAsin(url);
      const slug = extractFlipkartSlug(url);
      return {
        raw: trimmed,
        kind: "url",
        hostname,
        asin: asin ?? undefined,
        productSlug: slug ?? undefined,
      };
    } catch {
      /* fall through to text */
    }
  }

  return { raw: trimmed, kind: "text" };
}
