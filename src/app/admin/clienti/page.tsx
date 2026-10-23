import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminCustomers } from "@/features/customers/admin-queries";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title="Clienți" description="Fără hash-uri de parolă în răspunsuri." />
      <div className="admin-card overflow-hidden">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nume</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Creat</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-muted">
                    Niciun client înregistrat încă.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/clienti/${c.id}`} className="text-accent hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone ?? "—"}</td>
                    <td>{c.createdAt.toISOString().slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
