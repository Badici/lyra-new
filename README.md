# Lyra Baits – Site prezentare

Site de prezentare single-page pentru Lyra Baits. Comenzile se fac **prin WhatsApp**: +40 728 241 412.

## Rulare

```bash
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Dimensiuni foto

### Nadă (groundbait) – o imagine per variantă

Cele 4 sortimente: **Vanilie**, **Tutti Frutti**, **Capsuni și miere**, **Larve**. Câte o imagine per variantă, afișată pe card.

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Poza variantă nadă** | **800 × 800 px** (pătrat) sau **600 × 600 px** | JPG sau WebP |

- Datele sunt în `src/data/nada.ts`: fiecare variantă are câmpul `image?: string`. Ex: `image: "/nada/vanilie.jpg"`.

### Monturi (secțiunea Monturi și plumburi)

O imagine per montură, **îngustă și înaltă** (forma monturii).

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Foto montură** | **360 × 600 px** (raport 3:5, portrait) | JPG sau WebP |

- Pozele se referă în `src/data/products.ts` în array-ul `monturi`, câmpul `image` pe fiecare obiect. Ex: `image: "/monturi/montor-inline-leadcore.jpg"`.

### Boillies (secțiunea Boillies)

Imaginile se referă în `src/data/products.ts`: array-ul `bigFishProducts` (câmpul `image` pe fiecare produs) și obiectul `mixDeNadire` (câmpul `image`).

| Utilizare | Dimensiuni (lățime × înălțime) | Raport | Format |
|-----------|--------------------------------|--------|--------|
| **BigFish (4 produse)** | **450 × 600 px** (1×) sau **900 × 1200 px** (retina) | 3:4 (portrait, dreptunghi vertical) | JPG sau WebP |
| **Mix de nădire (1 imagine)** | **1200 × 750 px** (1×) sau **2400 × 1500 px** (retina) | 16:10 (landscape) | JPG sau WebP |

- **BigFish:** chenarul pe desktop are `aspect-[3/4]` (portrait); în inspect element afișajul e ~446 × 594 px. Imaginile trebuie **dreptunghi vertical 3:4** (lățime × înălțime), nu pătrat — ex. **450×600** (1×), **900×1200** (retina).
- **Mix de nădire:** containerul are pe mobile `aspect-[16/10]`; pe desktop lățimea este 48% din container. O imagine **16:10** (ex. 1200×750) evită tăieri inutile. `sizes` este `48vw` → pe ecrane mari ~922px lățime, de unde **1200×750** (1×) și **2400×1500** (retina).

### PVA (secțiunea PVA umplute)

O imagine per produs (Pungă PVA, Saculeți PVA).

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Foto PVA** | **800 × 800 px** (pătrat) | JPG sau WebP |

- Pozele se referă în `src/data/products.ts` în array-ul `pvaProducts`, câmpul `image`. Ex: `image: "/punga-pva.jpg"`.

### Momeală plastic (hookbaits)

O imagine per produs (porumb galben, viermi multicolori). Raport 4:5 (portrait).

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Foto momeală plastic** | **640 × 800 px** (raport 4:5) | JPG sau WebP |

- În `src/data/products.ts`, array-ul `plasticBaits`, câmpul `image`. Ex: `image: "/porumb-plastic.png"`.

### Capturile noastre (galerie, ultima secțiune)

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Foto captură** | **600 × 800 px** (raport 3:4, portrait) | JPG sau WebP |

- Pozele se referă în `src/data/catches.ts` (câmpul `image` pe fiecare intrare), ex: `image: "/catches/crap-12kg.jpg"`. Opțional: `caption`, `weight`, `location`.

### Hero (secțiunea principală de sus)

| Utilizare | Dimensiuni (lățime × înălțime) | Format |
|-----------|--------------------------------|--------|
| **Fundal hero** | **1920 × 1080 px** (Full HD) sau **1440 × 900 px** | JPG sau WebP |

### Logo (header)

Ca să arate clar în navbar, exportă logo-ul cu **înălțime 80 px** (sau **160 px** pentru ecrane retina). Lățimea în funcție de raportul tău (ex. 3:1 → 240×80 px sau 480×160 px). Fișier: `public/logo-lyra.png`.

### Unde pui pozele

- **Boillies:** în `public/` (ex: `public/bile-bigfish-20mm-tari.jpg`, `public/mix-nadire.jpg`). Referințe în `src/data/products.ts`: `bigFishProducts[].image` (4 produse; 2 au deja imagine: bile-carligi-mici.png, pasta-bile.png) și `mixDeNadire.image` (1 imagine).
- **Capturi:** `public/catches/` și referințe în `src/data/catches.ts`.
- **Hero:** secțiunea Hero din `src/app/page.tsx` (acum placeholder).

## Structură site

- **Acasă** – Hero + CTA
- **Nadă** – 4 sortimente (Vanilie, Tutti Frutti, Capsuni și miere, Larve), câte o imagine per variantă
- **Accesorii** – grid bento
- **Boillies** – gama BigFish (4 produse + pastă), mix de nădire, boillie fruity în curând
- **Monturi și plumburi** – 4 monturi cu imagine + text; ofertă monturi/forfecă la comandă
- **PVA** – rând compact (pills)
- **Momeală silicon** – un produs evidențiat + grid
- **Contact** – WhatsApp +40 728 241 412
- **Capturile noastre** – galerie foto (ultima secțiune, înainte de footer)

Prețurile sunt placeholder (`— RON`). Nadă: `src/data/nada.ts`. Restul: `src/data/products.ts`.

## Tehnologii

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Framer Motion (animații)

## Build pentru producție

```bash
npm run build
npm start
```
