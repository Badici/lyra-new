import {
  getDisplayProducts as getStaticDisplayProducts,
  getMinimumConfiguredPriceRon,
  getProductBySlug as getStaticProductBySlug,
  products as staticProducts,
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
  try {
    const dbProducts = await getProductsFromDb();
    if (dbProducts.length > 0) {
      return dbProducts;
    }
    return getStaticDisplayProducts();
  } catch {
    return getStaticDisplayProducts();
  }
}

export async function getCatalogProductBySlug(slug: string) {
  try {
    const product = await getProductBySlugFromDb(slug);
    if (product) {
      return product;
    }
    return getStaticProductBySlug(slug) ?? null;
  } catch {
    return getStaticProductBySlug(slug) ?? null;
  }
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const all = await getCatalogProducts();
  return normalizeDisplay(all.filter((product) => product.slug !== slug)).slice(0, limit);
}

export function getStaticCatalogProducts() {
  return staticProducts;
}
