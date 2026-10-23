import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { ImageField } from "@/components/admin/image-field";
import { deleteCategory, upsertCategory } from "@/features/categories/admin-actions";
import { getAdminCategories } from "@/features/categories/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageHeader
        title="Categorii"
        description="CRUD categorii. Ștergerea este blocată dacă există produse."
      />

      <form action={upsertCategory} className="admin-card grid max-w-2xl gap-3 p-5">
        <h2 className="font-display text-2xl">Categorie nouă</h2>
        <ImageField name="imageKey" label="Imagine categorie" />
        <input name="name" required placeholder="Nume" className="admin-input" />
        <input name="slug" placeholder="Slug (opțional)" className="admin-input" />
        <textarea name="shortDescription" placeholder="Descriere scurtă" className="admin-textarea" />
        <input name="sortOrder" type="number" defaultValue={0} className="admin-input" />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked />
          Activă
        </label>
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
          Adaugă
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card p-5">
            <form action={upsertCategory} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={cat.id} />
              <div className="md:col-span-2">
                <ImageField
                  name="imageKey"
                  label="Imagine categorie"
                  defaultValue={cat.imageKey}
                />
              </div>
              <input name="name" defaultValue={cat.name} className="admin-input" required />
              <input name="slug" defaultValue={cat.slug} className="admin-input" />
              <textarea
                name="shortDescription"
                defaultValue={cat.shortDescription ?? ""}
                className="admin-textarea md:col-span-2"
              />
              <input
                name="sortOrder"
                type="number"
                defaultValue={cat.sortOrder}
                className="admin-input"
              />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={cat.isActive} />
                Activă · {cat.productCount} produse
              </label>
              <button type="submit" className="rounded-xl bg-moss px-4 py-2 text-sm text-cream">
                Salvează
              </button>
            </form>
            {cat.productCount === 0 ? (
              <div className="mt-3">
                <ConfirmDeleteForm
                  action={deleteCategory}
                  hiddenFields={{ id: cat.id }}
                  confirmMessage="Ștergi categoria?"
                />
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted">
                Nu poate fi ștearsă cât timp are produse asociate.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
