"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { categories, products } from "@/db/schema";
import { slugify, uniqueSlug } from "@/lib/slug";
import { requireAdmin } from "@/server/auth/session";

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  heroTitle: z.string().trim().optional(),
  heroDescription: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().optional(),
});

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    heroTitle: formData.get("heroTitle") || undefined,
    heroDescription: formData.get("heroDescription") || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const existing = await db.select({ slug: categories.slug, id: categories.id }).from(categories);
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

export async function upsertCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) return;

  const data = parsed.data;
  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await ensureUniqueSlug(data.name, data.id);

  const payload = {
    name: data.name,
    slug,
    description: data.description ?? null,
    shortDescription: data.shortDescription ?? null,
    heroTitle: data.heroTitle ?? null,
    heroDescription: data.heroDescription ?? null,
    sortOrder: data.sortOrder,
    isActive: data.isActive ?? true,
  };

  if (data.id) {
    await db.update(categories).set(payload).where(eq(categories.id, data.id));
  } else {
    await db.insert(categories).values(payload);
  }

  revalidatePath("/admin/categorii");
  revalidatePath("/admin/produse");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));

  const linked = await db.query.products.findFirst({
    where: eq(products.categoryId, id),
    columns: { id: true },
  });

  if (linked) return;

  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categorii");
}
