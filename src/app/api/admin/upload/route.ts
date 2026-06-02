import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadProductImage } from "@/lib/blob";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const url = await uploadProductImage(file);
  return NextResponse.json({ url }, { status: 201 });
}
