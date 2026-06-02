# Lyra Baits Platform

Platformă e-commerce completă pe Next.js, cu:
- catalog produse;
- checkout guest + utilizator logat;
- admin panel (produse, rețete, materii prime, comenzi, utilizatori);
- istoric comenzi;
- email tranzacțional (admin + client);
- tracking pentru pagina `plumbi-si-momitoare`.

## Stack

- Next.js (App Router)
- Prisma + Neon Postgres
- Auth.js (credentials + roluri)
- Resend (email)
- Vercel Blob (imagini produse)
- Recharts (grafice admin)

## Setup local

1. Instalează dependențele:

```bash
npm install
```

2. Creează fișier `.env` pe baza `.env.example`.

3. Generează clientul Prisma și rulează migrarea:

```bash
npm run db:generate
npm run db:migrate
```

4. Seed inițial (catalog + admin seed):

```bash
npm run db:seed
```

5. Rulează aplicația:

```bash
npm run dev
```

## Comenzi utile

```bash
npm run lint
npm run build
npm run start
```

## Rute publice

- `/`
- `/catalog`
- `/produse/[slug]`
- `/cos`
- `/cont`
- `/cont/login`
- `/cont/inregistrare`
- `/plumbi-si-momitoare`

## Rute admin

- `/admin`
- `/admin/produse`
- `/admin/produse/[id]`
- `/admin/materii-prime`
- `/admin/retete`
- `/admin/comenzi`
- `/admin/comenzi/noua`
- `/admin/utilizatori`
- `/admin/setari`

## Vercel Deploy Runbook

1. Creezi proiect pe Vercel și conectezi repo-ul.
2. Creezi baza Neon Postgres și copiezi `DATABASE_URL`.
3. Configurezi environment variables în Vercel:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `RESEND_API_KEY`
   - `MAIL_FROM`
   - `ADMIN_NOTIFICATION_EMAIL`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXT_PUBLIC_SITE_URL`
4. Rulezi migrațiile pe production DB (local sau CI):

```bash
npx prisma migrate deploy
```

5. Deploy.

## Notă admin seed

Seed-ul creează un admin implicit:
- email: `raresbadici+adminlyra@gmail.com`
- parolă: `LyraAdmin!2026`

Schimbă parola imediat după primul login.
