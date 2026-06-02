"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6">
        <h1 className="text-2xl font-semibold text-[var(--cream)]">Creează cont</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Contul îți păstrează istoricul comenzilor și datele de livrare.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const payload = {
              name: String(formData.get("name") ?? ""),
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
              phone: String(formData.get("phone") ?? ""),
            };
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            setLoading(false);
            if (!response.ok) {
              const body = (await response.json()) as { error?: string };
              setError(body.error ?? "Nu am putut crea contul.");
              return;
            }
            router.push("/cont/login");
          }}
        >
          <label className="block text-sm text-[var(--muted)]">
            Nume complet
            <input
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
            />
          </label>
          <label className="block text-sm text-[var(--muted)]">
            Telefon
            <input
              name="phone"
              type="tel"
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
            />
          </label>
          <label className="block text-sm text-[var(--muted)]">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
            />
          </label>
          <label className="block text-sm text-[var(--muted)]">
            Parolă
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
            />
          </label>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Ai deja cont?{" "}
          <Link href="/cont/login" className="text-[var(--accent-light)] hover:underline">
            Intră în cont
          </Link>
        </p>
      </div>
    </main>
  );
}
