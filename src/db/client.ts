import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;

const globalForDb = globalThis as unknown as { __lyraDb?: Db };

export const db: Db = globalForDb.__lyraDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__lyraDb = db;
}
