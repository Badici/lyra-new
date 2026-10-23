import { Resend } from "resend";
import type { EmailPayload, EmailService } from "@/server/email/types";
import { SITE_NAME } from "@/lib/constants";

function getAdminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? "raresbadici@gmail.com";
}

function getFrom() {
  return process.env.MAIL_FROM ?? "LyraBaits <no-reply@lyrabaits.ro>";
}

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY missing — skipping send (order flow continues).",
    );
    return { ok: true, skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: getFrom(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  if (result.error) {
    console.error("[email] Resend error:", result.error);
    return { ok: false };
  }
  return { ok: true };
}

export const emailService: EmailService = {
  async send(payload) {
    return sendViaResend(payload);
  },

  async sendNewOrderNotification(input) {
    const flag = input.requiresDeliveryConfirmation
      ? "<p><strong>Necesită confirmarea termenului de livrare</strong></p>"
      : "";
    await sendViaResend({
      to: getAdminEmail(),
      subject: `[${SITE_NAME}] Comandă nouă ${input.orderNumber}`,
      html: `
        <h1>Comandă nouă</h1>
        <p>Număr: <strong>${input.orderNumber}</strong></p>
        <p>Client: ${input.customerName}</p>
        <p>Total: ${input.totalLabel}</p>
        ${flag}
      `,
    });
  },

  async sendOrderConfirmation(input) {
    await sendViaResend({
      to: input.to,
      subject: `Confirmare comandă ${input.orderNumber} — ${SITE_NAME}`,
      html: `
        <h1>Mulțumim, ${input.customerName}!</h1>
        <p>Comanda ta <strong>${input.orderNumber}</strong> a fost înregistrată.</p>
        <p>Total: ${input.totalLabel}</p>
        <p>Plata: ramburs la livrare.</p>
      `,
    });
  },

  async sendOrderStatusChanged(input) {
    await sendViaResend({
      to: input.to,
      subject: `Actualizare comandă ${input.orderNumber}`,
      html: `
        <p>Comanda <strong>${input.orderNumber}</strong> are acum statusul:
        <strong>${input.statusLabel}</strong>.</p>
      `,
    });
  },
};
