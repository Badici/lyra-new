import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (process.env.ALLOW_DB_RESET !== "true") {
    throw new Error(
      "Refusing to reset. Set ALLOW_DB_RESET=true in local env to wipe development data.",
    );
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("db:reset is blocked in production.");
  }

  const { sql } = await import("drizzle-orm");
  const { db } = await import("@/db/client");

  console.warn("Resetting development tables…");

  await db.execute(sql`
    TRUNCATE TABLE
      order_status_history,
      order_items,
      orders,
      order_sequences,
      inventory_movements,
      products,
      categories,
      episodes,
      shows,
      articles,
      contact_messages,
      addresses,
      sessions,
      accounts,
      verifications,
      users,
      site_settings
    RESTART IDENTITY CASCADE
  `);

  console.log("Reset complete. Run npm run db:seed next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
