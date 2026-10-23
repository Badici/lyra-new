import { spawnSync } from "node:child_process";
import path from "node:path";

/**
 * Vercel builds have DATABASE_URL, but GitHub CI does not have a reachable database.
 * Apply migrations and ensure the admin user only when this build runs on Vercel.
 */
if (process.env.VERCEL !== "1") {
  console.log("Skipping database migrate and admin seed outside Vercel.");
  process.exit(0);
}

const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");

for (const script of ["src/db/migrate.ts", "src/db/seed/admin.ts"]) {
  const result = spawnSync(tsx, [script], { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
