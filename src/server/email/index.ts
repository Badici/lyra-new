import { SHOP_EMAIL } from "@/lib/constants";
import { deliverEmail } from "@/server/email/deliver";
import {
  buildCustomerConfirmation,
  buildOrderNotification,
  type OrderEmailInput,
} from "@/server/email/order-message";
import type { EmailService } from "@/server/email/types";

async function notifyShopAndCustomer(input: OrderEmailInput) {
  const shop = buildOrderNotification(input);
  const customer = buildCustomerConfirmation(input);
  await Promise.all([
    deliverEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || SHOP_EMAIL,
      replyTo: input.customerEmail,
      subject: shop.subject,
      text: shop.message,
    }),
    deliverEmail({
      to: input.customerEmail,
      replyTo: SHOP_EMAIL,
      subject: customer.subject,
      text: customer.message,
    }),
  ]);
}

export const emailService: EmailService = {
  async send(payload) {
    const to = Array.isArray(payload.to) ? payload.to[0] : payload.to;
    if (!to) return { ok: false, skipped: true };
    const result = await deliverEmail({
      to,
      subject: payload.subject,
      text: payload.text ?? payload.html.replace(/<[^>]+>/g, " "),
    });
    return result.ok ? { ok: true } : { ok: false, skipped: true };
  },

  async sendNewOrderNotification(input) {
    await notifyShopAndCustomer(input);
  },

  async sendOrderConfirmation(input) {
    await deliverEmail({
      to: input.to,
      replyTo: SHOP_EMAIL,
      subject: `Comanda ${input.orderNumber} a fost înregistrată — LyraBaits`,
      text: [
        `Bună ${input.customerName},`,
        "",
        `Comanda ${input.orderNumber} a fost înregistrată. Totul a mers bine.`,
        `Total: ${input.totalLabel}`,
        "Plata se face ramburs, la livrare.",
        "",
        "LyraBaits",
      ].join("\n"),
    });
  },

  async sendOrderStatusChanged(input) {
    await deliverEmail({
      to: input.to,
      replyTo: SHOP_EMAIL,
      subject: `Comanda ${input.orderNumber} — ${input.statusLabel}`,
      text: `Comanda ${input.orderNumber} este acum: ${input.statusLabel}.\n\nLyraBaits`,
    });
  },
};

export type { OrderEmailInput };
