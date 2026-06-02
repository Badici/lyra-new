"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavEntry = {
  href: string;
  label: string;
};

export function AdminSidebarNav({ nav }: { nav: NavEntry[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-3 flex flex-col gap-1">
      {nav.map((entry) => {
        const isActive =
          pathname === entry.href ||
          (entry.href !== "/admin" && pathname.startsWith(`${entry.href}/`));
        return (
          <Link
            key={entry.href}
            href={entry.href}
            className={`rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? "bg-[var(--accent)]/20 text-[var(--accent-light)] text-base font-semibold"
                : "text-sm text-[var(--muted)] hover:bg-white/5 hover:text-[var(--cream)]"
            }`}
          >
            {entry.label}
          </Link>
        );
      })}
    </nav>
  );
}
