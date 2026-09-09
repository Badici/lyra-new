import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { SubmitButton } from "@/components/admin/submit-button";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { deleteArticle, upsertArticle } from "@/features/articles/admin-actions";
import { ARTICLE_STATUSES } from "@/lib/constants";
import type { articles } from "@/db/schema";

type ArticleFormProps = {
  article?: typeof articles.$inferSelect;
};

const statusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Publicat",
  ARCHIVED: "Arhivat",
};

export function ArticleForm({ article }: ArticleFormProps) {
  return (
    <div className="max-w-4xl space-y-6">
      <form action={upsertArticle} className="space-y-4">
        {article && <input type="hidden" name="id" value={article.id} />}

        <div className="admin-card space-y-4 p-5">
          <div>
            <label htmlFor="title" className="admin-label">
              Titlu *
            </label>
            <input id="title" name="title" required defaultValue={article?.title} className="admin-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className="admin-label">
                Slug
              </label>
              <input id="slug" name="slug" defaultValue={article?.slug} className="admin-input" />
            </div>
            <div>
              <label htmlFor="status" className="admin-label">
                Status
              </label>
              <select id="status" name="status" defaultValue={article?.status ?? "DRAFT"} className="admin-select">
                {ARTICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="excerpt" className="admin-label">
              Rezumat
            </label>
            <textarea id="excerpt" name="excerpt" defaultValue={article?.excerpt ?? ""} className="admin-textarea" />
          </div>
          <div>
            <label htmlFor="authorName" className="admin-label">
              Autor
            </label>
            <input
              id="authorName"
              name="authorName"
              defaultValue={article?.authorName ?? "LyraBaits"}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="tags" className="admin-label">
              Etichete (separate prin virgulă)
            </label>
            <input
              id="tags"
              name="tags"
              defaultValue={article?.tags?.join(", ") ?? ""}
              className="admin-input"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={article?.isFeatured ?? false} />
            Recomandat pe homepage
          </label>
        </div>

        <div>
          <p className="admin-label mb-2">Conținut (TipTap JSON)</p>
          <TiptapEditor name="content" initialContent={article?.content} />
        </div>

        <SubmitButton label={article ? "Salvează articol" : "Creează articol"} variant="accent" />
      </form>

      {article && (
        <ConfirmDeleteForm
          action={deleteArticle}
          confirmMessage="Sigur ștergi acest articol?"
          hiddenFields={{ id: article.id }}
        />
      )}
    </div>
  );
}
