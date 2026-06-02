import Link from "next/link";
import { listOrdersForAdmin } from "@/lib/order-service";

export default async function AdminOrdersPage() {
  const orders = await listOrdersForAdmin();

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--cream)]">Comenzi</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Istoric complet comenzi plasate (guest, cont, manual).
          </p>
        </div>
        <Link
          href="/admin/comenzi/noua"
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Adaugă comandă manuală
        </Link>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)]">
                <th className="p-2">Număr</th>
                <th className="p-2">Status</th>
                <th className="p-2">Sursă</th>
                <th className="p-2">Client</th>
                <th className="p-2">Total</th>
                <th className="p-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/10 text-[var(--cream)]">
                  <td className="p-2">{order.number}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{order.source}</td>
                  <td className="p-2">{order.address?.fullName ?? order.user?.name ?? "-"}</td>
                  <td className="p-2">{order.totalRon.toFixed(2)} RON</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString("ro-RO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
