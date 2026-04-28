"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

const NAV_LINKS = [
  { href: "/", label: "Acasă" },
  { href: "/categorii/carlige-accesorii", label: "Cârlige și accesorii" },
  { href: "/categorii/monturi-forface", label: "Monturi și forface" },
  { href: "/categorii/nade-aditivi", label: "Nade și aditivi" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/95 backdrop-blur">
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
                className="font-medium transition-colors hover:text-[var(--cream)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
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
                  className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
