import type { Cue } from '../../audio/cues';

/**
 * Music of "Ảnh gia đình" (absolute times). Dialogue babble, shutter clicks, polaroid pops
 * and other effects are added by the scenes themselves (scenes/*.ts via helpers.ts).
 * The music bed stops for every photo and every awkward silence, then comes back.
 */
const MUSIC: [number, number][] = [
  [0.2, 10.5],
  [13.0, 17.7],
  [21.9, 24.5],
  [32.9, 38.8],
  [39.3, 41.0],
  [45.6, 48.7],
  [54.3, 61.2],
];

export const BASE_CUES: Cue[] = MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.7 }));
