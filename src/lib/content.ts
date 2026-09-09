/** Extract plain text from a TipTap JSON document for simple public rendering. */

export function extractTipTapText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const doc = node as { type?: string; text?: string; content?: unknown[] };
  if (doc.text) return doc.text;
  if (!doc.content?.length) return "";
  return doc.content.map(extractTipTapText).filter(Boolean).join("\n\n");
}
