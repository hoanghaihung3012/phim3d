/**
 * Every sound cue in the film, by absolute time (docs/script.md, section 6).
 * `id` selects a sample from config/assets.ts or, if none, a synth in synth.ts.
 */
export interface Cue {
  id: string;
  t: number;
  /** Seconds; used by sustained synths such as the charge-up. */
  duration?: number;
  /** 0..1 gain. */
  volume?: number;
  /** Playback-rate / pitch multiplier. */
  pitch?: number;
}

export const CUES: Cue[] = [
  // Scene 1 - Ước mơ
  { id: 'sfx_mochi_happy', t: 5.0, volume: 0.6 },
  { id: 'sfx_mochi_happy', t: 7.0, volume: 0.6, pitch: 1.12 },
  { id: 'sfx_chime', t: 9.2, volume: 0.5 },
  { id: 'sfx_ting', t: 12.0, volume: 0.6 },
  // Scene 2 - Thử lần 1: Nhảy
  { id: 'sfx_charge', t: 14.5, duration: 3.5, volume: 0.45 },
  { id: 'sfx_boing', t: 18.0, volume: 0.8 },
  { id: 'sfx_splat', t: 21.0, volume: 0.9 },
  { id: 'sfx_bop', t: 21.45, volume: 0.5 },
  { id: 'sfx_bop', t: 21.8, volume: 0.3, pitch: 1.2 },
  { id: 'sfx_inflate', t: 25.0, duration: 1.4, volume: 0.5 },
].sort((a, b) => a.t - b.t);
