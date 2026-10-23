export function formatViews(count: number) {
  const safe = Math.max(0, count);
  if (safe === 1) return "1 vizită";
  return `${safe.toLocaleString("ro-RO")} vizite`;
}
