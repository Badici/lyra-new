export function mediaUrl(keyOrUrl: string | null | undefined): string | null {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://") || keyOrUrl.startsWith("/")) {
    return keyOrUrl;
  }
  return `/${keyOrUrl.replace(/^\//, "")}`;
}
