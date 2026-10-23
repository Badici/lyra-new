import { NextResponse } from "next/server";
import { storeUploadedImage } from "@/server/media/upload";
import { getSession } from "@/server/auth/session";
import { isAdminRole } from "@/server/auth/roles";

export async function POST(request: Request) {
  const session = await getSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || !isAdminRole(role)) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fișier lipsă" }, { status: 400 });
  }

  try {
    const stored = await storeUploadedImage(file);
    return NextResponse.json(stored);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload eșuat";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
