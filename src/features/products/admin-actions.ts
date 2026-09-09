"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { toBani } from "@/lib/money";
import { slugify, uniqueSlug } from "@/lib/slug";
import { resolveStockStatus } from "@/lib/stock";
import { requireAdmin } from "@/server/auth/session";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  sku: z.string().trim().min(2).max(64),
  categoryId: z.string().uuid(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  story: z.string().trim().optional(),
  usageInstructions: z.string().trim().optional(),
  priceRon: z.coerce.number().positive(),
  compareAtPriceRon: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().positive().optional(),
  ),
  stockQuantity: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isPopular: z.coerce.boolean().optional(),
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    story: formData.get("story") || undefined,
    usageInstructions: formData.get("usageInstructions") || undefined,
    priceRon: formData.get("priceRon"),
    compareAtPriceRon: formData.get("compareAtPriceRon") || undefined,
    stockQuantity: formData.get("stockQuantity"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    isPopular: formData.get("isPopular") === "on" || formData.get("isPopular") === "true",
  });
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const existing = await db.select({ slug: products.slug, id: products.id }).from(products);
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

export async function upsertProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) return;

  const data = parsed.data;
  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await ensureUniqueSlug(data.name, data.id);
  const priceBani = toBani(data.priceRon);
  const compareAtPriceBani =
    data.compareAtPriceRon != null ? toBani(data.compareAtPriceRon) : null;
  const stockStatus = resolveStockStatus(data.stockQuantity);

  const payload = {
    name: data.name,
    slug,
    sku: data.sku,
    categoryId: data.categoryId,
    shortDescription: data.shortDescription ?? null,
    description: data.description ?? null,
    story: data.story ?? null,
    usageInstructions: data.usageInstructions ?? null,
    priceBani,
    compareAtPriceBani,
    stockQuantity: data.stockQuantity,
    stockStatus,
    isActive: data.isActive ?? true,
    isFeatured: data.isFeatured ?? false,
    isPopular: data.isPopular ?? false,
  };

  if (data.id) {
    await db.update(products).set(payload).where(eq(products.id, data.id));
    revalidatePath("/admin/produse");
    revalidatePath(`/admin/produse/${data.id}`);
    revalidatePath("/admin/stoc");
    return;
  }

  const [created] = await db.insert(products).values(payload).returning({ id: products.id });
  if (!created) return;

  revalidatePath("/admin/produse");
  revalidatePath("/admin/stoc");
  redirect(`/admin/produse/${created.id}`);
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/produse");
  revalidatePath("/admin/stoc");
  redirect("/admin/produse");
}
