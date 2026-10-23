import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountForm } from "@/features/auth/account-form";
import { getSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Cont",
  description: "Autentificare și înregistrare cont LyraBaits.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ContPage() {
  let session: Awaited<ReturnType<typeof getSession>> = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("[cont]", error);
  }

  return (
    <div className="section-lyra">
      <div className="container-lyra">
        <p className="font-hand mb-2 text-2xl text-accent">Cont</p>
        <h1 className="mb-2 font-display text-5xl tracking-wide">
          {session ? `Salut, ${session.user.name}` : "Autentificare"}
        </h1>
        <p className="mb-8 text-muted">
          {session
            ? "Ești autentificat. Poți plasa comenzi asociate contului tău."
            : "Creează un cont sau autentifică-te pentru comenzi viitoare."}
        </p>

        <Suspense fallback={<p className="text-muted">Se încarcă…</p>}>
          <AccountForm />
        </Suspense>
      </div>
    </div>
  );
}
