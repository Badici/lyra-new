import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrder, listOrdersForAdmin, listOrdersForUser } from "@/lib/order-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const orders = await listOrdersForAdmin();
    return NextResponse.json(orders);
  }

  const orders = await listOrdersForUser(session.user.id);
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const payload = await request.json();
    const order = await createOrder(payload, session?.user?.id);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create order" },
      { status: 400 }
    );
  }
}
