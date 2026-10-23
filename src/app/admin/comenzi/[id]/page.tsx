import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { updateOrderStatus } from "@/features/orders/admin-actions";
import { getAdminOrderById } from "@/features/orders/queries";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  OUT_OF_STOCK_MESSAGE_RO,
  REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO,
} from "@/lib/constants";
import { formatRon } from "@/lib/money";

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title={order.orderNumber}
        backHref="/admin/comenzi"
        description={`Creată ${order.createdAt.toISOString()}`}
      />

      {order.requiresDeliveryConfirmation ? (
        <div className="rounded-xl border border-sand/40 bg-sand/10 px-4 py-3 text-sm text-sand">
          <strong>{REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO}</strong>
          <p className="mt-1 text-cream/80">{OUT_OF_STOCK_MESSAGE_RO}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="admin-card space-y-3 p-5">
          <h2 className="font-display text-2xl">Client</h2>
          <p>{order.customerName}</p>
          <p className="text-sm text-muted">{order.customerEmail}</p>
          <p className="text-sm text-muted">{order.customerPhone}</p>
          <h3 className="pt-3 font-medium">Livrare</h3>
          <p className="text-sm">
            {order.shippingStreetLine}
            <br />
            {order.shippingCity}, {order.shippingCounty}
            {order.shippingPostalCode ? `, ${order.shippingPostalCode}` : ""}
          </p>
          {order.notes ? <p className="text-sm text-muted">Note: {order.notes}</p> : null}
        </section>

        <section className="admin-card space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Status</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <form action={updateOrderStatus} className="space-y-3">
            <input type="hidden" name="orderId" value={order.id} />
            <label className="admin-label" htmlFor="status">
              Actualizează status
            </label>
            <select id="status" name="status" defaultValue={order.status} className="admin-select">
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <textarea
              name="note"
              placeholder="Notă opțională"
              className="admin-textarea"
            />
            <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
              Salvează status
            </button>
          </form>
        </section>
      </div>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-2xl">Produse</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>SKU</th>
                <th>Cant.</th>
                <th>Preț</th>
                <th>Stoc la comandă</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/produse/${item.productSlug}`} className="hover:text-accent">
                      {item.productName}
                    </Link>
                    {item.requiresDeliveryConfirmation ? (
                      <div className="text-xs text-sand">{REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO}</div>
                    ) : null}
                  </td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{formatRon(item.lineTotalBani)}</td>
                  <td>{item.stockAtOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end border-t border-border px-5 py-4 text-sm">
          Total: <strong className="ml-2">{formatRon(order.totalBani)}</strong>
          <span className="ml-3 text-muted">· Ramburs</span>
        </div>
      </section>
    </div>
  );
}
