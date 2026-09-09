"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { episodes, shows } from "@/db/schema";
import { CONTENT_STATUSES } from "@/lib/constants";
import { slugify, uniqueSlug } from "@/lib/slug";
import { requireAdmin } from "@/server/auth/session";

const showSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  status: z.enum(CONTENT_STATUSES),
  sortOrder: z.coerce.number().int().default(0),
});

const episodeSchema = z.object({
  id: z.string().uuid().optional(),
  showId: z.string().uuid(),
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  episodeNumber: z.coerce.number().int().positive(),
  seasonNumber: z.coerce.number().int().positive().optional(),
  videoUrl: z.string().trim().optional(),
  videoProvider: z.string().trim().optional(),
  durationSeconds: z.coerce.number().int().positive().optional(),
  status: z.enum(CONTENT_STATUSES),
});

async function ensureShowSlug(base: string, excludeId?: string) {
  const existing = await db.select({ slug: shows.slug, id: shows.id }).from(shows);
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

async function ensureEpisodeSlug(showId: string, base: string, excludeId?: string) {
  const existing = await db
    .select({ slug: episodes.slug, id: episodes.id })
    .from(episodes)
    .where(eq(episodes.showId, showId));
  const slugs = new Set(existing.filter((r) => r.id !== excludeId).map((r) => r.slug));
  return uniqueSlug(base, slugs);
}

export async function upsertShow(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = showSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) return;

  const data = parsed.data;
  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await ensureShowSlug(data.name, data.id);

  const payload = {
    name: data.name,
    slug,
    description: data.description ?? null,
    shortDescription: data.shortDescription ?? null,
    status: data.status,
    sortOrder: data.sortOrder,
  };

  if (data.id) {
    await db.update(shows).set(payload).where(eq(shows.id, data.id));
    revalidatePath("/admin/emisiuni");
    revalidatePath(`/admin/emisiuni/${data.id}`);
    return;
  }

  const [created] = await db.insert(shows).values(payload).returning({ id: shows.id });
  if (!created) return;

  revalidatePath("/admin/emisiuni");
  redirect(`/admin/emisiuni/${created.id}`);
}

export async function deleteShow(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  await db.delete(shows).where(eq(shows.id, id));
  revalidatePath("/admin/emisiuni");
  redirect("/admin/emisiuni");
}

export async function upsertEpisode(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = episodeSchema.safeParse({
    id: formData.get("id") || undefined,
    showId: formData.get("showId"),
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    episodeNumber: formData.get("episodeNumber"),
    seasonNumber: formData.get("seasonNumber") || undefined,
    videoUrl: formData.get("videoUrl") || undefined,
    videoProvider: formData.get("videoProvider") || undefined,
    durationSeconds: formData.get("durationSeconds") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) return;

  const data = parsed.data;
  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await ensureEpisodeSlug(data.showId, data.title, data.id);

  const payload = {
    showId: data.showId,
    title: data.title,
    slug,
    description: data.description ?? null,
    episodeNumber: data.episodeNumber,
    seasonNumber: data.seasonNumber ?? null,
    videoUrl: data.videoUrl ?? null,
    videoProvider: data.videoProvider ?? null,
    durationSeconds: data.durationSeconds ?? null,
    status: data.status,
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
  };

  if (data.id) {
    const existing = await db.query.episodes.findFirst({ where: eq(episodes.id, data.id) });
    await db
      .update(episodes)
      .set({
        ...payload,
        publishedAt:
          data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null,
      })
      .where(eq(episodes.id, data.id));
  } else {
    await db.insert(episodes).values(payload);
  }

  revalidatePath("/admin/emisiuni");
  revalidatePath(`/admin/emisiuni/${data.showId}`);
}

export async function deleteEpisode(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const episode = await db.query.episodes.findFirst({ where: eq(episodes.id, id) });
  if (!episode) return;

  await db.delete(episodes).where(eq(episodes.id, id));
  revalidatePath("/admin/emisiuni");
  revalidatePath(`/admin/emisiuni/${episode.showId}`);
}
