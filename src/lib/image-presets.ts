export const IMAGE_PRESETS = {
  product: { width: 1600, height: 1600, label: "1600×1600 px" },
  banner: { width: 2100, height: 900, label: "2100×900 px" },
  inline: { width: 1600, height: 900, label: "1600×900 px" },
} as const;

export type ImagePresetKey = keyof typeof IMAGE_PRESETS;

export function cropSourceRect(input: {
  naturalWidth: number;
  naturalHeight: number;
  frameWidth: number;
  frameHeight: number;
  zoom: number;
  panX: number;
  panY: number;
}) {
  const zoom = Math.max(1, input.zoom);
  const cover = Math.max(
    input.frameWidth / input.naturalWidth,
    input.frameHeight / input.naturalHeight,
  );
  const scale = cover * zoom;
  const imageWidth = input.naturalWidth * scale;
  const imageHeight = input.naturalHeight * scale;
  const maxPanX = Math.max(0, (imageWidth - input.frameWidth) / 2);
  const maxPanY = Math.max(0, (imageHeight - input.frameHeight) / 2);
  const panX = Math.min(maxPanX, Math.max(-maxPanX, input.panX));
  const panY = Math.min(maxPanY, Math.max(-maxPanY, input.panY));
  const left = (input.frameWidth - imageWidth) / 2 + panX;
  const top = (input.frameHeight - imageHeight) / 2 + panY;

  return {
    sx: -left / scale,
    sy: -top / scale,
    sw: input.frameWidth / scale,
    sh: input.frameHeight / scale,
    panX,
    panY,
  };
}
