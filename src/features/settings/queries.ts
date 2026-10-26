import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { SECTION_IMAGES } from "@/lib/section-copy";

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

export type SectionImageKey = keyof typeof SECTION_IMAGES;

export async function getSectionImages() {
  const defaults = SECTION_IMAGES;
  try {
    const row = await getSettingByKey("section_images");
    const stored = (row?.value ?? {}) as Partial<Record<SectionImageKey, string>>;
    return Object.fromEntries(
      (Object.keys(defaults) as SectionImageKey[]).map((key) => {
        const custom = stored[key]?.trim();
        const src = custom || defaults[key].src;
        return [
          key,
          {
            src,
            alt: src === defaults[key].src ? defaults[key].alt : `Fotografie pentru secțiunea ${key}`,
          },
        ];
      }),
    ) as Record<SectionImageKey, { src: string; alt: string }>;
  } catch (error) {
    console.error("[section images]", error);
    return defaults;
  }
}

export async function getSettingByKey(key: string) {
  return db.query.siteSettings.findFirst({ where: eq(siteSettings.key, key) });
}
