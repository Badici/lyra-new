import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { adminProductSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session.user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      pricingOverrides: true,
      recipeItems: {
        include: { material: true },
      },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = adminProductSchema.parse(await request.json());
    const {
      categoryId,
      pricingConfigJson,
      ...rest
    } = payload;
    const product = await prisma.product.create({
      data: {
        ...rest,
        pricingConfigJson: pricingConfigJson ?? undefined,
        category: categoryId
          ? {
              connect: { id: categoryId },
            }
          : undefined,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid product payload" },
      { status: 400 }
    );
  }
}
