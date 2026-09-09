/** YouTube URL helpers — thumbnails via img.youtube.com (no API key). */

const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/,
  /^([a-zA-Z0-9_-]{11})$/,
];

export function extractYoutubeId(input: string | null | undefined): string | null {
  if (!input?.trim()) return null;
  const value = input.trim();
  for (const pattern of YT_PATTERNS) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function youtubeThumbnailUrl(
  input: string | null | undefined,
  quality: "hqdefault" | "mqdefault" | "maxresdefault" = "hqdefault",
): string | null {
  const id = extractYoutubeId(input);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

export function youtubeEmbedUrl(input: string | null | undefined): string | null {
  const id = extractYoutubeId(input);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function normalizeYoutubeWatchUrl(input: string | null | undefined): string | null {
  const id = extractYoutubeId(input);
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}
