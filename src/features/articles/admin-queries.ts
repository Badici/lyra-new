import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { articles } from "@/db/schema";

export async function getAdminArticles() {
  return db.query.articles.findMany({
    orderBy: [desc(articles.updatedAt)],
  });
}

export async function getAdminArticleById(id: string) {
  return db.query.articles.findFirst({ where: eq(articles.id, id) });
}
