import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/features/contact/contact-form";
import { getSiteSettings } from "@/features/settings/queries";
import { whatsappService } from "@/server/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează echipa LyraBaits — întrebări despre produse, comenzi sau parteneriate.",
};

export default async function ContactPage() {
  let phoneDisplay = "+40 728 241 412";
  let whatsappUrl = "https://wa.me/40728241412";

  try {
    const settings = await getSiteSettings();
    const digits = await whatsappService.resolvePhoneDigits();
    phoneDisplay = settings.contact.whatsapp.startsWith("+")
      ? settings.contact.whatsapp
      : `+${digits}`;
    whatsappUrl = whatsappService.buildDeepLink(
      "Bună! Vă contactez de pe lyrabaits.ro.",
      digits,
    );
  } catch {
    // keep defaults
  }

  return (
    <div className="section-lyra">
      <div className="container-lyra grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="font-hand mb-2 text-2xl text-accent">Scrie-ne</p>
          <h1 className="mb-4 font-display text-5xl tracking-wide">Contact</h1>
          <p className="mb-6 max-w-md leading-relaxed text-muted">
            Trimite un mesaj prin formular sau scrie-ne direct pe WhatsApp — pentru acum acesta
            este canalul rapid de contact.
          </p>
          <dl className="mb-8 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Email</dt>
              <dd>contact@lyrabaits.ro</dd>
            </div>
            <div>
              <dt className="text-muted">WhatsApp</dt>
              <dd>{phoneDisplay}</dd>
            </div>
          </dl>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-cream shadow-soft transition duration-500 ease-out hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            <span>Scrie pe WhatsApp</span>
            <span aria-hidden className="opacity-70 transition group-hover/btn:translate-x-1">
              →
            </span>
          </a>
        </div>

        <Suspense fallback={<p className="text-muted">Se încarcă formularul…</p>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
