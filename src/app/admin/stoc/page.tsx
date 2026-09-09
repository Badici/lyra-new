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
            <form action={adjustStock} className="grid gap-3 sm:grid-cols-4">
              <input type="hidden" name="productId" value={p.id} />
              <input
                name="delta"
                type="number"
                required
                placeholder="Delta (+/-)"
                className="admin-input"
              />
              <input
                name="reason"
                required
                placeholder="Motiv"
                className="admin-input sm:col-span-2"
              />
              <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
                Ajustează
              </button>
            </form>
            {p.inventoryMovements?.length ? (
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {p.inventoryMovements.map((m) => (
                  <li key={m.id}>
                    {m.createdAt.toISOString().slice(0, 10)} · {m.delta > 0 ? "+" : ""}
                    {m.delta} · {m.reason}
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
