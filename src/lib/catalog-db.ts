import { type Product } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CatalogProduct } from "@/data/catalog";

function mapProduct(row: Product): CatalogProduct {
  const pricingConfig =
    row.pricingConfigJson && typeof row.pricingConfigJson === "object"
      ? (row.pricingConfigJson as CatalogProduct["pricingConfig"])
      : undefined;

  const variantSelector =
    row.variantSelectorLabel && row.variantValues.length > 0
      ? {
          label: row.variantSelectorLabel,
          values: row.variantValues,
          placeholder: row.variantPlaceholder ?? undefined,
        }
      : undefined;

  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    priceLabel: row.priceLabel,
    priceValueRon: row.basePriceRon,
    images: row.images,
    specs: row.specs,
    variantSelector,
    customOrderNote: row.customOrderNote ?? undefined,
    pricingConfig,
  };
}

export async function getProductsFromDb() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  const rows = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(mapProduct);
}

export async function getProductBySlugFromDb(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  const row = await prisma.product.findUnique({
    where: { slug },
  });
  if (!row || row.status !== "ACTIVE") {
    return null;
  }
  return mapProduct(row);
}
