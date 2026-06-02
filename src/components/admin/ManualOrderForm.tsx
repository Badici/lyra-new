"use client";

import { useState } from "react";

type ProductRow = {
  slug: string;
  name: string;
  basePriceRon: number;
};

type ManualLine = {
  productSlug: string;
  name: string;
  priceValueRon: number;
  quantity: number;
};

export function ManualOrderForm({ products }: { products: ProductRow[] }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [line, setLine] = useState<ManualLine>({
    productSlug: products[0]?.slug ?? "",
    name: products[0]?.name ?? "",
    priceValueRon: products[0]?.basePriceRon ?? 0,
    quantity: 1,
  });
  const [items, setItems] = useState<ManualLine[]>([]);

  return (
    <form
      className="space-y-4 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        const formData = new FormData(event.currentTarget);
        const payload = {
          fullName: String(formData.get("fullName") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          county: String(formData.get("county") ?? ""),
          city: String(formData.get("city") ?? ""),
          street: String(formData.get("street") ?? ""),
          postalCode: String(formData.get("postalCode") ?? ""),
          deliveryMethod: String(formData.get("deliveryMethod") ?? "COURIER"),
          deliveryCostRon: Number(formData.get("deliveryCostRon") ?? 0),
          items,
        };

        const response = await fetch("/api/admin/orders/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setLoading(false);
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          setStatus(body.error ?? "Eroare la creare comandă.");
          return;
        }
        setItems([]);
        setStatus("Comandă manuală adăugată cu succes.");
      }}
    >
      <h1 className="text-2xl font-semibold text-[var(--cream)]">Comandă manuală</h1>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="fullName"
          required
          placeholder="Nume complet"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          name="phone"
          required
          placeholder="Telefon"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          name="email"
          required
          type="email"
          placeholder="Email"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          name="county"
          required
          placeholder="Județ"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          name="city"
          required
          placeholder="Localitate"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          name="postalCode"
          required
          placeholder="Cod poștal"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
      </div>
      <input
        name="street"
        required
        placeholder="Adresă completă"
        className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <select
          name="deliveryMethod"
          defaultValue="COURIER"
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        >
          <option value="COURIER">Curier</option>
          <option value="EASYBOX">Easybox</option>
          <option value="PICKUP">Ridicare</option>
        </select>
        <input
          name="deliveryCostRon"
          type="number"
          step="0.01"
          defaultValue={30}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
      </div>

      <section className="rounded-xl border border-white/10 bg-black/10 p-4">
        <p className="text-sm font-semibold text-[var(--cream)]">Produse comandă</p>
        <div className="mt-2 grid gap-2 md:grid-cols-4">
          <select
            value={line.productSlug}
            onChange={(event) => {
              const selected = products.find((product) => product.slug === event.target.value);
              setLine((current) => ({
                ...current,
                productSlug: event.target.value,
                name: selected?.name ?? current.name,
                priceValueRon: selected?.basePriceRon ?? current.priceValueRon,
              }));
            }}
            className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            value={line.priceValueRon}
            onChange={(event) =>
              setLine((current) => ({
                ...current,
                priceValueRon: Number(event.target.value),
              }))
            }
            className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
          <input
            type="number"
            min={1}
            value={line.quantity}
            onChange={(event) =>
              setLine((current) => ({
                ...current,
                quantity: Number(event.target.value),
              }))
            }
            className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          />
          <button
            type="button"
            onClick={() => setItems((current) => [...current, line])}
            className="rounded-lg border border-[var(--accent)]/40 px-3 py-2 text-sm font-semibold text-[var(--accent-light)] hover:bg-[var(--accent)]/10"
          >
            Adaugă produs
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--muted)]">Niciun produs adăugat încă.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {items.map((item, index) => (
              <li key={`${item.productSlug}-${index}`} className="text-sm text-[var(--muted)]">
                {item.name} x{item.quantity} · {(item.priceValueRon * item.quantity).toFixed(2)}{" "}
                RON
              </li>
            ))}
          </ul>
        )}
      </section>

      {status ? <p className="text-sm text-[var(--accent-light)]">{status}</p> : null}

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Se salvează..." : "Salvează comandă manuală"}
      </button>
    </form>
  );
}
