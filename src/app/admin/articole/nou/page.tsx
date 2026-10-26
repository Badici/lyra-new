import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { upsertArticle } from "@/features/articles/admin-actions";
import { ARTICLE_STATUSES } from "@/lib/constants";

export default function NewArticlePage() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title="Articol nou" backHref="/admin/articole" />
      <AdminForm action={upsertArticle} returnTo="/admin/articole" className="admin-card grid max-w-3xl gap-4 p-5">
        <ImageField name="coverImageKey" label="Banner / cover" preset="banner" />
        <input name="title" required placeholder="Titlu" className="admin-input" />
        <input name="slug" placeholder="Slug (opțional)" className="admin-input" />
        <textarea name="excerpt" placeholder="Rezumat" className="admin-textarea" />
        <div>
          <p className="admin-label">Conținut (poți insera imagini din toolbar)</p>
          <TiptapEditor name="content" />
        </div>
        <select name="status" defaultValue="DRAFT" className="admin-select">
          {ARTICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" />
          Featured
        </label>
        <SubmitButton label="Salvează" pendingLabel="Se salvează…" variant="accent" />
      </AdminForm>
    </div>
  );
}
