import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchRecipeSchema = z.object({
  name: z.string().min(2).optional(),
  laborType: z.enum(["FIXED", "PERCENT"]).optional(),
  laborValue: z.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        kind: z.enum(["material", "category"]),
        id: z.string().min(1),
        qty: z.number().positive(),
      })
    )
    .optional(),
});

async function canAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "ADMIN");
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const payload = patchRecipeSchema.parse(await request.json());
    const { id } = await context.params;
    if (payload.items) {
      await prisma.recipeMaterial.deleteMany({
        where: { recipeId: id },
      });
    }
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name: payload.name,
        laborType: payload.laborType,
        laborValue: payload.laborValue,
        items: payload.items
          ? {
              create: payload.items.map((item) => ({
                materialId: item.kind === "material" ? item.id : undefined,
                materialCategoryId: item.kind === "category" ? item.id : undefined,
                qty: item.qty,
              })),
            }
          : undefined,
      },
    });
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid recipe payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
