import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ArticleStatusBadge } from "@/components/admin/status-badge";
import { getAdminArticles } from "@/features/articles/admin-queries";

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Articole"
        actions={
          <Link href="/admin/articole/nou" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
            Articol nou
          </Link>
        }
      />
      <div className="admin-card overflow-hidden">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Status</th>
                <th>Publicat</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/articole/${a.id}`} className="text-accent hover:underline">
                      {a.title}
                    </Link>
                  </td>
                  <td>
                    <ArticleStatusBadge status={a.status} />
                  </td>
                  <td className="text-muted">
                    {a.publishedAt ? a.publishedAt.toISOString().slice(0, 10) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
