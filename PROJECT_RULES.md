# LyraBaits — Project Rules

**Mandatory reading for every human and AI agent before modifying this codebase.**

Brand: LyraBaits · Domain: https://lyrabaits.ro · Stack: Next.js App Router, TypeScript strict, Neon Postgres, Drizzle ORM, Tailwind CSS, deployed on Vercel.

---

## CODE RULES

### Architecture philosophy

- This is a fishing brand hub (commerce + editorial + shows), not a generic shop template.
- Prefer Server Components and server-side logic. Client components only when interactivity requires it.
- Keep the Next.js app as the backend (Server Actions / Route Handlers). No separate Express/Nest server.
- Feature-based modules under `src/features/*` with shared UI in `src/components` and primitives in `src/components/ui`.
- Extend existing patterns; do not invent parallel systems.

### Folder structure

```
src/
  app/                 # App Router routes (public + /admin + API)
  components/
    layout/            # Navbar, footer, shells
    public/            # Public-site shared UI
    admin/             # Admin shared UI
    ui/                # Design-system primitives
  features/
    products/
    categories/
    articles/
    shows/
    orders/
    customers/
    cart/
    analytics/
    contact/
    settings/
  db/                  # Drizzle schema, client, migrations helpers
  lib/                 # Shared utilities, env, money, slug, media
  server/              # Auth, email, whatsapp, services
  styles/              # Global CSS / tokens
  types/
  hooks/
  content/             # Placeholders / static copy scaffolds
tests/
  unit/
  integration/
  e2e/
```

### Naming

- Files: `kebab-case.ts` / `kebab-case.tsx` for components and modules.
- React components: `PascalCase` exports.
- DB tables: `snake_case` plural; Drizzle schema exports in camelCase.
- Routes: Romanian public URLs (`/produse`, `/articole`, `/emisiuni`, …).

### TypeScript

- `strict: true` always.
- No `any` unless justified with a short comment.
- Prefer Zod schemas as the source of truth for runtime validation; infer types from them.

### Server vs Client

- Default to Server Components.
- `"use client"` only for: carousels, cart UI, forms needing RHF, admin editors, toasts, mobile menu.
- Never put secrets, password hashes, or privileged queries in client bundles.
- Every Server Action and admin Route Handler must authorize server-side.

### Database

- Neon Postgres + Drizzle ORM only.
- Schema changes via migrations (`db:generate` → `db:migrate`). Never hand-edit production schema.
- UUIDs for primary keys; timestamps in UTC (`timestamptz`).
- Money as integer **bani** (1 RON = 100 bani). Never float for currency math.
- Avoid N+1; select only needed columns; paginate lists; use transactions for order creation.

### Validation

- Zod on all external input (forms, actions, query params).
- Never trust browser prices, roles, or hidden fields.

### Security

- Password hashing via the auth stack (bcrypt/argon2-class). Never store plaintext.
- Secrets only in env vars. Never commit `.env*`. Never expose secrets via `NEXT_PUBLIC_*`.
- Admin routes and mutations require ADMIN role checks server-side.
- Sanitize/structured content for articles; do not store unsanitized arbitrary HTML as trusted.
- No password hashes in API/admin responses. Never log passwords.

### Error handling

- User-facing errors in Romanian for public UI; no stack traces.
- Log useful server errors in development.
- Polished empty / loading / 404 / error states.

### Dependencies

- Prefer platform primitives before adding packages.
- Headless a11y primitives OK; visual identity must stay bespoke LyraBaits.
- Do not let a component library dictate look & feel.

### Accessibility

- Target WCAG AA fundamentals: semantics, keyboard, focus, contrast, labels, accessible dialogs/menus/carousel.
- Honor `prefers-reduced-motion`.

### Performance

- Optimize for Core Web Vitals. Minimal client JS. `next/image`, `next/font`, pagination, targeted revalidation.
- Do not turn the app into `"use client"`.

### Testing

- Unit tests for money, cart, stock rules, slug, permissions, order validation.
- Integration/component tests for critical forms.
- Playwright E2E for public commerce + auth + admin flows.
- Never weaken tests to make them pass.

---

## DESIGN RULES

### Philosophy

