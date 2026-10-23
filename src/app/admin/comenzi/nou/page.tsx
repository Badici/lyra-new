import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { AdminCreateOrderForm } from "@/features/orders/admin-create-order-form";
import { getAdminProducts } from "@/features/products/admin-queries";

export default async function AdminNewOrderPage() {
  const products = await getAdminProducts();
  const active = products
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p.id,
      name: p.name,
      priceBani: p.priceBani,
      sku: p.sku,
    }));

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Comandă nouă"
        description="Plasează o comandă manual din admin, cu toate datele completate de tine."
        backHref="/admin/comenzi"
        actions={
          <Link href="/admin/comenzi" className="text-sm text-muted hover:text-cream">
            Înapoi la listă
          </Link>
        }
      />
      {active.length === 0 ? (
        <p className="text-sm text-muted">Nu există produse active de adăugat în comandă.</p>
      ) : (
        <AdminCreateOrderForm products={active} />
      )}
    </div>
  );
}
