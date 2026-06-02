import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const clickSchema = z.object({
  source: z.string().min(1),
  targetUrl: z.url(),
  params: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = clickSchema.parse(await request.json());
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const forwardedFor = request.headers.get("x-forwarded-for") ?? undefined;
    const ipHash = forwardedFor
      ? crypto.createHash("sha256").update(forwardedFor).digest("hex")
      : undefined;

    await prisma.affiliateClick.create({
      data: {
        source: payload.source,
        targetUrl: payload.targetUrl,
        paramsJson: payload.params ?? {},
        userAgent,
        ipHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 }
    );
  }
}
