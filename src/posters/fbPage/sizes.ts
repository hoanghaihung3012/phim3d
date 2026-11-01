// Facebook Page image sizes and the areas that stay visible on every device.
// Sources: Facebook help ("cover photo displays at 820x312 on computers and 640x360 on
// smartphones", profile picture shown as a circle). We upload at 2x the desktop size.

export const PROFILE = {
  width: 720,
  height: 720,
  /** Facebook crops the profile picture to a circle inscribed in the square. */
  circleR: 360,
  /** Keep faces inside this radius so the circle edge and the ring never touch them. */
  safeR: 320,
} as const;

export const COVER = {
  width: 1640,
  height: 624,
  /**
   * Mobile shows the full height but only a 16:9 slice of the width (640x360 on a phone):
   * 624 * 16 / 9 ≈ 1110 px wide, centered.
   */
  mobile: { x0: 265, x1: 1375 },
  /**
   * The profile picture overlaps the bottom-left corner of the cover (desktop and mobile).
   * Nothing important goes in here.
   */
  profileOverlap: { desktop: { x0: 0, x1: 420, y0: 470 }, mobile: { x0: 265, x1: 600, y0: 470 } },
} as const;
