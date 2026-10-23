import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";

export type ContactSettings = {
  email: string;
  whatsapp: string;
};

export type SocialSettings = {
  facebook: string;
  instagram: string;
  youtube: string;
};

export type OrderSettings = {
  prefix: string;
};

export async function getSiteSettings() {
  const rows = await db.query.siteSettings.findMany();
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    contact: (byKey.contact as ContactSettings | undefined) ?? {
      email: "contact@lyrabaits.ro",
      whatsapp: "40728241412",
    },
    social: (byKey.social as SocialSettings | undefined) ?? {
      facebook: "",
      instagram: "",
      youtube: "",
    },
    orders: (byKey.orders as OrderSettings | undefined) ?? { prefix: "LYRA" },
    identity: byKey.site_identity as { isDevelopmentSeed?: boolean } | undefined,
  };
}

export async function getSettingByKey(key: string) {
  return db.query.siteSettings.findFirst({ where: eq(siteSettings.key, key) });
}
