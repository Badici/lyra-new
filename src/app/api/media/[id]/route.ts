import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { mediaAssets } from "@/db/schema";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  if (!/^[\w-]{8,32}$/.test(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const asset = await db.query.mediaAssets.findFirst({
    where: eq(mediaAssets.id, id),
  });
  if (!asset) {
    return new NextResponse("Not found", { status: 404 });
  }

  const bytes = Buffer.from(asset.data, "base64");
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
