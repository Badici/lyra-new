import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/account/SignOutButton";
import { listOrdersForUser } from "@/lib/order-service";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/cont/login");
  }

  const orders = await listOrdersForUser(session.user.id);

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--cream)]">Contul meu</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {session.user.name} · {session.user.email}
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6">
          <h2 className="text-xl font-semibold text-[var(--cream)]">Istoric comenzi</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Nu ai comenzi încă.{" "}
              <Link href="/catalog" className="text-[var(--accent-light)] hover:underline">
                Vezi catalogul
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <p className="font-semibold text-[var(--cream)]">
                    #{order.number} · {order.status}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleString("ro-RO")} ·{" "}
                    {order.totalRon.toFixed(2)} RON · {order.items.length} produse
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
