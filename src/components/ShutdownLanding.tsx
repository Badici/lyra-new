import Image from "next/image";
import Link from "next/link";

export function ShutdownLanding() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.12),transparent_28%),linear-gradient(180deg,#0a1015_0%,#0d1419_45%,#111c24_100%)]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
          Nou capitol
        </p>

        <div className="flex w-full max-w-2xl flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
          <div className="flex flex-1 flex-col items-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <Image
                src="/logo-lyra.png"
                alt="LyraBaits"
                width={280}
                height={120}
                className="h-auto w-44 object-contain sm:w-52"
                priority
              />
            </div>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              LyraBaits
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-[var(--accent-light)] shadow-lg">
            →
          </div>

          <div className="flex flex-1 flex-col items-center">
            <div className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5 shadow-[0_20px_60px_rgba(56,189,248,0.12)] backdrop-blur-sm">
              <Image
                src="/WhatsApp Image 2026-07-05 at 09.59.10.jpeg"
                alt="24Baits"
                width={280}
                height={120}
                className="h-auto w-44 object-contain sm:w-52"
                priority
              />
            </div>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-sky-200">
              24Baits
            </p>
          </div>
        </div>

        <h1 className="mt-12 font-serif text-4xl leading-tight text-[var(--cream)] sm:text-5xl md:text-6xl">
          LyraBaits a devenit 24Baits
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          Îți mulțumim că ai fost alături de noi pe LyraBaits. Aceeași pasiune pentru nada și
          monturi continuă acum sub un nou nume — găsești produsele noastre pe{" "}
          <span className="font-semibold text-sky-200">24baits.ro</span>.
        </p>

        <Link
          href="https://24baits.ro"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_12px_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-[1.03] hover:from-sky-400 hover:to-sky-300"
        >
          Mergi la 24baits.ro
        </Link>

        <p className="mt-8 max-w-xl text-sm text-[var(--muted)]">
          Site-ul LyraBaits nu mai este activ. Pentru comenzi, noutăți și catalogul complet, folosește
          noul website.
        </p>
      </div>
    </main>
  );
}
