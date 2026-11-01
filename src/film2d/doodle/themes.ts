// Alternative looks for the 2D films, applied through Sketch.theme.
import { COLORS } from './style';
import type { SketchTheme } from './Sketch';

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixWithWhite(hex: string, k: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const [r, g, b] = rgb.map((v) => Math.round(v + (255 - v) * k));
  return `rgb(${r},${g},${b})`;
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

/** Fills that keep their colour in the line theme: Táo stays red, cheeks stay pink. */
const KEEP: Record<string, string> = {
  [COLORS.apple]: '#FF7B73',
  [COLORS.appleShade]: '#FF7B73',
  [COLORS.appleBlush]: '#FF8FA3',
  '#FF5A5A': '#FF5A5A', // REC light
};

/**
 * Minimal line look: pure white paper, thin near-black ink with very little wobble, and
 * colours washed almost to white (only Táo keeps his red). Dark fills such as hair stay dark.
 */
export const LINE_THEME: SketchTheme = {
  ink: '#1C1C1E',
  paper: '#FFFFFF',
  lineScale: 0.6,
  wobbleScale: 0.35,
  paint(color: string): string {
    if (color.startsWith('#') && color.length === 7) {
      const key = color.toUpperCase();
      if (KEEP[key]) return KEEP[key];
      if (luminance(color) < 0.4) return '#1C1C1E';
      return mixWithWhite(color, 0.72);
    }
    return color;
  },
};
