export interface WhatsAppService {
  buildOrderMessage(input: {
    orderNumber: string;
    customerName: string;
    totalLabel: string;
    itemsSummary: string;
    requiresDeliveryConfirmation: boolean;
  }): string;
  buildDeepLink(message: string, phoneDigits?: string): string;
  resolvePhoneDigits(): Promise<string>;
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function envWhatsAppPhone(): string {
  return normalizePhone(process.env.WHATSAPP_PHONE ?? "40728241412");
}

export const whatsappService: WhatsAppService = {
  buildOrderMessage(input) {
    const flag = input.requiresDeliveryConfirmation
      ? "\n⚠ Necesită confirmarea termenului de livrare"
      : "";
    return [
      `Comandă LyraBaits ${input.orderNumber}`,
      `Client: ${input.customerName}`,
      `Total: ${input.totalLabel}`,
      `Produse: ${input.itemsSummary}`,
      "Plată: ramburs",
      flag,
    ]
      .filter(Boolean)
      .join("\n");
  },

  buildDeepLink(message: string, phoneDigits?: string) {
    const phone = normalizePhone(phoneDigits || envWhatsAppPhone());
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  },

  async resolvePhoneDigits() {
    try {
      const { getSiteSettings } = await import("@/features/settings/queries");
      const settings = await getSiteSettings();
      const fromDb = settings.contact.whatsapp
        ? normalizePhone(settings.contact.whatsapp)
        : "";
      return fromDb || envWhatsAppPhone();
    } catch {
      return envWhatsAppPhone();
    }
  },
};
