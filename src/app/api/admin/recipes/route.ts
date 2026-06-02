import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const recipeSchema = z.object({
  productId: z.string().min(1),
  materialId: z.string().min(1),
  qty: z.number().positive(),
  wastePct: z.number().min(0).max(100).default(0),
});

async function canAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "ADMIN");
}

export async function GET() {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const recipes = await prisma.productRecipe.findMany({
    include: { product: true, material: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const payload = recipeSchema.parse(await request.json());
    const recipe = await prisma.productRecipe.upsert({
      where: {
        productId_materialId: {
          productId: payload.productId,
          materialId: payload.materialId,
        },
      },
      update: {
        qty: payload.qty,
        wastePct: payload.wastePct,
      },
      create: payload,
    });
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid recipe payload" },
      { status: 400 }
    );
  }
}
