import { PageHeader } from "@/components/admin/page-header";
import { StockStatusBadge } from "@/components/admin/status-badge";
import { adjustStock } from "@/features/inventory/admin-actions";
import { getProductsForStockAdmin } from "@/features/products/admin-queries";

export default async function AdminStockPage() {
  const products = await getProductsForStockAdmin();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Stoc"
        description="Stoc 0 nu blochează comenzile — marchează livrarea la confirmare."
      />

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="admin-card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">
                  Stoc curent: {p.stockQuantity} · <StockStatusBadge status={p.stockStatus} />
                </p>
              </div>
            </div>
            <form action={adjustStock} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="productId" value={p.id} />
              <div className="min-w-[10rem] flex-1">
                <label className="admin-label" htmlFor={`delta-${p.id}`}>
                  Ajustare (+/-)
                </label>
                <input
                  id={`delta-${p.id}`}
                  name="delta"
                  type="number"
                  required
                  placeholder="ex. 5 sau -2"
                  className="admin-input"
                />
              </div>
              <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
                Ajustează
              </button>
            </form>
            {p.inventoryMovements?.length ? (
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {p.inventoryMovements.map((m) => (
                  <li key={m.id}>
                    {m.createdAt.toISOString().slice(0, 10)} · {m.delta > 0 ? "+" : ""}
                    {m.delta}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
