import { StatsChart } from "@/components/admin/StatsChart";
import { getDashboardStats } from "@/lib/stats";

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--cream)]">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats(30);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Vânzări, costuri și profit pe ultimele 30 de zile.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Comenzi" value={String(stats.orderCount)} />
        <MetricCard label="Vânzări produse" value={`${stats.salesRon.toFixed(2)} RON`} />
        <MetricCard label="Livrări" value={`${stats.deliveryRon.toFixed(2)} RON`} />
        <MetricCard label="Cost materii" value={`${stats.cogsRon.toFixed(2)} RON`} />
        <MetricCard label="Profit" value={`${stats.profitRon.toFixed(2)} RON`} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-5">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Trend venit/profit</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Linia galbenă = total încasat, linia verde = profit.
        </p>
        <div className="mt-4">
          <StatsChart series={stats.series} />
        </div>
      </section>
    </div>
  );
}
