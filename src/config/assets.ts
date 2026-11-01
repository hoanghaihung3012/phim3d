/**
 * Single registry for every external asset path (audio samples, textures, music).
 * Nothing else in the codebase should hard-code a file path: import from here.
 *
 * Files live in /public/assets/... and are served by Vite from the site root.
 * While a sample is missing, AudioManager falls back to the synthesized sound
 * with the same cue id (see audio/synth.ts), so the film always plays.
 */
const base = `${import.meta.env.BASE_URL}assets`;

export const AUDIO_ASSETS: Partial<Record<string, string>> = {
  // music_main: `${base}/audio/music_main.mp3`,
  // sfx_mochi_happy: `${base}/audio/mochi_mo.wav`,
};

export const TEXTURE_ASSETS: Partial<Record<string, string>> = {
  // grass: `${base}/textures/grass.png`,
};

export const ASSET_BASE = base;
