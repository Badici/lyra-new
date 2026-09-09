import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to run migrations");
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Applying migrations…");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migrations applied successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
