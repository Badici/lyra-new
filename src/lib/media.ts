import type { CSSProperties } from "react";

/** Deterministic local gradient placeholders — no remote images. */

const PALETTES = [
  ["#0b1a14", "#1f3d2f", "#c45a1a"],
  ["#102018", "#2d4a38", "#c4a574"],
  ["#0e1c16", "#3a4f2f", "#e8dcc8"],
  ["#15261c", "#4a5d3a", "#b86b2e"],
  ["#0a1612", "#254033", "#8b7355"],
  ["#121f18", "#356049", "#d4c4a8"],
] as const;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function placeholderGradient(seed: string): {
  from: string;
  via: string;
  to: string;
  css: string;
} {
  const palette = PALETTES[hashSeed(seed) % PALETTES.length]!;
  const [from, via, to] = palette;
  return {
    from,
    via,
    to,
    css: `linear-gradient(135deg, ${from} 0%, ${via} 55%, ${to} 100%)`,
  };
}

export function placeholderStyle(seed: string): CSSProperties {
  return { backgroundImage: placeholderGradient(seed).css };
}
