"use client";

import { useState } from "react";

type MaterialRow = {
  id: string;
  name: string;
  unitCostRon: number;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  active: boolean;
};

type MaterialCategoryRow = {
  id: string;
  name: string;
  description: string | null;
};

export function MaterialsManager({
  initialRows,
  initialCategories,
}: {
  initialRows: MaterialRow[];
  initialCategories: MaterialCategoryRow[];
}) {
  const [rows, setRows] = useState<MaterialRow[]>(initialRows);
  const [categories, setCategories] = useState<MaterialCategoryRow[]>(initialCategories);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<{
    name: string;
    unitCostRon: number;
    categoryId: string;
    active: boolean;
  } | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [form, setForm] = useState({
    name: "",
    unitCostRon: 0,
    categoryId: "",
  });

  const load = async () => {
    const response = await fetch("/api/admin/materials");
    if (!response.ok) {
      setError("Nu am putut încărca materiile prime.");
      return;
    }
    setRows((await response.json()) as MaterialRow[]);
  };

  const loadCategories = async () => {
    const response = await fetch("/api/admin/material-categories");
    if (!response.ok) {
      return;
    }
    setCategories((await response.json()) as MaterialCategoryRow[]);
  };

  return (
    <div className="space-y-4">
      <form
        className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const response = await fetch("/api/admin/materials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              unitCostRon: Number(form.unitCostRon),
              categoryId: form.categoryId || undefined,
            }),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut salva.");
            return;
          }
          setForm({ name: "", unitCostRon: 0, categoryId: "" });
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Adaugă materie primă
        </h2>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Nume material
          <input
            placeholder="Nume"
            value={form.name}
            onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Cost per unitate (RON)
          <input
            type="number"
            step="0.01"
            placeholder="Cost/unitate RON"
            value={form.unitCostRon}
            onChange={(event) =>
              setForm((v) => ({ ...v, unitCostRon: Number(event.target.value) }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Categorie material (opțional)
          <select
            value={form.categoryId}
            onChange={(event) => setForm((v) => ({ ...v, categoryId: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          >
            <option value="">Fără categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează
        </button>
      </form>

      <form
        className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const response = await fetch("/api/admin/material-categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryForm),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut salva categoria.");
            return;
          }
          setCategoryForm({ name: "", description: "" });
          await loadCategories();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Categorii materii prime
        </h2>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Nume categorie
          <input
            placeholder="Nume categorie"
            value={categoryForm.name}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <label className="space-y-1 text-xs text-[var(--muted)]">
          Descriere categorie (opțional)
          <input
            placeholder="Descriere (opțional)"
            value={categoryForm.description}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
        </label>
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează categoria
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Materii prime existente</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="rounded-full border border-white/20 px-2 py-1 text-xs text-[var(--muted)]"
            >
              {category.name}
            </span>
          ))}
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
              <p className="font-medium text-[var(--cream)]">{row.name}</p>
              <p className="text-sm text-[var(--muted)]">
                Cost: {row.unitCostRon.toFixed(2)} RON
              </p>
              <p className="text-xs text-[var(--muted)]">
                Categorie: {row.category?.name ?? "fără categorie"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(row.id);
                    setEditingRow({
                      name: row.name,
                      unitCostRon: row.unitCostRon,
                      categoryId: row.categoryId ?? "",
                      active: row.active,
                    });
                  }}
                  className="rounded-lg border border-white/20 px-3 py-1 text-xs text-[var(--cream)] hover:bg-white/5"
                >
                  Editează
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = window.confirm(`Ștergi materia primă "${row.name}"?`);
                    if (!ok) {
                      return;
                    }
                    const response = await fetch(`/api/admin/materials/${row.id}`, {
                      method: "DELETE",
                    });
                    if (!response.ok) {
                      const body = (await response.json()) as { error?: string };
                      setError(body.error ?? "Nu am putut șterge materia primă.");
                      return;
                    }
                    await load();
                  }}
                  className="rounded-lg border border-red-500/50 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
                >
                  Șterge
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {editingId && editingRow ? (
        <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
          <h3 className="text-lg font-semibold text-[var(--cream)]">Editează materie primă</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Nume material
              <input
                value={editingRow.name}
                onChange={(event) =>
                  setEditingRow((prev) =>
                    prev ? { ...prev, name: event.target.value } : prev
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              />
            </label>
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Cost material (RON)
              <input
                type="number"
                step="0.01"
                value={editingRow.unitCostRon}
                onChange={(event) =>
                  setEditingRow((prev) =>
                    prev ? { ...prev, unitCostRon: Number(event.target.value) } : prev
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              />
            </label>
            <label className="space-y-1 text-xs text-[var(--muted)]">
              Categorie material (opțional)
              <select
                value={editingRow.categoryId}
                onChange={(event) =>
                  setEditingRow((prev) =>
                    prev ? { ...prev, categoryId: event.target.value } : prev
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
              >
                <option value="">Fără categorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={editingRow.active}
                onChange={(event) =>
                  setEditingRow((prev) =>
                    prev ? { ...prev, active: event.target.checked } : prev
                  )
                }
              />
              Material activ
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!editingRow) {
                  return;
                }
                const response = await fetch(`/api/admin/materials/${editingId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: editingRow.name,
                    unitCostRon: editingRow.unitCostRon,
                    categoryId: editingRow.categoryId || undefined,
                    active: editingRow.active,
                  }),
                });
                if (!response.ok) {
                  const body = (await response.json()) as { error?: string };
                  setError(body.error ?? "Nu am putut actualiza materia primă.");
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
