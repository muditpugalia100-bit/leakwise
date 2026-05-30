import type { Vertical } from "../config";
import type { ProductInput } from "./types";

const ELECTRONICS_KEYWORDS = [
  "laptop", "phone", "smartphone", "tv", "television", "headphone", "earbud",
  "earphone", "speaker", "soundbar", "camera", "lens", "ac ", "air conditioner",
  "refrigerator", "fridge", "washing machine", "microwave", "monitor", "tablet",
  "ipad", "macbook", "iphone", "samsung galaxy", "smart watch", "smartwatch",
  "router", "ssd", "hard drive", "ram ", "graphics card", "gpu", "console",
  "playstation", "xbox", "nintendo", "kindle", "fire tv",
];

const GROCERY_KEYWORDS = [
  "atta", "flour", "rice", "dal", "lentil", "oil", "ghee", "milk", "curd",
  "yogurt", "paneer", "bread", "biscuit", "cookie", "chips", "namkeen",
  "chocolate", "tea", "coffee", "instant", "noodle", "pasta", "sauce",
  "shampoo", "conditioner", "soap", "body wash", "detergent", "toothpaste",
  "diaper", "tissue", "sanitiser", "cleaner",
];

export function routeVertical(
  input: ProductInput,
  anchor?: { title?: string; category?: string; brand?: string },
): Vertical {
  const text = [
    input.raw,
    anchor?.title ?? "",
    anchor?.category ?? "",
    anchor?.brand ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (ELECTRONICS_KEYWORDS.some((k) => text.includes(k))) return "electronics";
  if (GROCERY_KEYWORDS.some((k) => text.includes(k))) return "grocery";
  return "general";
}
