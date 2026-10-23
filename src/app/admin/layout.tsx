import "@/styles/tokens.css";
import "@/styles/admin.css";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminShell userName={session.user.name || session.user.email}>
      {children}
    </AdminShell>
  );
}
