import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });
config({ path: ".env" });

export async function seedAdmin() {
  const { hashPassword } = await import("better-auth/crypto");
  const { db } = await import("@/db/client");
  const { accounts, users } = await import("@/db/schema");

  const email = (process.env.SEED_ADMIN_EMAIL ?? "raresbadici@gmail.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 10) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is required (min 10 chars). Set it in .env.local — never commit it.",
    );
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    await db
      .update(users)
      .set({ role: "ADMIN", name: existing.name || "Administrator Lyra" })
      .where(eq(users.id, existing.id));

    const account = await db.query.accounts.findFirst({
      where: eq(accounts.userId, existing.id),
    });

    const hashed = await hashPassword(password);
    if (account) {
      await db
        .update(accounts)
        .set({ password: hashed })
        .where(eq(accounts.id, account.id));
    } else {
      await db.insert(accounts).values({
        userId: existing.id,
        accountId: existing.id,
        providerId: "credential",
        password: hashed,
      });
    }

    console.log(`Admin ensured (updated): ${email}`);
    return existing.id;
  }

  const [user] = await db
    .insert(users)
    .values({
      name: "Administrator Lyra",
      email,
      emailVerified: true,
      role: "ADMIN",
    })
    .returning();

  if (!user) throw new Error("Failed to create admin user");

  const hashed = await hashPassword(password);
  await db.insert(accounts).values({
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: hashed,
  });

  console.log(`Admin created: ${email}`);
  return user.id;
}

const isDirectRun = process.argv[1]?.includes("seed/admin");
if (isDirectRun) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
