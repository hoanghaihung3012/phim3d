import type { Cue } from '../../audio/cues';

/** Music bed segments of "Thả diều"; it stops for every fall and every silence. Effects and voices come from the scenes. */
const MUSIC: [number, number][] = [
  [0.2, 9.2],
  [12.8, 15.5],
  [24.6, 28.2],
  [43.4, 46.8],
];

export const BASE_CUES: Cue[] = [
  ...MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.7 })),
  // Constant soft breeze; the gust is louder.
  { id: 'sfx_haizz', t: 3.0, duration: 2.0, volume: 0.15 },
  { id: 'sfx_haizz', t: 17.0, duration: 2.5, volume: 0.2 },
];
