import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="surface-depth mt-auto">
      <div className="container-lyra grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/logo-white-outline.png"
            alt="LyraBaits"
            width={160}
            height={48}
            className="mb-4 h-12 w-auto"
          />
          <p className="max-w-sm text-sm leading-relaxed text-cream/75">
            Hub digital pentru pescari: produse, articole, emisiuni și povestea
            brandului — construit de pescari, pentru pescari.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl tracking-wide">Descoperă</h2>
          <ul className="space-y-2 text-sm text-cream/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cos" className="link-underline hover:text-cream">
                Coș
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl tracking-wide">Legal</h2>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>
              <Link href="/termeni-si-conditii" className="link-underline hover:text-cream">
                Termeni și condiții
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-confidentialitate"
                className="link-underline hover:text-cream"
              >
                Politica de confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/livrare-si-retur" className="link-underline hover:text-cream">
                Livrare și retur
              </Link>
            </li>
            <li>
              <Link href="/politica-cookie" className="link-underline hover:text-cream">
                Politica cookie
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-lyra flex flex-col gap-2 py-5 text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} LyraBaits. Toate drepturile rezervate.</p>
          <p>lyrabaits.ro</p>
        </div>
      </div>
    </footer>
  );
}
