import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchRecipeSchema = z.object({
  qty: z.number().positive().optional(),
  wastePct: z.number().min(0).max(100).optional(),
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
    const recipe = await prisma.productRecipe.update({
      where: { id },
      data: payload,
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
  await prisma.productRecipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
