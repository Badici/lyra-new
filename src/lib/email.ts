import { Resend } from "resend";
import { prisma } from "@/lib/db";

const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type SendOrderMailInput = {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalRon: number;
  lines: string[];
};

export async function sendOrderEmails(input: SendOrderMailInput) {
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ?? "raresbadici+comenzilyra@gmail.com";
  const from = process.env.MAIL_FROM ?? "Lyra Baits <onboarding@resend.dev>";

  if (!resend) {
    await prisma.emailLog.createMany({
      data: [
        {
          orderId: input.orderId,
          emailType: "ADMIN_ORDER_NOTIFICATION",
          recipient: adminEmail,
          status: "SKIPPED_NO_PROVIDER",
        },
        {
          orderId: input.orderId,
          emailType: "CUSTOMER_ORDER_CONFIRMATION",
          recipient: input.customerEmail,
          status: "SKIPPED_NO_PROVIDER",
        },
      ],
    });
    return;
  }

  const adminText = [
    `Comandă nouă #${input.orderNumber}`,
    `Client: ${input.customerName} (${input.customerEmail})`,
    `Total: ${input.totalRon.toFixed(2)} RON`,
    "",
    "Produse:",
    ...input.lines,
  ].join("\n");

  const customerText = [
    `Salut, ${input.customerName}!`,
    `Comanda ta #${input.orderNumber} a fost înregistrată.`,
    `Total estimat: ${input.totalRon.toFixed(2)} RON (ramburs).`,
    "",
    "Produse:",
    ...input.lines,
  ].join("\n");

  const [adminResult, customerResult] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: adminEmail,
      subject: `Comandă nouă #${input.orderNumber}`,
      text: adminText,
    }),
    resend.emails.send({
      from,
      to: input.customerEmail,
      subject: `Confirmare comandă #${input.orderNumber}`,
      text: customerText,
    }),
  ]);

  await prisma.emailLog.createMany({
    data: [
      {
        orderId: input.orderId,
        emailType: "ADMIN_ORDER_NOTIFICATION",
        recipient: adminEmail,
        status: adminResult.status,
        providerId:
          adminResult.status === "fulfilled" ? adminResult.value.data?.id : null,
        errorText:
          adminResult.status === "rejected"
            ? String(adminResult.reason)
            : undefined,
      },
      {
        orderId: input.orderId,
        emailType: "CUSTOMER_ORDER_CONFIRMATION",
        recipient: input.customerEmail,
        status: customerResult.status,
        providerId:
          customerResult.status === "fulfilled"
            ? customerResult.value.data?.id
            : null,
        errorText:
          customerResult.status === "rejected"
            ? String(customerResult.reason)
            : undefined,
      },
    ],
  });
}
