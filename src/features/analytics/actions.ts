"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { articles, products } from "@/db/schema";

export async function recordPageView(kind: "product" | "article", slug: string) {
  if (!slug || slug.length > 200) return false;

  try {
    if (kind === "product") {
      const updated = await db
        .update(products)
        .set({ viewCount: sql`${products.viewCount} + 1` })
        .where(and(eq(products.slug, slug), eq(products.isActive, true)))
        .returning({ id: products.id });
      return updated.length > 0;
    }

    const updated = await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(and(eq(articles.slug, slug), eq(articles.status, "PUBLISHED")))
      .returning({ id: articles.id });
    return updated.length > 0;
  } catch (error) {
    console.error("[page-view]", error);
    return false;
  }
}
