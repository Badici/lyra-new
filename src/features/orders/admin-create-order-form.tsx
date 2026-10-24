"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  createAdminOrderAction,
  type AdminCreateOrderState,
} from "@/features/orders/admin-actions";
import { formatRon } from "@/lib/money";

type ProductOption = {
  id: string;
  name: string;
  priceBani: number;
  sku: string;
};

type Line = { key: string; productId: string; quantity: number };

const initial: AdminCreateOrderState = {};

export function AdminCreateOrderForm({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const confirmed = useRef(false);
  const [state, action, pending] = useActionState(createAdminOrderAction, initial);
  useEffect(() => {
    if (!state.ok || confirmed.current) return;
    confirmed.current = true;
    toast.success(state.message ?? "Comanda a fost plasată.");
    const timer = window.setTimeout(() => router.push("/admin/comenzi"), 450);
    return () => window.clearTimeout(timer);
  }, [router, state.message, state.ok]);

  const [lines, setLines] = useState<Line[]>([
    { key: crypto.randomUUID(), productId: products[0]?.id ?? "", quantity: 1 },
  ]);

  return (
    <form action={action} className="admin-card grid max-w-3xl gap-5 p-5">
      {state.error ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2">
        <h2 className="font-display text-xl text-cream sm:col-span-2">Client</h2>
        <div>
          <label className="admin-label">Nume *</label>
          <input name="customerName" required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Email *</label>
          <input name="customerEmail" type="email" required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Telefon *</label>
          <input name="customerPhone" required className="admin-input" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <h2 className="font-display text-xl text-cream sm:col-span-2">Adresă livrare</h2>
        <div>
          <label className="admin-label">Județ *</label>
          <input name="shippingCounty" required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Localitate *</label>
          <input name="shippingCity" required className="admin-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Stradă / adresă *</label>
          <input name="shippingStreetLine" required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Cod poștal</label>
          <input name="shippingPostalCode" className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Detalii adresă</label>
          <input name="shippingDetails" className="admin-input" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-cream">Produse</h2>
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:text-cream"
            onClick={() =>
              setLines((prev) => [
                ...prev,
                {
                  key: crypto.randomUUID(),
                  productId: products[0]?.id ?? "",
                  quantity: 1,
                },
              ])
            }
          >
            + Linie
          </button>
        </div>

        {lines.map((line, index) => (
          <div key={line.key} className="grid gap-2 sm:grid-cols-[1fr_7rem_auto]">
            <select
              name="productId"
              required
              className="admin-select"
              value={line.productId}
              onChange={(e) =>
                setLines((prev) =>
                  prev.map((l, i) =>
                    i === index ? { ...l, productId: e.target.value } : l,
                  ),
                )
              }
            >
              <option value="">Alege produs</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {formatRon(p.priceBani)} · {p.sku}
                </option>
              ))}
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              max={99}
              required
              className="admin-input"
              value={line.quantity}
              onChange={(e) =>
                setLines((prev) =>
                  prev.map((l, i) =>
                    i === index
                      ? { ...l, quantity: Math.max(1, Number(e.target.value) || 1) }
                      : l,
                  ),
                )
              }
            />
            <button
              type="button"
              className="rounded-xl border border-border px-3 py-2 text-xs text-muted hover:text-cream disabled:opacity-40"
              disabled={lines.length <= 1}
              onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
            >
              Șterge
            </button>
          </div>
        ))}
      </section>

      <div>
        <label className="admin-label">Note comandă</label>
        <textarea name="notes" className="admin-textarea" rows={3} />
      </div>

      <SubmitButton
        label="Plasează comanda"
        pendingLabel="Se creează…"
        variant="accent"
        disabled={pending || Boolean(state.ok) || products.length === 0}
      />
    </form>
  );
}
