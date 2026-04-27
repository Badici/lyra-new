import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni si conditii",
  description:
    "Termeni si conditii pentru comenzile Lyra Baits: comanda prin WhatsApp, livrare, preturi, retur si contact.",
  alternates: {
    canonical: "/termeni-si-conditii",
  },
};

export default function TermeniSiConditiiPage() {
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
          Termeni și condiții
        </h1>

        <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/40 p-5 md:p-7 space-y-6 text-[var(--muted)] leading-relaxed">
          <p>
            Prezentul document stabilește condițiile generale de utilizare a site-ului și de plasare a comenzilor pentru produsele
            comercializate de <span className="text-[var(--cream)] font-medium">Bădici Rareș PFA</span>, CIF RO47260759, Nr. Reg. Com.
            F40/6107/23.11.2022.
          </p>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">1. Modalitatea de comandă</h2>
            <p>
              Toate comenzile se plasează exclusiv prin WhatsApp, la numărul afișat pe site. Site-ul are rol de prezentare și nu oferă
              finalizare de comandă online.
            </p>
          </div>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">2. Prețuri și disponibilitate</h2>
            <p>
              Prețurile afișate pe site sunt informative și pot suferi modificări în funcție de configurațiile personalizate solicitate
              de client. Prețul final, cantitatea și specificațiile produselor se confirmă în conversația de comandă.
            </p>
          </div>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">3. Livrare</h2>
            <p>
              Livrarea comenzilor se face fie personal, fie prin curier Sameday, cu plata ramburs la livrare (colectare ramburs).
              Pentru livrările în România prin Sameday se aplică un tarif de transport de 30 lei/comandă.
            </p>
            <p className="mt-2">
              Termenul de livrare/predare se stabilește de comun acord între vânzător și client în momentul plasării comenzii, în
              funcție de disponibilitate, volum și gradul de personalizare.
            </p>
          </div>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">4. Politica de retur și rambursare</h2>
            <p>
              Rambursarea contravalorii produselor este posibilă exclusiv în situația în care produsele sunt livrate deteriorate.
              Clientul are obligația de a notifica deteriorarea în cel mai scurt timp, însoțită de dovezi foto relevante, pentru
              verificare și soluționare.
            </p>
          </div>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">5. Răspundere</h2>
            <p>
              Vânzătorul depune toate eforturile pentru acuratețea informațiilor publicate. Cu toate acestea, pot exista erori de
              redactare sau diferențe de prezentare, fără a genera obligații suplimentare din partea vânzătorului.
            </p>
          </div>

          <div>
            <h2 className="text-[var(--cream)] font-semibold mb-2">6. Date de contact</h2>
            <p>
              Pentru orice informații legate de comenzi, livrare sau condiții comerciale, ne poți contacta la:
              <br />
              Email: <a className="hover:text-[var(--accent-light)] transition-colors" href="mailto:raresbadici@gmail.com">raresbadici@gmail.com</a>
              <br />
              Telefon: <a className="hover:text-[var(--accent-light)] transition-colors" href="tel:0728241412">0728 241 412</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
