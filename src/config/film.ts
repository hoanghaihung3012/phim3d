/** Global film settings (from docs/script.md, section 3). */
export const FILM: { title: string; width: number; height: number; fps: number } = {
  title: 'Táo Muốn Bay',
  width: 1920,
  height: 1080,
  fps: 30,
};

/**
 * Switches the frame to vertical 9:16 (1080x1920, Reels/Shorts/TikTok) or back to 16:9.
 * Call it before bootFilm2D: the stage, camera, bubbles and texts read FILM when they draw.
 */
export function setFilmFormat(format: 'landscape' | 'vertical'): void {
  FILM.width = format === 'vertical' ? 1080 : 1920;
  FILM.height = format === 'vertical' ? 1920 : 1080;
}

/** Pastel palette shared by characters, props and sky. */
export const PALETTE = {
  mochi: '#FFC7D1',
  mochiCheek: '#FF8FA3',
  eye: '#2B2233',
  cloud: '#FFFFFF',
  cloudShade: '#DDEBFF',
  sparrow: '#FFE58A',
  beak: '#FFA94D',
  hill: '#BDEBC4',
  bush: '#9ADBA8',
  skyTop: '#BFE3FF',
  skyBottom: '#FFE3EC',
  flowerPetals: ['#FFB3C6', '#FFF1A8', '#CDB4FF'],
} as const;

/**
 * Facebook/Instagram Reels safe zone for a 1080x1920 frame, as screen margins in px:
 * the top ~14% (account name), the bottom ~35% (caption, music) and the right column of
 * like/comment/share buttons are covered by the app UI. Keep words and faces inside.
 */
export const REELS_SAFE = { left: 60, top: 270, right: 160, bottom: 670 } as const;
