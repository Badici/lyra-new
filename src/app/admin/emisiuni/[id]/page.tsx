import { notFound } from "next/navigation";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { ContentStatusBadge } from "@/components/admin/status-badge";
import {
  deleteEpisode,
  deleteShow,
  upsertEpisode,
  upsertShow,
} from "@/features/shows/admin-actions";
import { getAdminShowById } from "@/features/shows/admin-queries";
import { CONTENT_STATUSES } from "@/lib/constants";

const statusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Publicat",
  ARCHIVED: "Arhivat",
};

export default async function AdminShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getAdminShowById(id);
  if (!show) notFound();

  return (
    <div>
      <PageHeader title={show.name} backHref="/admin/emisiuni" />

      <form action={upsertShow} className="admin-card mb-8 space-y-4 p-5">
        <input type="hidden" name="id" value={show.id} />
        <h2 className="font-display text-lg text-cream">Detalii emisiune</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Nume</label>
            <input name="name" defaultValue={show.name} required className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Slug</label>
            <input name="slug" defaultValue={show.slug} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Status</label>
            <select name="status" defaultValue={show.status} className="admin-select">
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">Ordine</label>
            <input name="sortOrder" type="number" defaultValue={show.sortOrder} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-label">Descriere</label>
          <textarea name="description" defaultValue={show.description ?? ""} className="admin-textarea" rows={3} />
        </div>
        <div className="flex flex-wrap gap-3">
          <SubmitButton label="Salvează emisiune" variant="accent" />
          <ConfirmDeleteForm
            action={deleteShow}
            confirmMessage={`Sigur ștergi emisiunea „${show.name}" și toate episoadele?`}
            hiddenFields={{ id: show.id }}
          />
        </div>
      </form>

      <section className="mb-6">
        <h2 className="mb-4 font-display text-xl text-cream">Episoade</h2>
        <div className="space-y-4">
          {show.episodes.map((episode) => (
            <div key={episode.id} className="admin-card p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-medium text-cream">
                  #{episode.episodeNumber} — {episode.title}
                </span>
                <ContentStatusBadge status={episode.status} />
              </div>
              <form action={upsertEpisode} className="space-y-3">
                <input type="hidden" name="id" value={episode.id} />
                <input type="hidden" name="showId" value={show.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Titlu</label>
                    <input name="title" defaultValue={episode.title} required className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Slug</label>
                    <input name="slug" defaultValue={episode.slug} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nr. episod</label>
                    <input
                      name="episodeNumber"
                      type="number"
                      defaultValue={episode.episodeNumber}
                      required
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Status</label>
                    <select name="status" defaultValue={episode.status} className="admin-select">
                      {CONTENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="admin-label">URL video</label>
                    <input name="videoUrl" defaultValue={episode.videoUrl ?? ""} className="admin-input" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <SubmitButton label="Salvează episod" />
                  <ConfirmDeleteForm
                    action={deleteEpisode}
                    confirmMessage={`Sigur ștergi episodul „${episode.title}"?`}
                    hiddenFields={{ id: episode.id }}
                  />
                </div>
              </form>
            </div>
          ))}
        </div>
      </section>

      <form action={upsertEpisode} className="admin-card space-y-4 p-5">
        <h3 className="font-display text-lg text-cream">Episod nou</h3>
        <input type="hidden" name="showId" value={show.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Titlu *</label>
            <input name="title" required className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Nr. episod *</label>
            <input
              name="episodeNumber"
              type="number"
              defaultValue={show.episodes.length + 1}
              required
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Status</label>
            <select name="status" defaultValue="DRAFT" className="admin-select">
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">URL video</label>
            <input name="videoUrl" className="admin-input" />
          </div>
        </div>
        <SubmitButton label="Adaugă episod" variant="accent" />
      </form>
    </div>
  );
}
