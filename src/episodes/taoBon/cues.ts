import type { Cue } from '../../audio/cues';

/** Music bed segments of "Táo bón"; it drops out for the shock beats and the punchline. */
const MUSIC: [number, number][] = [
  [0.4, 15.0],
  [16.0, 17.2],
  [22.3, 26.5],
  [29.3, 34.2],
];

export const BASE_CUES: Cue[] = MUSIC.map(([t0, t1]) => ({ id: 'music_bed', t: t0, duration: t1 - t0, volume: 0.6 }));
