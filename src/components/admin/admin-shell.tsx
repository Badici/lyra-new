"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  userName: string;
  children: React.ReactNode;
};

export function AdminShell({ userName, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {ADMIN_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item.href, "exact" in item ? item.exact : false)
              ? "bg-accent/15 text-accent"
              : "text-cream/75 hover:bg-forest/60 hover:text-cream",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="admin-shell flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-[var(--surface)] md:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="font-display text-2xl tracking-wide text-cream">LyraBaits</p>
          <p className="mt-0.5 text-xs text-muted">Panou administrare</p>
        </div>
        {nav}
        <div className="mt-auto border-t border-border px-5 py-4">
          <p className="truncate text-xs text-muted">{userName}</p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Înapoi la site
          </Link>
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-[var(--surface)] px-4 py-3 md:hidden">
          <div>
            <p className="font-display text-xl text-cream">LyraBaits Admin</p>
            <p className="text-xs text-muted">{userName}</p>
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl border border-border p-2 text-cream"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {mobileOpen && (
          <div className="border-b border-border bg-[var(--surface)] md:hidden">{nav}</div>
        )}

        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
