"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";

const NAV_LINKS = [
  { href: "/", label: "Acasă" },
  { href: "/catalog", label: "Catalog produse" },
  { href: "/plumbi-si-momitoare", label: "Plumbi și momitoare" },
  { href: "/cont", label: "Contul meu" },
];

const TICKER_ITEMS = [
  "Produs la comandă în România",
  "Timp până la livrare: 2-10 zile",
  "Calitate garantată",
  "Raport calitate-preț excelent",
];

const tickerTrack = [...TICKER_ITEMS, ...TICKER_ITEMS];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const loadSession = async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        return;
      }
      const session = (await response.json()) as {
        user?: { role?: string };
      };
      setIsAdmin(session.user?.role === "ADMIN");
    };
    void loadSession();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/95 backdrop-blur">
      <div className="overflow-hidden border-b border-[var(--accent)]/45 bg-gradient-to-r from-[var(--accent)]/15 via-[var(--accent-light)]/15 to-[var(--accent)]/15 shadow-[0_0_28px_rgba(251,191,36,0.28)]">
        <motion.div
          className="flex w-max items-center py-2.5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {tickerTrack.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="px-7 text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-light)] md:text-base"
            >
              ✦ {item}
            </span>
          ))}
        </motion.div>
      </div>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/logo-lyra.png"
            alt="Lyra Baits"
            width={120}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-[var(--muted)] lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-medium transition-colors hover:text-[var(--cream)] ${
                  pathname === link.href
                    ? "text-[var(--cream)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/20 px-4 py-2 text-sm font-semibold text-[var(--accent-light)] transition-colors hover:border-[var(--accent)] lg:inline-flex"
            >
              Interfață admin
            </Link>
          ) : null}
          <Link
            href="/cos"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--lake)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/20"
          >
            Coș
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[var(--cream)] lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Deschide meniul"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[var(--background)] lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-[var(--cream)] md:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 transition-colors hover:bg-white/5 ${
                    pathname === link.href ? "bg-white/10 text-[var(--cream)]" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  className="block rounded-lg px-3 py-2 text-[var(--accent-light)] transition-colors hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Interfață admin
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </header>
  );
}
