// Shared look of the 2D film: mostly blank paper, thick dark rounded ink, a few pastel fills.

export const PAPER = '#FBFAF6';
export const INK = '#3A3F4E';
/** Outline width in screen pixels at 1080p. */
export const LW = 8;
/** Hand-written font with Vietnamese glyphs (loaded from Google Fonts in boot). */
export const FONT_FAMILY = 'Itim, "Comic Sans MS", system-ui, sans-serif';
export const FONT_URL = 'https://fonts.googleapis.com/css2?family=Itim&display=swap';

export const COLORS = {
  apple: '#FF8C82',
  appleShade: '#F26B66',
  appleBlush: '#FF5577',
  plainApple: '#FFA49C',
  stem: '#9C6B45',
  leaf: '#9ADB8F',
  trunk: '#E4CBAF',
  canopy: '#D5F0C8',
  canopyShade: '#BFE4AF',
  grass: '#9ADB8F',
  cloud: '#FFFFFF',
  cloudShade: '#E3ECFA',
  blush: '#FFB3C1',
  sparrow: '#FFE58A',
  sparrowShade: '#F5CF5E',
  beak: '#FFA94D',
  sun: '#FFF1B8',
  rock: '#E6E4EE',
  rockShade: '#D2CFDE',
  plank: '#F3D8AE',
  sweat: '#A9DBFF',
  spark: '#FFD86B',
  balloons: ['#FFB3C6', '#FFF1A8', '#CDB4FF'],
  dusk: ['#FFD9C2', '#FFE9DE'],
} as const;
