import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produse", label: "Produse" },
  { href: "/admin/materii-prime", label: "Materii prime" },
  { href: "/admin/retete", label: "Rețete" },
  { href: "/admin/comenzi", label: "Comenzi" },
  { href: "/admin/comenzi/noua", label: "Comandă manuală" },
  { href: "/admin/utilizatori", label: "Utilizatori" },
  { href: "/admin/setari", label: "Setări" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <main className="px-4 py-8 md:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 lg:w-64">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-light)]">
            Admin Lyra
          </p>
          <AdminSidebarNav nav={NAV} />
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
}
