import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      pricingOverrides: {
        orderBy: { createdAt: "desc" },
      },
      recipeItems: {
        include: { material: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">{product.name}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Override-uri de preț și rețete configurate pentru produs.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h2 className="text-lg font-semibold text-[var(--cream)]">Override-uri preț</h2>
        {product.pricingOverrides.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Niciun override activ.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {product.pricingOverrides.map((entry) => (
              <li key={entry.id} className="text-sm text-[var(--cream)]">
                {entry.overrideRon.toFixed(2)} RON · {entry.active ? "activ" : "inactiv"} ·{" "}
                {entry.reason ?? "fără motiv"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h2 className="text-lg font-semibold text-[var(--cream)]">Rețetă materii prime</h2>
        {product.recipeItems.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Nu există rețetă definită.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {product.recipeItems.map((entry) => (
              <li key={entry.id} className="text-sm text-[var(--cream)]">
                {entry.material.name}: {entry.qty} {entry.material.unit} (pierderi {entry.wastePct}
                %)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
