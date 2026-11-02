import type { Cue } from './cues';
import { SYNTHS } from './synth';

/**
 * Renders synth cues offline (no real-time playback) and returns a 16-bit mono WAV as base64.
 * Used by scripts/export-mp4.mjs through each page's `window.__film.renderAudioWav()`.
 */
export async function renderCuesWav(cues: Cue[], duration: number, sampleRate = 44100): Promise<string> {
  const ctx = new OfflineAudioContext(1, Math.ceil((duration + 1) * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  for (const cue of cues) SYNTHS[cue.id]?.(ctx as unknown as AudioContext, master, cue.t, cue);
  const data = (await ctx.startRendering()).getChannelData(0);
  const bytes = new Uint8Array(44 + data.length * 2);
  const view = new DataView(bytes.buffer);
  const str = (o: number, v: string) => [...v].forEach((ch, i) => view.setUint8(o + i, ch.charCodeAt(0)));
  str(0, 'RIFF');
  view.setUint32(4, 36 + data.length * 2, true);
  str(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, 'data');
  view.setUint32(40, data.length * 2, true);
  for (let i = 0; i < data.length; i++) view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 0x7fff, true);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
