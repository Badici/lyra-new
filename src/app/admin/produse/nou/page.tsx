import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/features/categories/queries";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title="Produs nou" backHref="/admin/produse" />
      {categories.length === 0 ? (
        <p className="max-w-xl text-sm text-muted">
          Înainte de un produs, adaugă o categorie activă în{" "}
          <Link href="/admin/categorii" className="text-accent underline-offset-4 hover:underline">
            Categorii
          </Link>
          .
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
