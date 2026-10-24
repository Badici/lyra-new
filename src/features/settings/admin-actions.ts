"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/server/auth/session";
import { saveFailure, validationError, type FormResult } from "@/server/forms/result";

const settingsSchema = z.object({
  contactEmail: z.string().trim().email(),
  contactWhatsapp: z.string().trim().min(8).max(32),
  socialFacebook: z.string().trim().optional(),
  socialInstagram: z.string().trim().optional(),
  socialYoutube: z.string().trim().optional(),
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
        facebook: data.socialFacebook ?? "",
        instagram: data.socialInstagram ?? "",
        youtube: data.socialYoutube ?? "",
      },
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: {
          facebook: data.socialFacebook ?? "",
          instagram: data.socialInstagram ?? "",
          youtube: data.socialYoutube ?? "",
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
  return { ok: true, message: "Setările au fost salvate." };
  } catch (error) {
    return saveFailure(error);
  }
}
