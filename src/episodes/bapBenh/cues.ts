import type { Cue } from '../../audio/cues';

/** Music bed segments of "Bập bênh"; it stops for the stuck silence, the explanation and the punchline. */
const MUSIC: [number, number][] = [
  [0.0, 12.4],
  [15.8, 21.0],
  [23.4, 25.6],
  [30.7, 33.0],
];

export const BASE_CUES: Cue[] = MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.6 }));
