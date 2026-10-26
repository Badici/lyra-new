import { SHOP_EMAIL } from "@/lib/constants";

export type OutboundEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

const SENDER = { name: "LyraBaits", email: SHOP_EMAIL };

export async function deliverEmail(email: OutboundEmail) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.error("[email] BREVO_API_KEY lipsește. Mesajul nu a fost trimis către", email.to);
    return { ok: false as const };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: email.to }],
        replyTo: { email: email.replyTo || SENDER.email, name: "LyraBaits" },
        subject: email.subject,
        textContent: email.text,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[email] Brevo", response.status, body.slice(0, 400));
      return { ok: false as const };
    }
    return { ok: true as const };
  } catch (error) {
    console.error("[email] trimiterea a eșuat:", error);
    return { ok: false as const };
  } finally {
    clearTimeout(timer);
  }
}
