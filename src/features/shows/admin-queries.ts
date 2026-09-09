import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { episodes, shows } from "@/db/schema";

export async function getAdminShows() {
  return db.query.shows.findMany({
    orderBy: [asc(shows.sortOrder), asc(shows.name)],
    with: {
      episodes: {
        orderBy: [asc(episodes.episodeNumber)],
      },
    },
  });
}

export async function getAdminShowById(id: string) {
  return db.query.shows.findFirst({
    where: eq(shows.id, id),
    with: {
      episodes: {
        orderBy: [asc(episodes.episodeNumber)],
      },
    },
  });
}

export async function getAdminEpisodeById(id: string) {
  return db.query.episodes.findFirst({
    where: eq(episodes.id, id),
    with: { show: true },
  });
}
