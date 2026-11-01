import type { Cue } from '../../audio/cues';

/** Music bed segments of "Trốn tìm"; it stops for the shaking, the fall and the punchline. */
const MUSIC: [number, number][] = [
  [0.0, 8.1],
  [10.0, 14.6],
  [23.5, 25.4],
];

export const BASE_CUES: Cue[] = MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.6 }));
