"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/cart-context";

type SiteHeaderProps = {
  showAdminLink?: boolean;
};

export function SiteHeader({ showAdminLink = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[var(--navbar-height)] border-b transition-[background,border,backdrop-filter] duration-300",
        scrolled || open
          ? "border-border/70 bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-cream/70 backdrop-blur-sm",
      )}
    >
      <div className="container-lyra flex h-full items-center justify-between gap-4">
        <Link href="/" className="relative flex shrink-0 items-center gap-2" onClick={closeMenu}>
          <Image
            src="/brand/logo-navbar.png"
            alt="LyraBaits"
            width={140}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-underline text-sm tracking-wide transition-colors duration-500",
                  active ? "text-accent" : "text-foreground/80 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {showAdminLink ? (
            <Link
              href="/admin"
              className={cn(
                "link-underline text-sm tracking-wide transition-colors duration-500",
                pathname.startsWith("/admin")
                  ? "text-accent"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {showAdminLink ? (
            <Link
              href="/admin"
              className="hidden h-11 items-center rounded-xl px-3 text-sm font-medium text-accent hover:bg-fog/60 sm:inline-flex lg:hidden"
              onClick={closeMenu}
            >
              Admin
            </Link>
          ) : null}
          <Link
            href="/cont"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-fog/60"
            aria-label="Cont"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/cos"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-fog/60"
            aria-label={`Coș${itemCount ? `, ${itemCount} produse` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-cream">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-fog/60 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-[var(--navbar-height)] z-40 border-b border-border bg-cream lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-lyra flex flex-col gap-1 py-4" aria-label="Mobil">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-base hover:bg-fog/60"
            >
              {link.label}
            </Link>
          ))}
          {showAdminLink ? (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-base font-medium text-accent hover:bg-fog/60"
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
