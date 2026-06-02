import { PrismaClient, ProductStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getDisplayProducts, products } from "../src/data/catalog";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "raresbadici+adminlyra@gmail.com";
  const adminPassword = await bcrypt.hash("LyraAdmin!2026", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Lyra Admin",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
      active: true,
    },
    create: {
      email: adminEmail,
      name: "Lyra Admin",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
      active: true,
    },
  });

  const categories = [
    {
      slug: "catalog",
      name: "Catalog produse",
      description: "Catalogul principal Lyra Baits.",
      heroImage: "/hero.jpeg",
    },
    {
      slug: "plumbi-momitoare",
      name: "Plumbi și momitoare",
      description: "Colaborare cu plumbisimomitoare.ro",
      heroImage: "/placeholder-product.svg",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const catalogCategory = await prisma.category.findUniqueOrThrow({
    where: { slug: "catalog" },
  });

  const displayOrderMap = new Map(
    getDisplayProducts().map((product, index) => [product.slug, index])
  );

  for (const product of products) {
    const isConfigurable = Boolean(product.pricingConfig);
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        specs: product.specs,
        images: product.images,
        basePriceRon: product.priceValueRon,
        priceLabel: product.priceLabel,
        isConfigurable,
        pricingConfigJson: product.pricingConfig ?? undefined,
        variantSelectorLabel: product.variantSelector?.label,
        variantValues: product.variantSelector?.values ?? [],
        variantPlaceholder: product.variantSelector?.placeholder,
        customOrderNote: product.customOrderNote,
        displayOrder: displayOrderMap.get(product.slug) ?? 100,
        status: ProductStatus.ACTIVE,
        categoryId: catalogCategory.id,
      },
      create: {
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        specs: product.specs,
        images: product.images,
        basePriceRon: product.priceValueRon,
        priceLabel: product.priceLabel,
        isConfigurable,
        pricingConfigJson: product.pricingConfig ?? undefined,
        variantSelectorLabel: product.variantSelector?.label,
        variantValues: product.variantSelector?.values ?? [],
        variantPlaceholder: product.variantSelector?.placeholder,
        customOrderNote: product.customOrderNote,
        displayOrder: displayOrderMap.get(product.slug) ?? 100,
        status: ProductStatus.ACTIVE,
        categoryId: catalogCategory.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
