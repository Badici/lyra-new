# LyraBaits

Digital hub for the LyraBaits fishing brand: products, editorial content, shows, and storytelling — deployed on Vercel with Neon Postgres.

Production domain: [https://lyrabaits.ro](https://lyrabaits.ro)

**Before changing code, read [`PROJECT_RULES.md`](./PROJECT_RULES.md).**

## Stack

- Next.js (App Router) + TypeScript strict
- Tailwind CSS + bespoke design tokens
- Neon PostgreSQL + Drizzle ORM
- Better Auth (email/password, roles: CUSTOMER / ADMIN)
- Zod validation, React Hook Form on complex client forms
- Resend email abstraction (optional in development)
- Vitest + Playwright

## Architecture

```
src/app          routes (public + /admin + API)
src/components   layout, public, admin, ui primitives
src/features     products, orders, cart, articles, …
src/db           schema, migrations, seed
src/server       auth, email, whatsapp
src/lib          env, money (bani), stock rules, validators
```

## Requirements

- Node.js 22+
- Neon Postgres database (free tier is fine for launch)
- Environment variables from `.env.example`

## Local setup

```bash
cp .env.example .env.local
# Fill DATABASE_URL, BETTER_AUTH_SECRET (>=32 chars), SEED_ADMIN_PASSWORD
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Admin login after seed: `SEED_ADMIN_EMAIL` (default `raresbadici@gmail.com`) with `SEED_ADMIN_PASSWORD`.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | yes | Neon connection string |
| `BETTER_AUTH_SECRET` | yes | ≥32 random chars |
| `BETTER_AUTH_URL` | recommended | e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | yes | Public site URL |
| `SEED_ADMIN_EMAIL` | for seed | Default admin email |
| `SEED_ADMIN_PASSWORD` | for seed | Never commit |
| `RESEND_API_KEY` | optional | Without it, orders still work; emails are skipped with a warning |
| `MAIL_FROM` | optional | Sender identity |
| `ADMIN_NOTIFICATION_EMAIL` | optional | New-order alerts |
| `WHATSAPP_PHONE` | recommended | Digits only, country code |
| `CONTACT_EMAIL` | optional | Public contact |
| `ORDER_NUMBER_PREFIX` | optional | Default `LYRA` |
| `ALLOW_DB_RESET` | danger | Must be `true` to run `db:reset` |

Never commit `.env` / `.env.local`. Never put secrets in `NEXT_PUBLIC_*`.

## Database

```bash
npm run db:generate   # after schema changes
npm run db:migrate    # apply migrations
npm run db:seed       # demo data + admin
npm run db:seed:admin # admin only (idempotent)
npm run db:reset      # wipe tables — requires ALLOW_DB_RESET=true
npm run db:studio     # Drizzle Studio
```

Money is stored as integer **bani**. Stock ≤ 0 does **not** block purchase; orders get `requiresDeliveryConfirmation`.

## Scripts

```bash
npm run dev
npm run build && npm start
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Deployment (Vercel + Neon)

1. Create a Neon project; copy the pooled/serverless connection string to Vercel `DATABASE_URL`.
2. Import the Git repo in Vercel.
3. Set all required env vars in the Vercel project (including `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL=https://lyrabaits.ro`, `BETTER_AUTH_URL=https://lyrabaits.ro`).
4. Run migrations against Neon (`npm run db:migrate` locally with production `DATABASE_URL`, or a one-off CI job). Do not hand-edit production schema.
5. Run `npm run db:seed:admin` once with production admin password in env (not in git).
6. Deploy via Vercel Git integration — GitHub Actions only runs quality checks, not deploy.

## Brand assets

Logos live in `public/brand/`. A full backup of legacy media is in `_preserved_brand/` (not used by the new app until curated).

## Testing notes

Seed data is labeled `[DEV]` / `demonstrativ`. Analytics and listings should treat it as development content, not production catalog.
