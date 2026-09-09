import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { seedAdmin } = await import("./admin");
  const { db } = await import("@/db/client");
  const {
    articles,
    categories,
    episodes,
    products,
    shows,
    siteSettings,
  } = await import("@/db/schema");
  const { resolveStockStatus } = await import("@/lib/stock");

  console.log("Seeding LyraBaits development data…");
  const adminId = await seedAdmin();

  const categoryRows = [
    {
      name: "[DEV] Categorii demonstrative — Monturi",
      slug: "dev-monturi",
      shortDescription: "Conținut demonstrativ pentru dezvoltare.",
      description:
        "Această categorie este date de dezvoltare. Va fi înlocuită cu categorii reale LyraBaits.",
      heroTitle: "Monturi — spațiu demonstrativ",
      heroDescription: "Prezentare editorială placeholder pentru categoria de monturi.",
      visualTheme: { gradientSeed: "monturi" },
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "[DEV] Nade & aditivi",
      slug: "dev-nade",
      shortDescription: "Placeholder pentru nade și aditivi.",
      description: "Date demonstrative — nu reprezintă catalogul final.",
      heroTitle: "Nade — spațiu demonstrativ",
      heroDescription: "Secțiune editorială temporară pentru testarea layout-ului.",
      visualTheme: { gradientSeed: "nade" },
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "[DEV] Accesorii",
      slug: "dev-accesorii",
      shortDescription: "Placeholder pentru accesorii.",
      description: "Date demonstrative pentru admin, cart și checkout.",
      heroTitle: "Accesorii — spațiu demonstrativ",
      heroDescription: "Conținut temporar, ușor de înlocuit.",
      visualTheme: { gradientSeed: "accesorii" },
      sortOrder: 3,
      isActive: true,
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryRows)
    .onConflictDoNothing()
    .returning();

  const allCategories =
    insertedCategories.length > 0
      ? insertedCategories
      : await db.query.categories.findMany();

  const bySlug = Object.fromEntries(allCategories.map((c) => [c.slug, c]));

  const productDefs = Array.from({ length: 18 }, (_, i) => {
    const n = i + 1;
    const cat =
      n % 3 === 1
        ? bySlug["dev-monturi"]
        : n % 3 === 2
          ? bySlug["dev-nade"]
          : bySlug["dev-accesorii"];
    const stock = n === 3 || n === 7 || n === 12 ? 0 : n * 3;
    return {
      categoryId: cat!.id,
      name: `Produs demonstrativ ${String(n).padStart(2, "0")}`,
      slug: `produs-demonstrativ-${String(n).padStart(2, "0")}`,
      sku: `DEV-SKU-${String(n).padStart(3, "0")}`,
      shortDescription: "Produs placeholder pentru dezvoltare — nu este produs final.",
      description:
        "Descriere demonstrativă. Textul real al produsului va fi introdus ulterior.",
      story:
        "Povestea produsului (placeholder). Structura editorială este pregătită pentru conținut real.",
      usageInstructions:
        "Instrucțiuni de utilizare (placeholder). Vor fi completate de echipa Lyra.",
      priceBani: 2500 + n * 150,
      compareAtPriceBani: n % 4 === 0 ? 3500 + n * 150 : null,
      stockQuantity: stock,
      stockStatus: resolveStockStatus(stock),
      isActive: true,
      isFeatured: n <= 4,
      isPopular: n % 2 === 0,
      mainImageKey: null,
      gallery: [],
      metadata: { source: "seed-dev" },
      seoTitle: `Produs demonstrativ ${String(n).padStart(2, "0")} | LyraBaits`,
      seoDescription: "Pagina demonstrativă de produs pentru dezvoltarea platformei.",
    };
  });

  await db.insert(products).values(productDefs).onConflictDoNothing();

  await db
    .insert(articles)
    .values([
      {
        title: "[DEV] Articol demonstrativ: ritmul apei",
        slug: "dev-articol-ritmul-apei",
        excerpt: "Articol placeholder pentru homepage și listing editorial.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Acesta este conținut demonstrativ. Nu inventăm istorii de brand — textul real va fi adăugat ulterior.",
                },
              ],
            },
          ],
        },
        authorId: adminId,
        authorName: "LyraBaits",
        status: "PUBLISHED",
        isFeatured: true,
        tags: ["dev", "editorial"],
        publishedAt: new Date(),
        seoTitle: "Articol demonstrativ | LyraBaits",
        seoDescription: "Placeholder editorial pentru dezvoltarea platformei.",
      },
      {
        title: "[DEV] Articol demonstrativ: pregătirea partidei",
        slug: "dev-articol-pregatirea-partidei",
        excerpt: "Al doilea articol placeholder pentru ierarhia editorială.",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Conținut demonstrativ pentru layout-ul de articole.",
                },
              ],
            },
          ],
        },
        authorId: adminId,
        authorName: "LyraBaits",
        status: "PUBLISHED",
        isFeatured: false,
        tags: ["dev"],
        publishedAt: new Date(),
      },
      {
        title: "[DEV] Draft nepublicat",
        slug: "dev-articol-draft",
        excerpt: "Nu trebuie să apară public.",
        content: { type: "doc", content: [] },
        authorId: adminId,
        status: "DRAFT",
        isFeatured: false,
      },
    ])
    .onConflictDoNothing();

  const showDefs = [
    {
      name: "[DEV] Emisiune 01",
      slug: "dev-emisiune-01",
      shortDescription: "Emisiune demonstrativă — numele final urmează.",
      description: "Placeholder pentru arhitectura de emisiuni LyraBaits.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      name: "[DEV] Emisiune 02",
      slug: "dev-emisiune-02",
      shortDescription: "A doua emisiune demonstrativă.",
      description: "Conținut temporar pentru testare.",
      status: "PUBLISHED" as const,
      sortOrder: 2,
    },
    {
      name: "[DEV] Emisiune 03",
      slug: "dev-emisiune-03",
      shortDescription: "A treia emisiune demonstrativă.",
      description: "Conținut temporar pentru testare.",
      status: "PUBLISHED" as const,
      sortOrder: 3,
    },
    {
      name: "[DEV] Emisiune 04",
      slug: "dev-emisiune-04",
      shortDescription: "A patra emisiune demonstrativă.",
      description: "Conținut temporar pentru testare.",
      status: "PUBLISHED" as const,
      sortOrder: 4,
    },
  ];

  const insertedShows = await db
    .insert(shows)
    .values(showDefs)
    .onConflictDoNothing()
    .returning();
  const allShows =
    insertedShows.length > 0 ? insertedShows : await db.query.shows.findMany();

  for (const show of allShows) {
    await db
      .insert(episodes)
      .values([
        {
          showId: show.id,
          title: `Episod demonstrativ 1 — ${show.name}`,
          slug: "episod-1",
          description: "Episod placeholder fără video real.",
          episodeNumber: 1,
          seasonNumber: 1,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
        {
          showId: show.id,
          title: `Episod demonstrativ 2 — ${show.name}`,
          slug: "episod-2",
          description: "Episod placeholder fără video real.",
          episodeNumber: 2,
          seasonNumber: 1,
          status: "DRAFT",
        },
      ])
      .onConflictDoNothing();
  }

  await db
    .insert(siteSettings)
    .values([
      {
        key: "site_identity",
        value: {
          name: "LyraBaits",
          tagline: "Mai mult decât echipament de pescuit",
          isDevelopmentSeed: true,
        },
      },
      {
        key: "contact",
        value: {
          email: process.env.CONTACT_EMAIL ?? "contact@lyrabaits.ro",
          whatsapp: process.env.WHATSAPP_PHONE ?? "40728241412",
        },
      },
      {
        key: "social",
        value: {
          facebook: "",
          instagram: "",
          youtube: "",
        },
      },
      {
        key: "orders",
        value: {
          prefix: process.env.ORDER_NUMBER_PREFIX ?? "LYRA",
        },
      },
    ])
    .onConflictDoNothing();

  console.log("Seed complete. Data is clearly marked [DEV] / demonstrativ.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
