"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hasError = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("error"));
  }, []);

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6">
        <h1 className="text-2xl font-semibold text-[var(--cream)]">Autentificare</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Intră în cont pentru istoricul comenzilor și checkout rapid.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const result = await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirect: false,
            });
            setLoading(false);
            if (result?.error) {
              router.push("/cont/login?error=credentials");
              return;
            }
            router.push("/cont");
            router.refresh();
          }}
        >
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
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
          >
            {loading ? "Se autentifică..." : "Intră în cont"}
          </button>
        </form>
        {hasError ? (
          <p className="mt-3 text-sm text-red-300">Datele de autentificare nu sunt valide.</p>
        ) : null}

        <p className="mt-4 text-sm text-[var(--muted)]">
          Nu ai cont?{" "}
          <Link href="/cont/inregistrare" className="text-[var(--accent-light)] hover:underline">
            Creează cont
          </Link>
        </p>
      </div>
    </main>
  );
}
