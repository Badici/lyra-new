import { PageHeader } from "@/components/admin/page-header";
import { ContentStatusBadge } from "@/components/admin/status-badge";
import { upsertEpisode, upsertShow } from "@/features/shows/admin-actions";
import { getAdminShows } from "@/features/shows/admin-queries";
import { CONTENT_STATUSES } from "@/lib/constants";

export default async function AdminShowsPage() {
  const shows = await getAdminShows();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageHeader title="Emisiuni" description="Gestionează emisiuni și episoade." />

      <form action={upsertShow} className="admin-card grid max-w-2xl gap-3 p-5">
        <h2 className="font-display text-2xl">Emisiune nouă</h2>
        <input name="name" required placeholder="Nume" className="admin-input" />
        <textarea name="shortDescription" placeholder="Descriere scurtă" className="admin-textarea" />
        <select name="status" defaultValue="DRAFT" className="admin-select">
          {CONTENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input name="sortOrder" type="number" defaultValue={0} className="admin-input" />
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
          Adaugă emisiune
        </button>
      </form>

      {shows.map((show) => (
        <section key={show.id} className="admin-card space-y-4 p-5">
          <form action={upsertShow} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={show.id} />
            <input name="name" defaultValue={show.name} className="admin-input" required />
            <select name="status" defaultValue={show.status} className="admin-select">
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              name="shortDescription"
              defaultValue={show.shortDescription ?? ""}
              className="admin-textarea md:col-span-2"
            />
            <button type="submit" className="rounded-xl bg-moss px-4 py-2 text-sm text-cream">
              Salvează emisiunea
            </button>
          </form>

          <div>
            <h3 className="mb-2 font-medium">Episoade</h3>
            <ul className="mb-4 space-y-2 text-sm">
              {show.episodes.map((ep) => (
                <li key={ep.id} className="flex items-center justify-between gap-2">
                  <span>
                    #{ep.episodeNumber} {ep.title}
                  </span>
                  <ContentStatusBadge status={ep.status} />
                </li>
              ))}
            </ul>
            <form action={upsertEpisode} className="grid gap-2 sm:grid-cols-2">
              <input type="hidden" name="showId" value={show.id} />
              <input name="title" required placeholder="Titlu episod" className="admin-input" />
              <input
                name="episodeNumber"
                type="number"
                required
                min={1}
                placeholder="Nr."
                className="admin-input"
              />
              <select name="status" defaultValue="DRAFT" className="admin-select">
                {CONTENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
                Adaugă episod
              </button>
            </form>
          </div>
        </section>
      ))}
    </div>
  );
}
