import Link from "next/link";
import { DevBanner } from "@/components/admin/dev-banner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { getAdminDashboardStats } from "@/features/analytics/queries";
import { getAdminOrders } from "@/features/orders/queries";
import { formatRon } from "@/lib/money";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const recent = await getAdminOrders({ limit: 8 });

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageHeader
        title="Dashboard"
        description="Statistici din baza de date — nu valori demonstrative inventate."
      />

      {stats.devSeed.isDevSeed ? (
        <DevBanner message={stats.devSeed.reason ?? "Date de dezvoltare detectate."} />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Comenzi" value={String(stats.orders.total)} />
        <StatCard label="Azi" value={String(stats.orders.today)} />
        <StatCard label="Venit total" value={stats.orders.revenueLabel} />
        <StatCard label="Valoare medie" value={stats.orders.aovLabel} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Produse"
          value={String(stats.products.total)}
          hint={`${stats.products.active} active`}
        />
        <StatCard
          label="Stoc zero / la comandă"
          value={String(stats.products.madeToOrder)}
        />
        <StatCard label="Clienți" value={String(stats.customers)} />
        <StatCard
          label="Conținut"
          value={`${stats.content.articlesPublished} articole`}
          hint={`${stats.content.shows} emisiuni · ${stats.content.episodes} episoade`}
        />
      </section>

      <section className="admin-card p-5">
        <h2 className="mb-4 font-display text-2xl">Comenzi pe status</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stats.orders.byStatus.map((row) => (
            <li
              key={row.status}
              className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
            >
              <OrderStatusBadge status={row.status} />
              <span>{row.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-2xl">Comenzi recente</h2>
          <Link href="/admin/comenzi" className="text-sm text-accent hover:underline">
            Vezi toate
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Număr</th>
                <th>Client</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-muted">
                    Nicio comandă încă.
                  </td>
                </tr>
              ) : (
                recent.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={`/admin/comenzi/${order.id}`}
                        className="text-accent hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.customerName}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{formatRon(order.totalBani)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
