import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { getAdminOrders } from "@/features/orders/queries";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { formatRon } from "@/lib/money";
import { REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO } from "@/lib/constants";

type SearchParams = Promise<{ status?: string; q?: string }>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const status =
    params.status && ORDER_STATUSES.includes(params.status as OrderStatus)
      ? (params.status as OrderStatus)
      : undefined;
  const orders = await getAdminOrders({ status, q: params.q, limit: 100 });

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title="Comenzi" description="Filtrează și gestionează comenzile." />

      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Caută număr, client, email…"
          className="admin-input"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="admin-select sm:max-w-xs"
        >
          <option value="">Toate statusurile</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
          Filtrează
        </button>
      </form>

      <div className="admin-card overflow-hidden">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Număr</th>
                <th>Client</th>
                <th>Status</th>
                <th>Total</th>
                <th>Alertă</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted">
                    Nicio comandă găsită.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={`/admin/comenzi/${order.id}`}
                        className="text-accent hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted">{order.customerEmail}</div>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{formatRon(order.totalBani)}</td>
                    <td>
                      {order.requiresDeliveryConfirmation ? (
                        <span className="text-xs text-sand">
                          {REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
