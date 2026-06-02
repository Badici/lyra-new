import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { adminProductSchema } from "@/lib/validation";

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
    const { id } = await context.params;
    const payload = adminProductSchema.partial().parse(await request.json());
    const {
      categoryId,
      pricingConfigJson,
      recipeId,
      ...rest
    } = payload;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        pricingConfigJson: pricingConfigJson ?? undefined,
        category:
          categoryId === undefined
            ? undefined
            : categoryId
              ? { connect: { id: categoryId } }
              : { disconnect: true },
        recipe:
          recipeId === undefined
            ? undefined
            : recipeId
              ? { connect: { id: recipeId } }
              : { disconnect: true },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid product payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
