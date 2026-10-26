"use server";

import { and, eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { productCategories, productVariants, products } from "@/db/schema";
import { toBani } from "@/lib/money";
import { slugify, uniqueSlug } from "@/lib/slug";
import { resolveStockStatus } from "@/lib/stock";
import { requireAdmin } from "@/server/auth/session";
import { decimalInput, saveFailure, validationError, type FormResult } from "@/server/forms/result";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  sku: z.string().trim().min(2).max(64),
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
  mainImageKey: z.string().trim().optional(),
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    sku: formData.get("sku"),
    shortDescription: formData.get("shortDescription") || undefined,
    description: formData.get("description") || undefined,
    story: formData.get("story") || undefined,
    usageInstructions: formData.get("usageInstructions") || undefined,
    priceRon: decimalInput(formData.get("priceRon")),
    compareAtPriceRon: decimalInput(formData.get("compareAtPriceRon")),
    stockQuantity: formData.get("stockQuantity"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    isPopular: formData.get("isPopular") === "on" || formData.get("isPopular") === "true",
    mainImageKey: formData.get("mainImageKey") || undefined,
  });
}

type ParsedVariant = {
  id?: string;
  name: string;
  sku: string | null;
  priceBani: number | null;
  stockQuantity: number;
  sortOrder: number;
};

function readVariants(
  formData: FormData,
): { ok: true; variants: ParsedVariant[] } | { ok: false; error: string } {
  const names = formData.getAll("variantName").map(String);
  const prices = formData.getAll("variantPriceRon").map(String);
  const stocks = formData.getAll("variantStock").map(String);
  const skus = formData.getAll("variantSku").map(String);
  const ids = formData.getAll("variantId").map(String);
  const variants: ParsedVariant[] = [];

  for (let index = 0; index < names.length; index += 1) {
    const name = names[index]?.trim() ?? "";
    if (!name) continue;
    const priceRaw = decimalInput(prices[index] ?? "");
    let priceBani: number | null = null;
    if (typeof priceRaw === "string" && priceRaw !== "") {
      const price = Number(priceRaw);
      if (!Number.isFinite(price) || price <= 0) {
        return { ok: false, error: `Prețul variantei „${name}" trebuie să fie mai mare decât 0.` };
      }
      priceBani = toBani(price);
    }
    const stock = Number(stocks[index] ?? 0);
    if (!Number.isInteger(stock) || stock < 0) {
      return { ok: false, error: `Stocul variantei „${name}" nu este valid.` };
    }
    const id = ids[index]?.trim();
    variants.push({
      id: id && z.string().uuid().safeParse(id).success ? id : undefined,
      name,
      sku: skus[index]?.trim() || null,
      priceBani,
      stockQuantity: stock,
      sortOrder: variants.length,
    });
  }

  return { ok: true, variants };
}

async function insertProduct(payload: typeof products.$inferInsert) {
  const [created] = await db.insert(products).values(payload).returning({ id: products.id });
  return created?.id;
}

async function syncVariants(productId: string, variants: ParsedVariant[]) {
  const keep: string[] = [];
  for (const variant of variants) {
    const values = {
      name: variant.name,
      sku: variant.sku,
      priceBani: variant.priceBani,
      stockQuantity: variant.stockQuantity,
      sortOrder: variant.sortOrder,
      isActive: true,
    };
    if (variant.id) {
      await db
        .update(productVariants)
        .set(values)
        .where(and(eq(productVariants.id, variant.id), eq(productVariants.productId, productId)));
      keep.push(variant.id);
    } else {
      const [created] = await db
        .insert(productVariants)
        .values({ ...values, productId })
        .returning({ id: productVariants.id });
      if (created) keep.push(created.id);
    }
  }

  if (keep.length === 0) {
    await db.delete(productVariants).where(eq(productVariants.productId, productId));
    return;
  }
  await db
    .delete(productVariants)
    .where(and(eq(productVariants.productId, productId), notInArray(productVariants.id, keep)));
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const existing = await db.select({ slug: products.slug, id: products.id }).from(products);
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

export async function upsertProduct(formData: FormData): Promise<FormResult> {
  try {
    await requireAdmin();
    const parsed = parseProductForm(formData);
    if (!parsed.success) return { ok: false, error: validationError(parsed.error) };

    const data = parsed.data;
    const slug = data.slug?.trim()
      ? slugify(data.slug)
      : await ensureUniqueSlug(data.name, data.id);
    if (!slug) return { ok: false, error: "Slug-ul nu este valid." };

    const categoryIds = [
      ...new Set(formData.getAll("categoryIds").map(String).map((id) => id.trim()).filter(Boolean)),
    ];
    const primaryCategoryId = categoryIds[0];
    if (
      !primaryCategoryId ||
      categoryIds.some((id) => !z.string().uuid().safeParse(id).success)
    ) {
      return { ok: false, error: "Alege cel puțin o categorie." };
    }
    const variants = readVariants(formData);
    if (!variants.ok) return variants;

    const gallery = formData
      .getAll("gallery")
      .map(String)
      .map((url) => url.trim())
      .filter(Boolean);

    const priceBani = toBani(data.priceRon);
    const compareAtPriceBani =
      data.compareAtPriceRon != null ? toBani(data.compareAtPriceRon) : null;
    const stockForStatus = Math.max(
      data.stockQuantity,
      ...variants.variants.map((variant) => variant.stockQuantity),
    );
    const stockStatus = resolveStockStatus(stockForStatus);

    const payload = {
      name: data.name,
      slug,
      sku: data.sku,
      categoryId: primaryCategoryId,
      shortDescription: data.shortDescription ?? null,
      ...(formData.has("description") ? { description: data.description ?? null } : {}),
      story: data.story ?? null,
      usageInstructions: data.usageInstructions ?? null,
      priceBani,
      compareAtPriceBani,
      stockQuantity: data.stockQuantity,
      stockStatus,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      isPopular: data.isPopular ?? false,
      mainImageKey: gallery[0] ?? null,
      gallery,
    };

    const productId = data.id ?? (await insertProduct(payload));
    if (!productId) return { ok: false, error: "Nu am putut salva produsul." };
    if (data.id) {
      await db.update(products).set(payload).where(eq(products.id, data.id));
    }

    await db.delete(productCategories).where(eq(productCategories.productId, productId));
    await db.insert(productCategories).values(
      categoryIds.map((categoryId) => ({ productId, categoryId })),
    );
    await syncVariants(productId, variants.variants);

    revalidatePath("/admin/produse");
    revalidatePath("/admin/stoc");
    revalidatePath("/produse");
    revalidatePath(`/produse/${slug}`);
    return { ok: true, message: data.id ? "Produsul a fost salvat." : "Produsul a fost adăugat." };
  } catch (error) {
    return saveFailure(error);
  }
}

export async function deleteProduct(formData: FormData): Promise<FormResult> {
  try {
    await requireAdmin();
    const id = z.string().uuid().parse(formData.get("id"));
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/produse");
    revalidatePath("/admin/stoc");
    revalidatePath("/produse");
    return { ok: true, message: "Produsul a fost șters." };
  } catch (error) {
    return saveFailure(error);
  }
}
