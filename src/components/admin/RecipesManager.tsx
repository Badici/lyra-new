"use client";

import { useState } from "react";

type ProductRow = { id: string; name: string };
type MaterialRow = { id: string; name: string; unit: string };
type RecipeRow = {
  id: string;
  qty: number;
  wastePct: number;
  product: { name: string };
  material: { name: string; unit: string };
};

export function RecipesManager({
  products,
  materials,
  initialRows,
}: {
  products: ProductRow[];
  materials: MaterialRow[];
  initialRows: RecipeRow[];
}) {
  const [rows, setRows] = useState<RecipeRow[]>(initialRows);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    productId: products[0]?.id ?? "",
    materialId: materials[0]?.id ?? "",
    qty: 1,
    wastePct: 0,
  });

  const load = async () => {
    const response = await fetch("/api/admin/recipes");
    if (!response.ok) {
      setError("Nu am putut încărca rețetele.");
      return;
    }
    setRows((await response.json()) as RecipeRow[]);
  };

  return (
    <div className="space-y-4">
      <form
        className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const response = await fetch("/api/admin/recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              qty: Number(form.qty),
              wastePct: Number(form.wastePct),
            }),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut salva rețeta.");
            return;
          }
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Adaugă/actualizează ingredient în rețetă
        </h2>
        <select
          value={form.productId}
          onChange={(event) => setForm((v) => ({ ...v, productId: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <select
          value={form.materialId}
          onChange={(event) => setForm((v) => ({ ...v, materialId: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        >
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          value={form.qty}
          onChange={(event) => setForm((v) => ({ ...v, qty: Number(event.target.value) }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          placeholder="Cantitate"
        />
        <input
          type="number"
          step="0.1"
          value={form.wastePct}
          onChange={(event) =>
            setForm((v) => ({ ...v, wastePct: Number(event.target.value) }))
          }
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          placeholder="Pierderi %"
        />
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează în rețetă
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Ingrediente definite</h3>
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
              <p className="font-medium text-[var(--cream)]">
                {row.product.name} → {row.material.name}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {row.qty} {row.material.unit} · pierderi {row.wastePct}%
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
