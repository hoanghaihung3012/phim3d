import type { Cue } from '../audio/cues';

/**
 * Sound cues of the 2D film (absolute times, matching src/film2d/scenes).
 * Ids resolve to samples in config/assets.ts first, otherwise to synths in audio/synth.ts.
 * Voice lines ("Hử?", "Ồ.", "Ờ. Vui.") are placeholders until real recordings exist.
 */
export const CUES_2D: Cue[] = [
  // Scene 1
  { id: 'sfx_ting', t: 6.2, volume: 0.35 },
  { id: 'sfx_chime', t: 9.6, volume: 0.5 },
  { id: 'sfx_hu', t: 11.0, volume: 0.8 },
  // Scene 2
  { id: 'sfx_snap', t: 16.4, volume: 0.9 },
  { id: 'sfx_cop', t: 17.52, volume: 1.0 },
  { id: 'sfx_steps', t: 21.4, duration: 0.6, volume: 0.5 },
  { id: 'sfx_steps', t: 22.3, duration: 0.8, volume: 0.6 },
  { id: 'sfx_hu', t: 23.1, volume: 0.6, pitch: 0.8 },
  { id: 'sfx_cop', t: 23.6, volume: 0.45 },
  { id: 'sfx_o', t: 27.6, volume: 0.9 },
  // Scene 3
  { id: 'sfx_bop', t: 30.2, volume: 0.4, pitch: 1.6 },
  { id: 'sfx_bop', t: 33.4, volume: 0.5 },
  { id: 'sfx_chirp', t: 43.4, volume: 0.7 },
  { id: 'sfx_pop', t: 46.0, volume: 1.0 },
  { id: 'sfx_pop', t: 46.3, volume: 0.55 },
  { id: 'sfx_pop', t: 46.6, volume: 0.3 },
  { id: 'sfx_o', t: 48.6, volume: 0.9, pitch: 0.9 },
  { id: 'sfx_fall_whistle', t: 49.95, duration: 0.55, volume: 0.6 },
  { id: 'sfx_cop', t: 50.55, volume: 0.9 },
  { id: 'sfx_chirp', t: 51.0, volume: 0.4, pitch: 0.85 },
  // Scene 4
  { id: 'sfx_steps', t: 52.2, duration: 1.5, volume: 0.4 },
  { id: 'sfx_cop', t: 52.6, volume: 0.35 },
  { id: 'sfx_cop', t: 53.1, volume: 0.35 },
  { id: 'sfx_steps', t: 54.2, duration: 1.1, volume: 0.4 },
  { id: 'sfx_cop', t: 55.4, volume: 0.6 },
  { id: 'sfx_crickets', t: 58.6, duration: 3.0, volume: 0.5 },
  { id: 'sfx_ting', t: 62.0, volume: 0.5 },
  { id: 'sfx_cop', t: 63.32, volume: 0.7 },
  { id: 'sfx_smack', t: 64.95, volume: 1.0 },
  { id: 'sfx_trombone', t: 67.6, volume: 0.6 },
  { id: 'sfx_o', t: 69.8, volume: 0.8, pitch: 1.1 },
  // Scene 5
  { id: 'sfx_chime', t: 72.3, volume: 0.5 },
  { id: 'sfx_chime', t: 76.6, volume: 0.35 },
  { id: 'sfx_hu', t: 78.4, volume: 0.8 },
  { id: 'sfx_poof', t: 80.9, volume: 0.8 },
  { id: 'sfx_ting', t: 85.0, volume: 0.6 },
  // Scene 6
  { id: 'sfx_chime', t: 88.2, volume: 0.4 },
  { id: 'sfx_chirp', t: 92.1, volume: 0.6 },
  { id: 'sfx_smack', t: 93.92, volume: 0.7, pitch: 1.3 },
  { id: 'sfx_chirp', t: 94.3, volume: 0.35, pitch: 0.7 },
  { id: 'sfx_o', t: 97.6, volume: 0.9 },
].sort((a, b) => a.t - b.t);
