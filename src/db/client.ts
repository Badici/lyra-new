import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { __lyraDb?: Db };

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel Project Settings → Environment Variables.",
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

/** Lazy DB accessor — avoids crashing Next.js build when env is missing at import time. */
export function getDb(): Db {
  if (!globalForDb.__lyraDb) {
    globalForDb.__lyraDb = createDb();
  }
  return globalForDb.__lyraDb;
}

/** Prefer `getDb()` in new code. Kept for existing imports. */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
