import { sendOrderViaFormSubmit } from "@/server/email/formsubmit";
import type { OrderEmailInput } from "@/server/email/order-message";
import type { EmailService } from "@/server/email/types";

export const emailService: EmailService = {
  async send() {
    return { ok: false, skipped: true };
  },

  async sendNewOrderNotification(input) {
    await sendOrderViaFormSubmit(input);
  },

  async sendOrderConfirmation() {
    return;
  },

  async sendOrderStatusChanged() {
    return;
  },
};

export type { OrderEmailInput };
