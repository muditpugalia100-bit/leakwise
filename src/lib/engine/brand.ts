import { SHOPIFY_BRANDS } from "../config";
import { shopifySearch, shopifyVerify } from "../wire/actions";
import type { BrandDirectListing } from "./types";

function lookupBrand(brand: string | undefined): string | null {
  if (!brand) return null;
  const key = brand.toLowerCase().trim();
  if (SHOPIFY_BRANDS[key]) return SHOPIFY_BRANDS[key];
  // Fuzzy: any known brand contained in the brand string
  for (const [k, v] of Object.entries(SHOPIFY_BRANDS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

export async function checkBrandDirect(
  brand: string | undefined,
  productTitle: string,
): Promise<BrandDirectListing | null> {
  const domain = lookupBrand(brand);
  if (!domain || !brand) return null;

  const storeUrl = `https://${domain}`;

  // 1. Verify (cheap — confirms it's actually Shopify)
  const verify = await shopifyVerify(storeUrl, { timeoutMs: 15_000 });
  if (!verify.ok) return null;
  // some sites return `is_shopify: true` differently — treat truthy as good
  const isShopify = Boolean((verify.data as { is_shopify?: boolean }).is_shopify);
  if (!isShopify) return null;

  // 2. Search for the product on the brand's store
  const search = await shopifySearch(storeUrl, productTitle, { timeoutMs: 20_000 });
  if (!search.ok) return null;

  const data = search.data as { results?: unknown; products?: unknown };
  const hitsRaw = (data.results ?? data.products ?? []) as Array<Record<string, unknown>>;
  if (!hitsRaw.length) return null;

  const top = hitsRaw[0];
  const price = Number(top.price ?? 0);
  if (!price) return null;

  const title = (top.title as string) ?? productTitle;
  const handle = top.handle as string | undefined;
  const productUrl = (top.url as string) ?? (handle ? `${storeUrl}/products/${handle}` : storeUrl);
  const image = (top.image as string) ?? undefined;

  return {
    platform: "shopify",
    platformName: `${brand} (brand direct)`,
    title,
    brand,
    productUrl,
    imageUrl: image,
    listedPrice: price,
    deliveryCost: 0, // brand sites typically include shipping
    deliveredPrice: price,
    inStock: true,
    storeDomain: domain,
  };
}
