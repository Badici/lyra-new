import type { MetadataRoute } from "next";
import { PRODUCTION_SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cont", "/checkout", "/cos"],
    },
    sitemap: `${PRODUCTION_SITE_URL}/sitemap.xml`,
  };
}
