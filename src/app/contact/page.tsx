import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Lyra Baits",
  description:
    "Contactează Lyra Baits pentru comenzi, întrebări și detalii despre produse. WhatsApp, telefon și email.",
  openGraph: {
    title: "Contact Lyra Baits",
    description:
      "Date de contact Lyra Baits: WhatsApp, apel telefonic și email pentru comenzi.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6 md:p-10">
        <h1 className="text-4xl font-semibold text-[var(--cream)] md:text-5xl">Contact</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          Pentru comenzi și informații despre produse ne poți contacta direct pe WhatsApp,
          telefonic sau pe email. Îți răspundem cât mai rapid.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a
            href="https://wa.me/40728241412"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-black/15 p-5 transition-colors hover:border-[var(--accent)]/50 hover:bg-black/25"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-light)]">
              <span aria-hidden>💬</span> WhatsApp
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--cream)]">+40 728 241 412</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Mesaj rapid pentru comenzi</p>
          </a>

          <a
            href="tel:+40728241412"
            className="group rounded-2xl border border-white/10 bg-black/15 p-5 transition-colors hover:border-[var(--accent)]/50 hover:bg-black/25"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-light)]">
              <span aria-hidden>📞</span> Telefon
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--cream)]">+40 728 241 412</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Apel direct</p>
          </a>
        </div>

        <a
          href="mailto:raresbadici@gmail.com"
          className="mt-4 block rounded-2xl border border-white/10 bg-black/15 p-5 transition-colors hover:border-[var(--accent)]/50 hover:bg-black/25"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-light)]">
            <span aria-hidden>✉️</span> Email
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--cream)]">raresbadici@gmail.com</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Pentru întrebări, comenzi speciale și colaborări.
          </p>
        </a>
      </section>
    </main>
  );
}
