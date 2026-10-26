import { buildOrderNotification, type OrderEmailInput } from "@/server/email/order-message";

function adminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? "raresbadici@gmail.com";
}

export async function sendOrderViaFormSubmit(input: OrderEmailInput) {
  const { subject, message } = buildOrderNotification(input);
  const to = adminEmail();
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        _replyto: input.customerEmail,
        name: input.customerName,
        email: input.customerEmail,
        message,
      }),
    });
    const body = (await response.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
    const success = body?.success === true || body?.success === "true";
    if (!response.ok || !success) {
      console.error("[email] FormSubmit:", response.status, body?.message ?? body);
      return { ok: false as const };
    }
    return { ok: true as const };
  } catch (error) {
    console.error("[email] FormSubmit request failed:", error);
    return { ok: false as const };
  }
}
