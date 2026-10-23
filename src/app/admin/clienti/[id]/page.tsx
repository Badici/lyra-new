import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { getAdminCustomerById } from "@/features/customers/admin-queries";
import { formatRon } from "@/lib/money";

type Params = Promise<{ id: string }>;

export default async function AdminCustomerDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const data = await getAdminCustomerById(id);
  if (!data) notFound();

  const { customer, orders, addresses } = data;
  const lifetime = orders.reduce((acc, o) => acc + o.totalBani, 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title={customer.name} backHref="/admin/clienti" />
      <section className="admin-card space-y-2 p-5 text-sm">
        <p>{customer.email}</p>
        <p>{customer.phone ?? "Fără telefon"}</p>
        <p className="text-muted">Cont creat: {customer.createdAt.toISOString().slice(0, 10)}</p>
        <p>
          Comenzi: {orders.length} · LTV: {formatRon(lifetime)}
        </p>
      </section>

      <section className="admin-card p-5">
        <h2 className="mb-3 font-display text-2xl">Adrese</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-muted">Nicio adresă salvată.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {addresses.map((a) => (
              <li key={a.id}>
                {a.fullName} · {a.streetLine}, {a.city}, {a.county}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-2xl">Comenzi recente</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Număr</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/comenzi/${o.id}`} className="text-accent hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td>{formatRon(o.totalBani)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
