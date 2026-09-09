export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export interface EmailService {
  send(payload: EmailPayload): Promise<{ ok: boolean; skipped?: boolean }>;
  sendNewOrderNotification(input: {
    orderNumber: string;
    customerName: string;
    totalLabel: string;
    requiresDeliveryConfirmation: boolean;
  }): Promise<void>;
  sendOrderConfirmation(input: {
    to: string;
    orderNumber: string;
    customerName: string;
    totalLabel: string;
  }): Promise<void>;
  sendOrderStatusChanged(input: {
    to: string;
    orderNumber: string;
    statusLabel: string;
  }): Promise<void>;
}
