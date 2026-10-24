import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { upsertArticle } from "@/features/articles/admin-actions";
import { getAdminArticleById } from "@/features/articles/admin-queries";
import { ARTICLE_STATUSES } from "@/lib/constants";
import { formatViews } from "@/lib/views";

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = await getAdminArticleById(id);
  if (!article) notFound();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title={article.title}
        description={formatViews(article.viewCount)}
        backHref="/admin/articole"
      />
      <AdminForm action={upsertArticle} returnTo="/admin/articole" className="admin-card grid max-w-3xl gap-4 p-5">
        <input type="hidden" name="id" value={article.id} />
        <ImageField
          name="coverImageKey"
          label="Banner / cover"
          hint="2100×900 px"
          defaultValue={article.coverImageKey}
        />
        <input name="title" required defaultValue={article.title} className="admin-input" />
        <input name="slug" defaultValue={article.slug} className="admin-input" />
        <textarea
          name="excerpt"
          defaultValue={article.excerpt ?? ""}
          className="admin-textarea"
        />
        <div>
          <p className="admin-label">Conținut (poți insera imagini din toolbar)</p>
          <TiptapEditor
            name="content"
            initialContent={article.content as Record<string, unknown>}
          />
        </div>
        <select name="status" defaultValue={article.status} className="admin-select">
          {ARTICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={article.isFeatured} />
          Featured
        </label>
        <SubmitButton label="Salvează" pendingLabel="Se salvează…" variant="accent" />
      </AdminForm>
    </div>
  );
}
