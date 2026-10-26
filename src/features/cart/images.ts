"use server";

import { inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { products } from "@/db/schema";

export async function lookupCartImages(slugs: string[]) {
  const unique = [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))].slice(0, 40);
  if (unique.length === 0) return {};
  try {
    const rows = await db.query.products.findMany({
      where: inArray(products.slug, unique),
      columns: { slug: true, mainImageKey: true, gallery: true },
    });
    return Object.fromEntries(
      rows.map((row) => [row.slug, row.mainImageKey || row.gallery?.[0] || null]),
    );
  } catch (error) {
    console.error("[cart images]", error);
    return {};
  }
}
