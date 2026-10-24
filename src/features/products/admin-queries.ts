import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { inventoryMovements, productVariants, products } from "@/db/schema";

export async function getAdminProducts() {
  return db.query.products.findMany({
    orderBy: [desc(products.updatedAt)],
    with: { category: true, variants: true },
  });
}

export async function getAdminProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      categoryLinks: true,
      variants: { orderBy: [asc(productVariants.sortOrder), asc(productVariants.name)] },
    },
  });
}

export async function getProductsForStockAdmin() {
  return db.query.products.findMany({
    orderBy: [asc(products.name)],
    with: {
      variants: {
        orderBy: [asc(productVariants.sortOrder), asc(productVariants.name)],
      },
      inventoryMovements: {
        orderBy: [desc(inventoryMovements.createdAt)],
        limit: 5,
      },
    },
  });
}
