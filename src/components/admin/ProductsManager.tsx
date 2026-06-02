"use client";

import { useState } from "react";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  basePriceRon: number;
  priceLabel: string;
  displayOrder: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
};

type RecipeRow = {
  id: string;
  name: string;
  laborType: "FIXED" | "PERCENT";
  laborValue: number;
};

type MaterialCategoryRow = {
  id: string;
  name: string;
};

type MaterialRow = {
  id: string;
  name: string;
  unitCostRon: number;
  categoryId: string | null;
};

type ConfigurableField = {
  id: string;
  label: string;
  categoryId: string;
};

const DEFAULT_FORM = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  images: [] as string[],
  basePriceRon: 0,
  priceLabel: "",
  pricingMode: "MANUAL" as "MANUAL" | "AUTO",
  recipeId: "",
  displayOrder: 100,
  status: "ACTIVE",
};

export function ProductsManager({
  initialProducts,
  recipes,
  materialCategories,
  materials,
}: {
  initialProducts: ProductRow[];
  recipes: RecipeRow[];
  materialCategories: MaterialCategoryRow[];
  materials: MaterialRow[];
}) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<{
    slug: string;
    name: string;
    basePriceRon: number;
    displayOrder: number;
    status: ProductRow["status"];
  } | null>(null);
  const [configurableFields, setConfigurableFields] = useState<ConfigurableField[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/products");
    if (!response.ok) {
      setError("Nu am putut încărca produsele.");
      return;
    }
    const rows = (await response.json()) as ProductRow[];
    setProducts(rows);
  };

  return (
    <div className="space-y-5">
      <form
        className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const payload = {
            slug: form.slug,
            name: form.name,
            shortDescription: form.shortDescription,
            description: form.description,
            specs: [],
            images: form.images,
            basePriceRon: Number(form.basePriceRon),
            priceLabel:
              form.pricingMode === "AUTO"
                ? "Preț calculat automat"
                : form.priceLabel || `${Number(form.basePriceRon).toFixed(2)} RON`,
            pricingMode: form.pricingMode,
            recipeId: form.recipeId || undefined,
            isConfigurable:
              form.pricingMode === "AUTO" && configurableFields.length > 0,
            pricingConfigJson:
              form.pricingMode === "AUTO" && configurableFields.length > 0
                ? {
                    options: configurableFields
                      .map((field) => {
                        const choices = materials
                          .filter((material) => material.categoryId === field.categoryId)
                          .map((material) => ({
                            value: material.id,
                            label: material.name,
                            costRon: material.unitCostRon,
                          }));
                        if (choices.length === 0) {
                          return null;
                        }
                        return {
                          id: field.id,
                          label: field.label,
                          placeholder: `Alege ${field.label.toLowerCase()}`,
                          choices,
                        };
                      })
                      .filter(Boolean),
                    markupPercent: 0,
                  }
                : undefined,
            displayOrder: Number(form.displayOrder),
            status: form.status,
          };
          const response = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut crea produsul.");
            return;
          }
          setForm({ ...DEFAULT_FORM });
          setConfigurableFields([]);
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Adaugă produs
        </h2>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Slug produs
          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(event) => setForm((v) => ({ ...v, slug: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Nume produs
          <input
            placeholder="Nume"
            value={form.name}
            onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="md:col-span-2 space-y-1 text-xs text-[var(--muted)]">
          Descriere scurtă
          <textarea
            placeholder="Descriere scurtă"
            value={form.shortDescription}
            onChange={(event) =>
              setForm((v) => ({ ...v, shortDescription: event.target.value }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="md:col-span-2 space-y-1 text-xs text-[var(--muted)]">
          Descriere completă
          <textarea
            placeholder="Descriere completă"
            value={form.description}
            onChange={(event) => setForm((v) => ({ ...v, description: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <div className="md:col-span-2 space-y-2 rounded-lg border border-white/10 bg-black/10 p-3">
          <p className="text-sm font-semibold text-[var(--cream)]">Imagini produs</p>
          <label className="inline-flex cursor-pointer rounded-lg border border-white/20 px-3 py-2 text-xs text-[var(--muted)] hover:bg-white/5">
            Upload imagine
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                setUploading(true);
                setError("");
                const body = new FormData();
                body.append("file", file);
                const response = await fetch("/api/admin/upload", {
                  method: "POST",
                  body,
                });
                setUploading(false);
                if (!response.ok) {
                  const result = (await response.json()) as { error?: string };
                  setError(result.error ?? "Upload eșuat.");
                  return;
                }
                const result = (await response.json()) as { url: string };
                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, result.url],
                }));
              }}
            />
          </label>
          {uploading ? <p className="text-xs text-[var(--muted)]">Se încarcă...</p> : null}
          <ul className="space-y-1 text-xs text-[var(--muted)]">
            {form.images.map((image) => (
              <li key={image} className="flex items-center justify-between gap-2">
                <span className="truncate">{image}</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((entry) => entry !== image),
                    }))
                  }
                  className="text-red-300 hover:underline"
                >
                  Elimină
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]">
          <p className="mb-2 text-xs text-[var(--muted)]">Mod preț</p>
          <label className="mr-4 inline-flex items-center gap-2">
            <input
              type="radio"
              checked={form.pricingMode === "MANUAL"}
              onChange={() => setForm((prev) => ({ ...prev, pricingMode: "MANUAL" }))}
            />
            Manual
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              checked={form.pricingMode === "AUTO"}
              onChange={() => setForm((prev) => ({ ...prev, pricingMode: "AUTO" }))}
            />
            Calculat automat
          </label>
        </div>
        {form.pricingMode === "MANUAL" ? (
          <>
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Preț bază (RON)
              <input
                type="number"
                step="0.01"
                placeholder="Preț bază RON"
                value={form.basePriceRon}
                onChange={(event) =>
                  setForm((v) => ({ ...v, basePriceRon: Number(event.target.value) }))
                }
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              />
            </label>
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Label preț afișat
              <input
                placeholder="Label preț"
                value={form.priceLabel}
                onChange={(event) => setForm((v) => ({ ...v, priceLabel: event.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              />
            </label>
          </>
        ) : (
          <>
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Rețetă asociată (opțional)
              <select
                value={form.recipeId}
                onChange={(event) => setForm((v) => ({ ...v, recipeId: event.target.value }))}
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              >
                <option value="">Alege rețeta (opțional)</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name} · {recipe.laborType === "FIXED" ? `${recipe.laborValue} RON` : `${recipe.laborValue}%`}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-xs text-[var(--muted)]">
              Prețul final se calculează automat din materii prime selectate + manoperă rețetă.
            </div>
          </>
        )}
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Ordine afișare în catalog
          <input
            type="number"
            placeholder="Ordine afișare"
            value={form.displayOrder}
            onChange={(event) =>
              setForm((v) => ({ ...v, displayOrder: Number(event.target.value) }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Status produs
          <select
            value={form.status}
            onChange={(event) =>
              setForm((v) => ({
                ...v,
                status: event.target.value as ProductRow["status"],
              }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          >
            <option value="ACTIVE">Activ</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Arhivat</option>
          </select>
        </label>
        {form.pricingMode === "AUTO" ? (
          <div className="md:col-span-2 space-y-2 rounded-lg border border-white/10 bg-black/10 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--cream)]">
                Câmpuri customizabile (din materii prime pe categorii)
              </p>
              <button
                type="button"
                onClick={() =>
                  setConfigurableFields((prev) => [
                    ...prev,
                    {
                      id: `field-${Date.now()}`,
                      label: "Opțiune",
                      categoryId: materialCategories[0]?.id ?? "",
                    },
                  ])
                }
                className="rounded-lg border border-[var(--accent)]/40 px-3 py-1 text-xs text-[var(--accent-light)] hover:bg-[var(--accent)]/10"
              >
                Adaugă câmp
              </button>
            </div>
            {configurableFields.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">
                Nu ai adăugat câmpuri. Exemplu: Fir montură, Plumb bag, Mărime cârlig.
              </p>
            ) : (
              configurableFields.map((field) => (
                <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <label className="space-y-1 text-xs text-[var(--muted)]">
                    Label câmp configurabil
                    <input
                      value={field.label}
                      onChange={(event) =>
                        setConfigurableFields((prev) =>
                          prev.map((entry) =>
                            entry.id === field.id
                              ? { ...entry, label: event.target.value }
                              : entry
                          )
                        )
                      }
                      placeholder="Label câmp"
                      className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-[var(--muted)]">
                    Categorie materii prime
                    <select
                      value={field.categoryId}
                      onChange={(event) =>
                        setConfigurableFields((prev) =>
                          prev.map((entry) =>
                            entry.id === field.id
                              ? { ...entry, categoryId: event.target.value }
                              : entry
                          )
                        )
                      }
                      className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
                    >
                      {materialCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setConfigurableFields((prev) =>
                        prev.filter((entry) => entry.id !== field.id)
                      )
                    }
                    className="rounded-lg border border-red-500/50 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Șterge
                  </button>
                </div>
              ))
            )}
          </div>
        ) : null}
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează produs
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Produse existente</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)]">
                <th className="p-2">Nume</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Preț bază</th>
                <th className="p-2">Ordine</th>
                <th className="p-2">Status</th>
                <th className="p-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-white/10 text-[var(--cream)]">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 text-[var(--muted)]">{product.slug}</td>
                  <td className="p-2">{product.basePriceRon.toFixed(2)} RON</td>
                  <td className="p-2">{product.displayOrder}</td>
                  <td className="p-2">{product.status}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(product.id);
                          setEditingRow({
                            slug: product.slug,
                            name: product.name,
                            basePriceRon: product.basePriceRon,
                            displayOrder: product.displayOrder,
                            status: product.status,
                          });
                        }}
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs text-[var(--cream)] hover:bg-white/5"
                      >
                        Editează
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = window.confirm(
                            `Ștergi produsul "${product.name}"?`
                          );
                          if (!ok) {
                            return;
                          }
                          const response = await fetch(
                            `/api/admin/products/${product.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (!response.ok) {
                            const body = (await response.json()) as { error?: string };
                            setError(body.error ?? "Nu am putut șterge produsul.");
                            return;
                          }
                          await load();
                        }}
                        className="rounded-lg border border-red-500/50 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingId && editingRow ? (
        <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
          <h3 className="text-lg font-semibold text-[var(--cream)]">Editează produs</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              value={editingRow.slug}
              onChange={(event) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, slug: event.target.value } : prev
                )
              }
              className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            />
            <input
              value={editingRow.name}
              onChange={(event) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, name: event.target.value } : prev
                )
              }
              className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            />
            <input
              type="number"
              step="0.01"
              value={editingRow.basePriceRon}
              onChange={(event) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, basePriceRon: Number(event.target.value) } : prev
                )
              }
              className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            />
            <input
              type="number"
              value={editingRow.displayOrder}
              onChange={(event) =>
                setEditingRow((prev) =>
                  prev ? { ...prev, displayOrder: Number(event.target.value) } : prev
                )
              }
              className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            />
            <select
              value={editingRow.status}
              onChange={(event) =>
                setEditingRow((prev) =>
                  prev
                    ? {
                        ...prev,
                        status: event.target.value as ProductRow["status"],
                      }
                    : prev
                )
              }
              className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            >
              <option value="ACTIVE">Activ</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Arhivat</option>
            </select>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!editingRow) {
                  return;
                }
                const response = await fetch(`/api/admin/products/${editingId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(editingRow),
                });
                if (!response.ok) {
                  const body = (await response.json()) as { error?: string };
                  setError(body.error ?? "Nu am putut actualiza produsul.");
                  return;
                }
                setEditingId(null);
                setEditingRow(null);
                await load();
              }}
              className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-light)]"
            >
              Salvează modificările
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditingRow(null);
              }}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-[var(--cream)] hover:bg-white/5"
            >
              Renunță
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
