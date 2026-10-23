export function absoluteMedia(
  keyOrUrl: string | null | undefined,
  siteUrl: string,
): string | undefined {
  const url = mediaUrl(keyOrUrl);
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteUrl.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export function mediaUrl(keyOrUrl: string | null | undefined): string | null {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://") || keyOrUrl.startsWith("/")) {
    return keyOrUrl;
  }
  return `/${keyOrUrl.replace(/^\//, "")}`;
}
