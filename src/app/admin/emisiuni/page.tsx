import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ContentStatusBadge } from "@/components/admin/status-badge";
import { ImageField } from "@/components/admin/image-field";
import { upsertShow } from "@/features/shows/admin-actions";
import { getAdminShows } from "@/features/shows/admin-queries";
import { CONTENT_STATUSES } from "@/lib/constants";

export default async function AdminShowsPage() {
  const shows = await getAdminShows();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageHeader
        title="Emisiuni"
        description="Emisiunea este grupul; episoadele sunt înregistrările cu link YouTube."
      />

      <form action={upsertShow} className="admin-card grid max-w-2xl gap-3 p-5">
        <h2 className="font-display text-2xl">Emisiune nouă</h2>
        <ImageField name="coverImageKey" label="Copertă emisiune" />
        <input name="name" required placeholder="Nume emisiune" className="admin-input" />
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

      <div className="space-y-4">
        {shows.map((show) => (
          <section key={show.id} className="admin-card space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-cream">{show.name}</h2>
                <p className="text-xs text-muted">
                  {show.episodes.length}{" "}
                  {show.episodes.length === 1 ? "episod" : "episoade"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ContentStatusBadge status={show.status} />
                <Link
                  href={`/admin/emisiuni/${show.id}`}
                  className="rounded-xl bg-moss px-4 py-2 text-sm text-cream"
                >
                  Gestionează episoade
                </Link>
              </div>
            </div>
            {show.episodes.length > 0 ? (
              <ul className="space-y-1 text-sm text-muted">
                {show.episodes.slice(0, 5).map((ep) => (
                  <li key={ep.id}>
                    #{ep.episodeNumber} {ep.title}
                    {ep.videoUrl ? " · YouTube" : ""}
                  </li>
                ))}
                {show.episodes.length > 5 ? (
                  <li>+ încă {show.episodes.length - 5}</li>
                ) : null}
              </ul>
            ) : (
              <p className="text-sm text-muted">Niciun episod încă — deschide emisiunea ca să adaugi.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
