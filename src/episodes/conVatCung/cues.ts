import type { Cue } from '../../audio/cues';

/** Music bed of "Con vật cưng": it drops out for the long silence and the punchline. */
const MUSIC: [number, number][] = [
  [0.4, 18.9],
  [25.6, 33.8],
];

export const BASE_CUES: Cue[] = MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.6 }));
