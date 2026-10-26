"use server";

import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { SHOP_EMAIL } from "@/lib/constants";
import { contactSchema } from "@/lib/validators";
import { deliverEmail } from "@/server/email/deliver";

export type ContactActionState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitContactAction(
  _prev: ContactActionState | undefined,
  formData: FormData,
): Promise<ContactActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifică datele din formular.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db.insert(contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });
    const lines = [
      `Nume: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      parsed.data.phone ? `Telefon: ${parsed.data.phone}` : "",
      parsed.data.subject ? `Subiect: ${parsed.data.subject}` : "",
      "",
      parsed.data.message,
    ].filter((line) => line !== "");
    await deliverEmail({
      to: SHOP_EMAIL,
      replyTo: parsed.data.email,
      subject: `[LyraBaits] Mesaj de la ${parsed.data.name}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("[contact]", error);
    return {
      ok: false,
      message: "Nu am putut trimite mesajul. Încearcă din nou sau scrie-ne direct pe email.",
    };
  }

  return {
    ok: true,
    message: "Mulțumim! Mesajul tău a fost înregistrat. Revenim cât de curând.",
  };
}
