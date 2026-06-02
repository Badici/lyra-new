import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog-service";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lyrabaits.ro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const basePages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/date-legale`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/termeni-si-conditii`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/cos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cont`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/plumbi-si-momitoare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const products = await getCatalogProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/produse/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...basePages,
    ...productPages,
  ];
}
