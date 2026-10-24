import type { ZodError } from "zod";

export type FormResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const FIELD_LABELS: Record<string, string> = {
  name: "Numele",
  title: "Titlul",
  sku: "SKU-ul",
  slug: "Slug-ul",
  categoryId: "Categoria",
  priceRon: "Prețul",
  stockQuantity: "Stocul",
  status: "Statusul",
  contentJson: "Conținutul",
  content: "Conținutul",
  contactEmail: "Emailul",
  contactWhatsapp: "WhatsApp-ul",
  orderPrefix: "Prefixul",
  episodeNumber: "Numărul episodului",
  videoUrl: "Linkul YouTube",
  delta: "Ajustarea de stoc",
  showId: "Emisiunea",
  customerName: "Numele clientului",
  customerEmail: "Emailul clientului",
};

export function validationError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Verifică câmpurile formularului.";
  const field = String(issue.path[0] ?? "");
  const label = FIELD_LABELS[field] ?? "Un câmp";

  if (field === "categoryId") return "Alege o categorie.";
  if (field === "priceRon") return "Prețul trebuie să fie mai mare decât 0.";
  if (field === "contactEmail") return "Emailul de contact nu este valid.";
  if (field === "delta") return "Ajustarea de stoc nu poate fi zero.";
  if (issue.code === "too_small") return `${label} este prea scurt sau lipsește.`;
  return `${label} nu este valid.`;
}

export function rethrowRedirect(error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
}

function errorText(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const record = error as { message?: unknown; code?: unknown; constraint?: unknown; cause?: unknown };
  return [record.message, record.code, record.constraint, errorText(record.cause)]
    .filter(Boolean)
    .join(" ");
}

export function saveFailure(error: unknown): FormResult {
  rethrowRedirect(error);
  console.error("[admin-form]", error);
  const text = errorText(error);
  if (text.includes("23505") || text.toLowerCase().includes("unique")) {
    if (text.includes("sku")) return { ok: false, error: "Există deja un produs cu acest SKU." };
    return { ok: false, error: "Există deja o înregistrare cu acest nume sau slug." };
  }
  return { ok: false, error: "Nu am putut salva. Încearcă din nou." };
}

export function decimalInput(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return value ?? undefined;
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  return normalized === "" ? undefined : normalized;
}
