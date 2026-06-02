import { UsersManager } from "@/components/admin/UsersManager";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const initialRows = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Utilizatori</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Gestionare roluri și activare/dezactivare conturi.
        </p>
      </header>
      <UsersManager initialRows={initialRows} />
    </div>
  );
}
