import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const LEVI_URL =
  "https://plumbisimomitoare.ro/?utm_source=lyra&utm_medium=referral&utm_campaign=plumbi_momitoare";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");
  const targetUrl = target === "levi" ? LEVI_URL : LEVI_URL;

  const userAgent = request.headers.get("user-agent") ?? undefined;
  const forwardedFor = request.headers.get("x-forwarded-for") ?? undefined;
  const ipHash = forwardedFor
    ? crypto.createHash("sha256").update(forwardedFor).digest("hex")
    : undefined;

  await prisma.affiliateClick.create({
    data: {
      source: "lyra-plumbi-momitoare-page",
      targetUrl,
      paramsJson: {
        utm_source: "lyra",
        utm_medium: "referral",
        utm_campaign: "plumbi_momitoare",
      },
      userAgent,
      ipHash,
    },
  });

  return NextResponse.redirect(targetUrl);
}
