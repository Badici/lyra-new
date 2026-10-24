import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { categories, productCategories } from "@/db/schema";

export async function getAdminCategories() {
  const cats = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });

  const counts = await db
    .select({
      categoryId: productCategories.categoryId,
      count: sql<number>`count(distinct ${productCategories.productId})::int`,
    })
    .from(productCategories)
    .groupBy(productCategories.categoryId);

  const countByCategory = Object.fromEntries(
    counts.map((row) => [row.categoryId, row.count]),
  );

  return cats.map((cat) => ({
    ...cat,
    productCount: countByCategory[cat.id] ?? 0,
  }));
}

export async function getAdminCategoryById(id: string) {
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
}

export async function getCategoryProductCount(categoryId: string) {
  const rows = await db
    .select({ productId: productCategories.productId })
    .from(productCategories)
    .where(eq(productCategories.categoryId, categoryId));
  return rows.length;
}
