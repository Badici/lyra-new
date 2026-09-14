import Image from "next/image";
import Link from "next/link";

const FAIR_MAP_EMBED =
  "https://maps.google.com/maps?q=Sala%20de%20Atletism%20Doina%20Melinte%2C%20Bac%C4%83u&hl=ro&z=16&output=embed";

export function ShutdownLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(248,164,29,0.16),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(34,120,78,0.18),transparent_30%),linear-gradient(180deg,#08110e_0%,#0d1a14_42%,#122018_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[rgba(248,164,29,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[rgba(11,61,43,0.45)] blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col px-4 py-10 sm:px-6 md:py-16">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo-navbar.png"
            alt="LyraBaits"
            width={240}
            height={80}
            className="h-14 w-auto sm:h-16"
            priority
          />

          <p className="mt-6 inline-flex items-center rounded-full border border-[rgba(248,164,29,0.45)] bg-[rgba(248,164,29,0.12)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F8A41D]">
            Revenim în curând
          </p>

          <h1 className="mt-5 max-w-3xl font-serif text-3xl leading-tight text-[var(--cream)] sm:text-5xl md:text-6xl">
            LyraBaits se va întoarce în curând.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-lg md:text-xl">
            Ne vedem la târgul de pescuit de la Bacău din perioada{" "}
            <span className="font-semibold text-[#F8A41D]">23–25 octombrie</span>,
            iar pentru restul anului ne concentrăm pe dezvoltarea noii platforme și pe
            stocuri pentru sezonul următor.
          </p>
        </div>

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] md:aspect-[1448/815]">
            <Image
              src="/hunting-moldavia-bacau.jpg"
              alt="Hunting Moldavia — Vânătoare, Pescuit & Outdoor, Bacău, 23–25 octombrie"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>

          <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-3 sm:p-5">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
              <p className="text-xs uppercase tracking-[0.16em] text-[#F8A41D]">Perioadă</p>
              <p className="mt-1 text-sm font-semibold text-[var(--cream)] sm:text-base">
                23–25 octombrie 2026
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[#F8A41D]">Locație</p>
              <p className="mt-1 text-sm font-semibold text-[var(--cream)] sm:text-base">
                Sala de Atletism „Doina Melinte”, Bacău
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]/40 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(248,164,29,0.18)] text-[#F8A41D]"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
              </span>
              <div>
                <h2 className="text-sm font-semibold text-[var(--cream)]">Unde ne găsești</h2>
                <p className="text-xs text-[var(--muted)]">Pin pe hartă — Bacău</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full">
              <iframe
                title="Hartă Sala de Atletism Doina Melinte, Bacău"
                src={FAIR_MAP_EMBED}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <a
                href="https://maps.google.com/?q=Sala+de+Atletism+Doina+Melinte,+Bac%C4%83u"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#F8A41D] transition-colors hover:text-[var(--accent-light)]"
              >
                Deschide în Google Maps →
              </a>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[var(--lake)]/40 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.25)] sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F8A41D]">
                Stand partener
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--cream)]">
                Suntem în stand alături de Plumbi și Momitoare
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                Vino să ne cunoști la Hunting Moldavia. Ne găsești împreună cu partenerii de la{" "}
                <Link
                  href="https://plumbisimomitoare.ro/?utm_source=lyrabaits&utm_medium=referral&utm_campaign=hunting-moldavia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--cream)] underline decoration-[#F8A41D]/60 underline-offset-4 transition-colors hover:text-[#F8A41D]"
                >
                  plumbisimomitoare.ro
                </Link>
                .
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href="tel:+40728241412"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-[rgba(248,164,29,0.45)] hover:bg-black/30"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(248,164,29,0.16)] text-[#F8A41D]"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.02l-2.2 2.19z" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Contact</p>
                  <p className="text-lg font-semibold text-[var(--cream)]">0728 241 412</p>
                </div>
              </a>

              <a
                href="https://wa.me/40728241412"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#F8A41D] px-5 py-3 text-sm font-bold text-[#0B3D2B] transition-transform duration-300 hover:scale-[1.02] hover:bg-[#ffb43a]"
              >
                Scrie-ne pe WhatsApp
              </a>
            </div>
          </article>
        </section>

        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Mulțumim pentru răbdare — LyraBaits revine cu o platformă nouă și stocuri pregătite
          pentru sezonul următor.
        </p>
      </div>
    </main>
  );
}
