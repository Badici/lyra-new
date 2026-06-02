import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const recipeSchema = z.object({
  name: z.string().min(2),
  laborType: z.enum(["FIXED", "PERCENT"]),
  laborValue: z.number().nonnegative(),
  items: z
    .array(
      z.object({
        kind: z.enum(["material", "category"]),
        id: z.string().min(1),
        qty: z.number().positive(),
      })
    )
    .default([]),
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
    include: {
      product: true,
      material: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  const newRecipes = await prisma.recipe.findMany({
    include: {
      items: {
        include: {
          material: {
            include: {
              category: true,
            },
          },
          materialCategory: {
            include: {
              materials: {
                where: { active: true },
                orderBy: { name: "asc" },
              },
            },
          },
        },
      },
      products: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({
    recipes: newRecipes,
    legacyRecipeRows: recipes,
  });
}

export async function POST(request: Request) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const payload = recipeSchema.parse(await request.json());
    const recipe = await prisma.recipe.create({
      data: {
        name: payload.name,
        laborType: payload.laborType,
        laborValue: payload.laborValue,
        items: {
          create: payload.items.map((item) => ({
            materialId: item.kind === "material" ? item.id : undefined,
            materialCategoryId: item.kind === "category" ? item.id : undefined,
            qty: item.qty,
          })),
        },
      },
      include: {
        items: {
          include: {
            material: true,
            materialCategory: true,
          },
        },
      },
    });
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid recipe payload" },
      { status: 400 }
    );
  }
}
