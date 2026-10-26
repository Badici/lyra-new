export type OrderEmailInput = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: { name: string; quantity: number; totalLabel: string }[];
  totalLabel: string;
  notes?: string | null;
  requiresDeliveryConfirmation: boolean;
};

export function buildOrderNotification(input: OrderEmailInput) {
  const lines = [
    `Comandă ${input.orderNumber}`,
    `Client: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Telefon: ${input.customerPhone}`,
    `Adresă: ${input.address}`,
    "",
    "Produse:",
    ...input.items.map((item) => `- ${item.name} × ${item.quantity} — ${item.totalLabel}`),
    "",
    `Total: ${input.totalLabel}`,
    "Plată: ramburs la livrare",
  ];
  if (input.notes?.trim()) lines.push(`Observații: ${input.notes.trim()}`);
  if (input.requiresDeliveryConfirmation) {
    lines.push("Necesită confirmarea termenului de livrare.");
  }
  return {
    subject: `[LyraBaits] Comandă nouă ${input.orderNumber}`,
    message: lines.join("\n"),
  };
}

export function buildCustomerConfirmation(input: OrderEmailInput) {
  const lines = [
    `Bună ${input.customerName},`,
    "",
    `Comanda ${input.orderNumber} a fost înregistrată. Totul a mers bine.`,
    "Plata se face ramburs, la livrare.",
    "",
    "Produse:",
    ...input.items.map((item) => `- ${item.name} × ${item.quantity} — ${item.totalLabel}`),
    "",
    `Total: ${input.totalLabel}`,
    `Livrare: ${input.address}`,
    `Telefon: ${input.customerPhone}`,
  ];
  if (input.notes?.trim()) lines.push(`Observații: ${input.notes.trim()}`);
  if (input.requiresDeliveryConfirmation) {
    lines.push("", "Te contactăm dacă trebuie confirmat termenul de livrare.");
  }
  lines.push("", "Pentru întrebări, răspunde la acest email.", "", "LyraBaits");
  return {
    subject: `Comanda ${input.orderNumber} a fost înregistrată — LyraBaits`,
    message: lines.join("\n"),
  };
}
