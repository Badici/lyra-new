import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { articles, categories, episodes, products, shows } from "@/db/schema";

export async function getActiveCategories() {
  return db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
  });
}

export async function getProductsByCategory(categoryId: string) {
  return db.query.products.findMany({
    where: and(eq(products.categoryId, categoryId), eq(products.isActive, true)),
    orderBy: [desc(products.isFeatured), asc(products.name)],
  });
}

export async function getPopularProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isPopular, true)),
    orderBy: [desc(products.updatedAt)],
    limit,
  });
}

export async function getFeaturedProducts(limit = 4) {
  return db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isFeatured, true)),
    limit,
  });
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: { category: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true),
        sql`${products.id} <> ${excludeId}`,
      ),
    )
    .limit(limit);
}

export async function getPublishedArticles(limit = 12) {
  return db.query.articles.findMany({
    where: eq(articles.status, "PUBLISHED"),
    orderBy: [desc(articles.isFeatured), desc(articles.publishedAt)],
    limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.status, "PUBLISHED")),
  });
}

export async function getPublishedShows() {
  return db.query.shows.findMany({
    where: eq(shows.status, "PUBLISHED"),
    orderBy: [asc(shows.sortOrder), asc(shows.name)],
  });
}

export async function getShowBySlug(slug: string) {
  return db.query.shows.findFirst({
    where: and(eq(shows.slug, slug), eq(shows.status, "PUBLISHED")),
    with: {
      episodes: {
        where: eq(episodes.status, "PUBLISHED"),
        orderBy: [asc(episodes.episodeNumber)],
      },
    },
  });
}

export async function getEpisode(showSlug: string, episodeSlug: string) {
  const show = await getShowBySlug(showSlug);
  if (!show) return null;
  const episode = show.episodes.find((e) => e.slug === episodeSlug);
  if (!episode) return null;
  return { show, episode };
}

export async function getCatalogJourney() {
  const cats = await getActiveCategories();
  const sections = await Promise.all(
    cats.map(async (category) => {
      const items = await getProductsByCategory(category.id);
      return { category, products: items };
    }),
  );
  return sections;
}
