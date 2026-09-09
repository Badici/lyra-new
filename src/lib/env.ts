import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined || value === null ? undefined : value;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 chars"),
  BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  MAIL_FROM: z.string().default("LyraBaits <no-reply@lyrabaits.ro>"),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().default("raresbadici@gmail.com"),
  WHATSAPP_PHONE: z.string().default("40728241412"),
  CONTACT_EMAIL: z.string().email().default("contact@lyrabaits.ro"),
  ORDER_NUMBER_PREFIX: z.string().default("LYRA"),
  SEED_ADMIN_EMAIL: z.string().email().default("raresbadici@gmail.com"),
  SEED_ADMIN_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
  ALLOW_DB_RESET: z
    .preprocess((v) => v === "true" || v === true, z.boolean())
    .default(false),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }
  cached = parsed.data;
  return cached;
}

export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
  );
}

export function hasEmailProvider(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
