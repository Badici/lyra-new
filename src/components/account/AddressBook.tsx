"use client";

import { useState } from "react";

type AddressRow = {
  id: string;
  label: string | null;
  isDefault: boolean;
  fullName: string;
  phone: string;
  email: string;
  county: string;
  city: string;
  street: string;
  postalCode: string;
};

const EMPTY_FORM = {
  label: "",
  fullName: "",
  phone: "",
  email: "",
  county: "",
  city: "",
  street: "",
  postalCode: "",
  isDefault: false,
};

export function AddressBook({ initialAddresses }: { initialAddresses: AddressRow[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [feedback, setFeedback] = useState("");

  const load = async () => {
    const response = await fetch("/api/account/addresses");
    if (!response.ok) {
      return;
    }
    setAddresses((await response.json()) as AddressRow[]);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6">
      <h2 className="text-xl font-semibold text-[var(--cream)]">Adrese de livrare salvate</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Adresa marcată implicit va fi precompletată în checkout.
      </p>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setFeedback("");
          const response = await fetch("/api/account/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setFeedback(body.error ?? "Nu am putut salva adresa.");
            return;
          }
          setForm({ ...EMPTY_FORM });
          setFeedback("Adresa a fost salvată.");
          await load();
        }}
      >
        <input
          placeholder="Etichetă (ex: Acasă)"
          value={form.label}
          onChange={(event) => setForm((v) => ({ ...v, label: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          placeholder="Nume complet"
          value={form.fullName}
          onChange={(event) => setForm((v) => ({ ...v, fullName: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Telefon"
          value={form.phone}
          onChange={(event) => setForm((v) => ({ ...v, phone: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((v) => ({ ...v, email: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Județ"
          value={form.county}
          onChange={(event) => setForm((v) => ({ ...v, county: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Localitate"
          value={form.city}
          onChange={(event) => setForm((v) => ({ ...v, city: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Adresă completă"
          value={form.street}
          onChange={(event) => setForm((v) => ({ ...v, street: event.target.value }))}
          className="md:col-span-2 rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <input
          placeholder="Cod poștal"
          value={form.postalCode}
          onChange={(event) => setForm((v) => ({ ...v, postalCode: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
          required
        />
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => setForm((v) => ({ ...v, isDefault: event.target.checked }))}
          />
          Setează ca adresă implicită
        </label>

        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează adresa
        </button>
      </form>

      {feedback ? <p className="mt-3 text-sm text-[var(--accent-light)]">{feedback}</p> : null}

      <ul className="mt-4 space-y-2">
        {addresses.map((address) => (
          <li key={address.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
            <p className="font-medium text-[var(--cream)]">
              {address.label || "Adresă salvată"} {address.isDefault ? "(implicită)" : ""}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {address.fullName} · {address.phone}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {address.street}, {address.city}, {address.county}, {address.postalCode}
            </p>
            {!address.isDefault ? (
              <button
                type="button"
                className="mt-2 text-xs text-[var(--accent-light)] hover:underline"
                onClick={async () => {
                  await fetch("/api/account/addresses", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: address.id, isDefault: true }),
                  });
                  await load();
                }}
              >
                Setează implicită
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
