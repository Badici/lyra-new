import {
  getMinimumConfiguredPriceRon,
  type CatalogProduct,
} from "@/data/catalog";
import { getProductBySlugFromDb, getProductsFromDb } from "@/lib/catalog-db";

function normalizeDisplay(products: CatalogProduct[]) {
  return [...products].sort((a, b) => {
    const aPrice = a.pricingConfig ? getMinimumConfiguredPriceRon(a) : a.priceValueRon;
    const bPrice = b.pricingConfig ? getMinimumConfiguredPriceRon(b) : b.priceValueRon;
    if (aPrice === bPrice) {
      return a.name.localeCompare(b.name, "ro");
    }
    return aPrice - bPrice;
  });
}

export async function getCatalogProducts() {
  return getProductsFromDb();
}

export async function getCatalogProductBySlug(slug: string) {
  return getProductBySlugFromDb(slug);
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const all = await getCatalogProducts();
  return normalizeDisplay(all.filter((product) => product.slug !== slug)).slice(0, limit);
}
