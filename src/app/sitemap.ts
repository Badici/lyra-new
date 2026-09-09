import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { articles, episodes, products, shows } from "@/db/schema";
import { PRODUCTION_SITE_URL } from "@/lib/constants";

const STATIC_ROUTES = [
  "",
  "/produse",
  "/articole",
  "/emisiuni",
  "/povestea-noastra",
  "/contact",
  "/termeni-si-conditii",
  "/politica-de-confidentialitate",
  "/livrare-si-retur",
  "/politica-cookie",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = PRODUCTION_SITE_URL;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [productRows, articleRows, showRows, episodeRows] = await Promise.all([
      db
        .select({ slug: products.slug, updatedAt: products.updatedAt })
        .from(products)
        .where(eq(products.isActive, true)),
      db
        .select({ slug: articles.slug, updatedAt: articles.updatedAt })
        .from(articles)
        .where(eq(articles.status, "PUBLISHED")),
      db
        .select({ slug: shows.slug, updatedAt: shows.updatedAt })
        .from(shows)
        .where(eq(shows.status, "PUBLISHED")),
      db
        .select({
          slug: episodes.slug,
          showSlug: shows.slug,
          updatedAt: episodes.updatedAt,
        })
        .from(episodes)
        .innerJoin(shows, eq(episodes.showId, shows.id))
        .where(eq(episodes.status, "PUBLISHED")),
    ]);

    const dynamicEntries: MetadataRoute.Sitemap = [
      ...productRows.map((p) => ({
        url: `${base}/produse/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...articleRows.map((a) => ({
        url: `${base}/articole/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...showRows.map((s) => ({
        url: `${base}/emisiuni/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...episodeRows.map((e) => ({
        url: `${base}/emisiuni/${e.showSlug}/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];

    return [...staticEntries, ...dynamicEntries];
  } catch (error) {
    console.error("[sitemap]", error);
    return staticEntries;
  }
}
