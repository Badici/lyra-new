import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StockStatusBadge } from "@/components/admin/status-badge";
import { getAdminProducts } from "@/features/products/admin-queries";
import { formatRon } from "@/lib/money";

export default async function AdminProductsPage() {
  const items = await getAdminProducts();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Produse"
        description="CRUD catalog."
        actions={
          <Link href="/admin/produse/nou" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
            Produs nou
          </Link>
        }
      />

      <div className="admin-card overflow-hidden">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nume</th>
                <th>Categorie</th>
                <th>Preț</th>
                <th>Stoc</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted">
                    Niciun produs.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/produse/${p.id}`} className="text-accent hover:underline">
                        {p.name}
                      </Link>
                      <div className="text-xs text-muted">{p.sku}</div>
                    </td>
                    <td>{p.category?.name ?? "—"}</td>
                    <td>{formatRon(p.priceBani)}</td>
                    <td>{p.stockQuantity}</td>
                    <td>
                      <StockStatusBadge status={p.stockStatus} />
                      {!p.isActive ? (
                        <span className="ml-2 text-xs text-muted">inactiv</span>
                      ) : null}
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
