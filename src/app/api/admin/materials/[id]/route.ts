import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchMaterialSchema = z.object({
  name: z.string().min(2).optional(),
  unitCostRon: z.number().nonnegative().optional(),
  categoryId: z.string().optional(),
  active: z.boolean().optional(),
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
    const payload = patchMaterialSchema.parse(await request.json());
    const { id } = await context.params;
    const material = await prisma.rawMaterial.update({
      where: { id },
      data: payload,
    });
    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid material payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  await prisma.rawMaterial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
