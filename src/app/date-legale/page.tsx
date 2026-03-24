"use client";

import Link from "next/link";

export default function DateLegalePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--cream)] transition-colors"
          >
            ← Înapoi la site
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-8">
          Date legale
        </h1>

        <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/40 p-5 md:p-7">
          <dl className="space-y-4 text-sm md:text-base">
            <div>
              <dt className="text-[var(--muted)]">Denumire legală</dt>
              <dd className="text-[var(--cream)] font-medium">Bădici Rareș PFA</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">CIF</dt>
              <dd className="text-[var(--cream)] font-medium">RO47260759</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Nr. înregistrare Registrul Comerțului</dt>
              <dd className="text-[var(--cream)] font-medium">F40/6107/23.11.2022</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Sediu profesional</dt>
              <dd className="text-[var(--cream)] font-medium">
                Șos. Chitilei 242 E, Corp C5, Ap. 328, Parter, Faza 2
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Persoană de contact</dt>
              <dd className="text-[var(--cream)] font-medium">Rareș Bădici</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Email</dt>
              <dd className="text-[var(--cream)] font-medium">
                <a href="mailto:raresbadici@gmail.com" className="hover:text-[var(--accent-light)] transition-colors">
                  raresbadici@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Telefon</dt>
              <dd className="text-[var(--cream)] font-medium">
                <a href="tel:0728241412" className="hover:text-[var(--accent-light)] transition-colors">
                  0728 241 412
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Program de contact</dt>
              <dd className="text-[var(--cream)] font-medium">Luni - Vineri, 09:00 - 18:00</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Arie de livrare</dt>
              <dd className="text-[var(--cream)] font-medium">Uniunea Europeană (UE)</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Metodă de comandă</dt>
              <dd className="text-[var(--cream)] font-medium">WhatsApp</dd>
            </div>
          </dl>
        </section>

        <section id="confidentialitate" className="mt-8 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--cream)] mb-3">
            Notă de confidențialitate
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Acest site are rol de prezentare și nu colectează direct date personale prin formulare sau conturi de utilizator.
            Comenzile se realizează prin WhatsApp, iar prelucrarea datelor transmise în cadrul conversațiilor are loc doar
            pentru comunicare comercială, ofertare, procesarea comenzii și livrare.
          </p>
        </section>
      </div>
    </main>
  );
}
