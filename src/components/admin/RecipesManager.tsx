"use client";

import { useState } from "react";

type MaterialRow = {
  id: string;
  name: string;
  unit: string;
  category?: { id: string; name: string } | null;
};
type MaterialCategoryRow = { id: string; name: string };
type RecipeRow = {
  id: string;
  name: string;
  laborType: "FIXED" | "PERCENT";
  laborValue: number;
  items: Array<{
    id: string;
    qty: number;
    material: { name: string; unit: string; category?: { name: string } | null } | null;
    materialCategory:
      | {
          id: string;
          name: string;
          materials: Array<{ id: string; name: string; unitCostRon: number }>;
        }
      | null;
  }>;
  products: Array<{ id: string; name: string }>;
};

export function RecipesManager({
  materials,
  materialCategories,
  initialRows,
}: {
  materials: MaterialRow[];
  materialCategories: MaterialCategoryRow[];
  initialRows: RecipeRow[];
}) {
  const [rows, setRows] = useState<RecipeRow[]>(initialRows);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    laborType: "FIXED" as "FIXED" | "PERCENT",
    laborValue: 0,
    items: [] as Array<{ kind: "material" | "category"; id: string; qty: number }>,
  });

  const load = async () => {
    const response = await fetch("/api/admin/recipes");
    if (!response.ok) {
      setError("Nu am putut încărca rețetele.");
      return;
    }
    const payload = (await response.json()) as { recipes: RecipeRow[] };
    setRows(payload.recipes);
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
              laborValue: Number(form.laborValue),
              items: form.items.map((item) => ({
                kind: item.kind,
                id: item.id,
                qty: Number(item.qty),
              })),
            }),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut salva rețeta.");
            return;
          }
          setForm({
            name: "",
            laborType: "FIXED",
            laborValue: 0,
            items: [],
          });
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">Definește rețetă</h2>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Nume rețetă
          <input
            value={form.name}
            onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))}
            placeholder="Nume rețetă (ex: Pungă PVA)"
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Tip manoperă
          <select
            value={form.laborType}
            onChange={(event) =>
              setForm((v) => ({ ...v, laborType: event.target.value as "FIXED" | "PERCENT" }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          >
            <option value="FIXED">Manoperă fixă</option>
            <option value="PERCENT">Manoperă procent din materiale</option>
          </select>
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Valoare manoperă ({form.laborType === "FIXED" ? "RON" : "%"})
          <input
            type="number"
            step="0.01"
            value={form.laborValue}
            onChange={(event) =>
              setForm((v) => ({ ...v, laborValue: Number(event.target.value) }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
            placeholder={form.laborType === "FIXED" ? "Manoperă (RON)" : "Manoperă (%)"}
          />
        </label>

        <div className="md:col-span-2 space-y-2 rounded-lg border border-white/10 bg-black/10 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--cream)]">Materiale în rețetă</p>
            <button
              type="button"
              onClick={() =>
                setForm((v) => ({
                  ...v,
                  items: [
                    ...v.items,
                    { kind: "material", id: materials[0]?.id ?? "", qty: 1 },
                  ],
                }))
              }
              className="rounded-lg border border-[var(--accent)]/40 px-3 py-1 text-xs text-[var(--accent-light)] hover:bg-[var(--accent)]/10"
            >
              Adaugă intrare
            </button>
          </div>
          {form.items.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">
              Nu ai adăugat materiale sau categorii încă.
            </p>
          ) : (
            form.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="grid gap-2 md:grid-cols-[140px_1fr_120px_auto]">
                <label className="space-y-1 text-xs text-[var(--muted)]">
                  Tip intrare
                  <select
                    value={item.kind}
                    onChange={(event) =>
                      setForm((v) => ({
                        ...v,
                        items: v.items.map((entry, entryIndex) =>
                          entryIndex === index
                            ? {
                                ...entry,
                                kind: event.target.value as "material" | "category",
                                id:
                                  event.target.value === "material"
                                    ? materials[0]?.id ?? ""
                                    : materialCategories[0]?.id ?? "",
                              }
                            : entry
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
                  >
                    <option value="material">Material</option>
                    <option value="category">Categorie</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs text-[var(--muted)]">
                  {item.kind === "material" ? "Material" : "Categorie material"}
                  <select
                    value={item.id}
                    onChange={(event) =>
                      setForm((v) => ({
                        ...v,
                        items: v.items.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, id: event.target.value }
                            : entry
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
                  >
                    {item.kind === "material"
                      ? materials.map((material) => (
                          <option key={material.id} value={material.id}>
                            {material.category?.name ? `${material.category.name}: ` : ""}
                            {material.name}
                          </option>
                        ))
                      : materialCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                  </select>
                </label>
                <label className="space-y-1 text-xs text-[var(--muted)]">
                  Cantitate
                  <input
                    type="number"
                    step="0.01"
                    value={item.qty}
                    onChange={(event) =>
                      setForm((v) => ({
                        ...v,
                        items: v.items.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, qty: Number(event.target.value) }
                            : entry
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((v) => ({
                      ...v,
                      items: v.items.filter((_, entryIndex) => entryIndex !== index),
                    }))
                  }
                  className="rounded-lg border border-red-500/50 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                >
                  Șterge
                </button>
              </div>
            ))
          )}
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează rețeta
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Rețete definite</h3>
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
              <p className="font-medium text-[var(--cream)]">{row.name}</p>
              <p className="text-sm text-[var(--muted)]">
                Manoperă:{" "}
                {row.laborType === "FIXED"
                  ? `${row.laborValue.toFixed(2)} RON`
                  : `${row.laborValue.toFixed(2)}% din materiale`}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                {row.items.map((item) => (
                  <li key={item.id}>
                    {item.material
                      ? `${item.material.category?.name ? `${item.material.category.name}: ` : ""}${item.material.name} · ${item.qty} ${item.material.unit}`
                      : `${item.materialCategory?.name ?? "Categorie"} (dropdown configurare) · ${item.qty}x material selectat`}
                  </li>
                ))}
              </ul>
              {row.products.length > 0 ? (
                <p className="mt-2 text-xs text-[var(--accent-light)]">
                  Folosită de: {row.products.map((product) => product.name).join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
