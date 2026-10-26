"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { SECTION_IMAGES } from "@/lib/section-copy";
import { requireAdmin } from "@/server/auth/session";
import { saveFailure, validationError, type FormResult } from "@/server/forms/result";

function socialUrl(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.includes(".")) return `https://${trimmed.replace(/^\/+/, "")}`;
  return "";
}

const settingsSchema = z.object({
  contactEmail: z.string().trim().email(),
  contactWhatsapp: z.string().trim().min(8).max(32),
  socialFacebook: z.string().trim().optional(),
  socialInstagram: z.string().trim().optional(),
  socialYoutube: z.string().trim().optional(),
  socialTiktok: z.string().trim().optional(),
  orderPrefix: z.string().trim().min(2).max(20),
});

export async function updateSiteSettings(formData: FormData): Promise<FormResult> {
  try {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    contactEmail: formData.get("contactEmail"),
    contactWhatsapp: formData.get("contactWhatsapp"),
    socialFacebook: formData.get("socialFacebook") || "",
    socialInstagram: formData.get("socialInstagram") || "",
    socialYoutube: formData.get("socialYoutube") || "",
    socialTiktok: formData.get("socialTiktok") || "",
    orderPrefix: formData.get("orderPrefix"),
  });

  if (!parsed.success) return { ok: false, error: validationError(parsed.error) };

  const data = parsed.data;

  await db
    .insert(siteSettings)
    .values({
      key: "contact",
      value: {
        email: data.contactEmail,
        whatsapp: data.contactWhatsapp.replace(/[^\d+]/g, ""),
      },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: {
          email: data.contactEmail,
          whatsapp: data.contactWhatsapp.replace(/[^\d+]/g, ""),
        },
      },
    });

  await db
    .insert(siteSettings)
    .values({
      key: "social",
      value: {
        facebook: socialUrl(data.socialFacebook),
        instagram: socialUrl(data.socialInstagram),
        youtube: socialUrl(data.socialYoutube),
        tiktok: socialUrl(data.socialTiktok),
      },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: {
          facebook: socialUrl(data.socialFacebook),
          instagram: socialUrl(data.socialInstagram),
          youtube: socialUrl(data.socialYoutube),
          tiktok: socialUrl(data.socialTiktok),
        },
      },
    });

  await db
    .insert(siteSettings)
    .values({
      key: "orders",
      value: { prefix: data.orderPrefix.toUpperCase() },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: { prefix: data.orderPrefix.toUpperCase() } },
    });

  revalidatePath("/admin/setari");
  revalidatePath("/", "layout");
  return { ok: true, message: "Setările au fost salvate." };
  } catch (error) {
    return saveFailure(error);
  }
}

const sectionImageSchema = z.object({
  produse: z.string().trim().optional(),
  articole: z.string().trim().optional(),
  emisiuni: z.string().trim().optional(),
  poveste: z.string().trim().optional(),
});

export async function updateSectionImages(formData: FormData): Promise<FormResult> {
  try {
    await requireAdmin();
    const parsed = sectionImageSchema.safeParse({
      produse: formData.get("produse") || "",
      articole: formData.get("articole") || "",
      emisiuni: formData.get("emisiuni") || "",
      poveste: formData.get("poveste") || "",
    });
    if (!parsed.success) return { ok: false, error: validationError(parsed.error) };

    const value = Object.fromEntries(
      (Object.keys(SECTION_IMAGES) as (keyof typeof SECTION_IMAGES)[]).map((key) => [
        key,
        parsed.data[key] || "",
      ]),
    );

    await db
      .insert(siteSettings)
      .values({ key: "section_images", value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value },
      });

    revalidatePath("/");
    revalidatePath("/produse");
    revalidatePath("/articole");
    revalidatePath("/emisiuni");
    revalidatePath("/admin/imagini");
    return { ok: true, message: "Imaginile au fost salvate." };
  } catch (error) {
    return saveFailure(error);
  }
}
