"use client";

import { useState } from "react";

type MaterialRow = {
  id: string;
  name: string;
  unit: string;
  unitCostRon: number;
  supplier: string | null;
  active: boolean;
};

export function MaterialsManager({ initialRows }: { initialRows: MaterialRow[] }) {
  const [rows, setRows] = useState<MaterialRow[]>(initialRows);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    unit: "buc",
    unitCostRon: 0,
    supplier: "",
  });

  const load = async () => {
    const response = await fetch("/api/admin/materials");
    if (!response.ok) {
      setError("Nu am putut încărca materiile prime.");
      return;
    }
    setRows((await response.json()) as MaterialRow[]);
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
            }),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut salva.");
            return;
          }
          setForm({ name: "", unit: "buc", unitCostRon: 0, supplier: "" });
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Adaugă materie primă
        </h2>
        <input
          placeholder="Nume"
          value={form.name}
          onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          placeholder="Unitate (buc, kg, m)"
          value={form.unit}
          onChange={(event) => setForm((v) => ({ ...v, unit: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Cost/unitate RON"
          value={form.unitCostRon}
          onChange={(event) =>
            setForm((v) => ({ ...v, unitCostRon: Number(event.target.value) }))
          }
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          placeholder="Furnizor"
          value={form.supplier}
          onChange={(event) => setForm((v) => ({ ...v, supplier: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Materii prime existente</h3>
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
              <p className="font-medium text-[var(--cream)]">{row.name}</p>
              <p className="text-sm text-[var(--muted)]">
                {row.unitCostRon.toFixed(2)} RON / {row.unit} · {row.supplier ?? "Fără furnizor"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
