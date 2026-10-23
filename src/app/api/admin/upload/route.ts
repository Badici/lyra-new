import { NextResponse } from "next/server";
import { storeUploadedImage } from "@/server/media/upload";
import { getSession } from "@/server/auth/session";
import { isAdminRole } from "@/server/auth/roles";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
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

    const stored = await storeUploadedImage(file);
    return NextResponse.json(stored);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload eșuat";
    const status = /Format acceptat|HEIC|sub 4MB|Fișier/.test(message) ? 400 : 500;
    return NextResponse.json(
      { error: status === 400 ? message : "Nu am putut salva imaginea. Încearcă din nou." },
      { status },
    );
  }
}
