"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { ARTICLE_STATUSES } from "@/lib/constants";
import { slugify, uniqueSlug } from "@/lib/slug";
import { requireAdmin } from "@/server/auth/session";

const articleSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  contentJson: z.string().min(2),
  status: z.enum(ARTICLE_STATUSES),
  authorName: z.string().trim().optional(),
  isFeatured: z.coerce.boolean().optional(),
  tags: z.string().trim().optional(),
  coverImageKey: z.string().trim().optional(),
});

function parseArticleForm(formData: FormData) {
  return articleSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    contentJson: formData.get("content"),
    status: formData.get("status"),
    authorName: formData.get("authorName") || undefined,
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    tags: formData.get("tags") || undefined,
    coverImageKey: formData.get("coverImageKey") || undefined,
  });
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const existing = await db.select({ slug: articles.slug, id: articles.id }).from(articles);
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

export async function upsertArticle(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const parsed = parseArticleForm(formData);
  if (!parsed.success) return;

  const data = parsed.data;
  let content: Record<string, unknown>;
  try {
    content = JSON.parse(data.contentJson) as Record<string, unknown>;
  } catch {
    return;
  }

  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await ensureUniqueSlug(data.title, data.id);
  const tags = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt ?? null,
    content,
    status: data.status,
    authorId: session.user.id,
    authorName: data.authorName ?? "LyraBaits",
    isFeatured: data.isFeatured ?? false,
    tags,
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    coverImageKey: data.coverImageKey || null,
  };

  if (data.id) {
    const existing = await db.query.articles.findFirst({ where: eq(articles.id, data.id) });
    await db
      .update(articles)
      .set({
        ...payload,
        publishedAt:
          data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null,
      })
      .where(eq(articles.id, data.id));
    revalidatePath("/admin/articole");
    revalidatePath(`/admin/articole/${data.id}`);
    return;
  }

  const [created] = await db.insert(articles).values(payload).returning({ id: articles.id });
  if (!created) return;

  revalidatePath("/admin/articole");
  redirect(`/admin/articole/${created.id}`);
}

export async function deleteArticle(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/admin/articole");
  redirect("/admin/articole");
}