Premium, editorial, natural, immersive, Romanian, fishing-oriented, calm, purposeful.

**Not:** Shopify theme, SaaS landing, shadcn demo, white cards on gray, generic product grid.

### Palette (CSS tokens)

| Token | Role |
|-------|------|
| `--color-depth` | Near-black deep water green |
| `--color-forest` | Dark forest green |
| `--color-moss` | Muted natural green |
| `--color-olive` | Earthy olive/brown |
| `--color-sand` | Warm sand/beige |
| `--color-cream` | Off-white surfaces |
| `--color-accent` | Warm orange — **accent only** |

Avoid excessive saturation. Large sections may use almost-black natural green.

### Typography

- Display: condensed (Bebas Neue via `next/font`) for editorial headlines.
- Body/UI: modern sans (Inter or equivalent via `next/font`).
- Handwritten accent (Caveat): sparingly — never for paragraphs or core UI.

### Layout & surfaces

- Mobile-first always (320 → 1920).
- Design tokens for spacing, radii, shadows, container widths, navbar height.
- Cards only when they contain interaction; avoid card-heavy marketing layouts.
- Editorial storytelling: layered sections, hierarchy, full-bleed moments, sticky narrative where useful.

### Imagery

- No remote random placeholder images (Unsplash, Picsum, etc.).
- Use CSS gradients, local SVG, deterministic placeholders, or local `/public` assets.
- Logos live under `public/brand/`. Legacy media backup: `_preserved_brand/`.

### Navigation

- Sticky premium navbar; proper mobile menu (not shrunk desktop).
- Works over light/dark sections; no layout shift; keyboard accessible.

### Motion

- Purposeful, subtle, performant. Prefer CSS / narrow framer-motion imports.
- Respect `prefers-reduced-motion`.

### Admin UI

- Bespoke dark operational dashboard, cohesive with brand — not generic blue SaaS.

---

## CONTENT RULES

- Romanian is the primary public language.
- Do not fabricate company history, catch stats, testimonials, or reviews.
- Do not invent final product names as if real — use clearly labeled demo placeholders.
- Mark legal/template copy as requiring business/legal review.
- Content and media fields must be easy to replace with real assets later.

---

## ECOMMERCE RULES

- Prices verified server-side at checkout; never trust the client.
- **Stock ≤ 0 does not block purchase.** Show Romanian delivery-confirmation message; set `requiresDeliveryConfirmation` on line items / orders.
- V1 payment: cash on delivery (ramburs) only.
- Persist order before sending notifications.
- Order numbers: human-friendly sequence (e.g. `LYRA-2026-000001`).
- Order statuses: centralized enum (`NEW`, `CONFIRMED`, `WAITING_STOCK`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- Money math only in integer bani.

---

## ADMIN RULES

- Custom `/admin` app in this repo — no external CMS for V1.
- Every admin operation authorizes server-side (ADMIN role).
- Analytics from real DB queries; label seed/dev data clearly.
- Destructive actions require confirmation.
- Protect category delete when products depend on it.
- Stock changes should be traceable when practical.

---

## AGENT RULES

1. Read this file before modifying the project.
2. Inspect existing architecture before creating duplicates.
3. Extend existing patterns; do not replace working architecture for preference.
4. Run tests after significant changes.
5. Run `typecheck` and `lint`.
6. Run production `build` before declaring major tasks finished.
7. Never hardcode secrets or admin passwords.
8. Never use random online placeholder images.
9. Never silently weaken tests.
10. Ask the user only for business-critical ambiguity, credentials, paid infra, or risky asset deletion.

---

## PACKAGE SCRIPTS (canonical)

| Script | Purpose |
|--------|---------|
| `dev` | Next.js development |
| `build` / `start` | Production |
| `lint` / `typecheck` / `format` | Quality |
| `test` / `test:e2e` | Vitest / Playwright |
| `db:generate` | Generate Drizzle migrations |
| `db:migrate` | Apply migrations |
| `db:seed` | Seed demo data + admin (needs `SEED_ADMIN_PASSWORD`) |
| `db:seed:admin` | Idempotent admin only |
| `db:reset` | Dev-only reset (guarded) |
