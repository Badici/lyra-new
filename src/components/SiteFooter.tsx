import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-sm text-[var(--muted)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} Lyra Baits. Produse pentru pescuit la crap.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/date-legale" className="transition-colors hover:text-[var(--cream)]">
            Date legale
          </Link>
          <Link
            href="/termeni-si-conditii"
            className="transition-colors hover:text-[var(--cream)]"
          >
            Termeni și condiții
          </Link>
        </div>
      </div>
    </footer>
  );
}
