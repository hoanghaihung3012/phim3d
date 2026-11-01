import type { Cue } from './cues';

/**
 * Placeholder sound effects synthesized with WebAudio, so the film has sound
 * before real samples exist. Each synth schedules itself at `when` (ctx time).
 */
export type Synth = (ctx: AudioContext, out: AudioNode, when: number, cue: Cue) => void;

function envGain(ctx: AudioContext, out: AudioNode, when: number, peak: number, attack: number, release: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), when + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, when + attack + release);
  g.connect(out);
  return g;
}

function osc(ctx: AudioContext, type: OscillatorType, dest: AudioNode, when: number, dur: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.connect(dest);
  o.start(when);
  o.stop(when + dur + 0.05);
  return o;
}

function noise(ctx: AudioContext, dest: AudioNode, when: number, dur: number) {
  const len = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(dest);
  src.start(when);
  return src;
}

export const SYNTHS: Record<string, Synth> = {
  /** Spring "boing": sine dropping in pitch with vibrato. */
  sfx_boing(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const p = cue.pitch ?? 1;
    const g = envGain(ctx, out, when, 0.5 * v, 0.01, 0.6);
    const o = osc(ctx, 'sine', g, when, 0.65);
    o.frequency.setValueAtTime(220 * p, when);
    o.frequency.exponentialRampToValueAtTime(520 * p, when + 0.08);
    o.frequency.exponentialRampToValueAtTime(160 * p, when + 0.6);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 18;
    lfoGain.gain.value = 40 * p;
    lfo.connect(lfoGain).connect(o.frequency);
    lfo.start(when);
    lfo.stop(when + 0.7);
  },

  /** Soft "bẹp": low thump + filtered noise burst. */
  sfx_splat(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const g = envGain(ctx, out, when, 0.8 * v, 0.005, 0.25);
    const o = osc(ctx, 'sine', g, when, 0.3);
    o.frequency.setValueAtTime(140, when);
    o.frequency.exponentialRampToValueAtTime(45, when + 0.25);
    const ng = envGain(ctx, out, when, 0.35 * v, 0.003, 0.18);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    lp.connect(ng);
    noise(ctx, lp, when, 0.25);
  },

  /** Small bounce "bop". */
  sfx_bop(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const p = cue.pitch ?? 1;
    const g = envGain(ctx, out, when, 0.6 * v, 0.004, 0.12);
    const o = osc(ctx, 'sine', g, when, 0.15);
    o.frequency.setValueAtTime(330 * p, when);
    o.frequency.exponentialRampToValueAtTime(180 * p, when + 0.12);
  },

  /** Sparkle "ting!" when Mochi's eyes light up. */
  sfx_ting(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    for (const [f, d] of [
      [1760, 0],
      [2637, 0.06],
    ]) {
      const g = envGain(ctx, out, when + d, 0.3 * v, 0.003, 0.7);
      osc(ctx, 'triangle', g, when + d, 0.75).frequency.value = f;
    }
  },

  /** Wind chime for Bé Mây: a few random-ish high bell notes. */
  sfx_chime(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const notes = [1568, 2093, 1760, 2349, 1976];
    notes.forEach((f, i) => {
      const at = when + i * 0.13;
      const g = envGain(ctx, out, at, 0.18 * v, 0.003, 1.2);
      osc(ctx, 'sine', g, at, 1.25).frequency.value = f;
    });
  },

  /** "Hựựự..." charge-up: buzzy tone rising in pitch over `duration`. */
  sfx_charge(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.25 * v, when + 0.15);
    g.gain.setValueAtTime(0.25 * v, when + dur - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    lp.connect(g).connect(out);
    const o = osc(ctx, 'sawtooth', lp, when, dur);
    o.frequency.setValueAtTime(180, when);
    o.frequency.exponentialRampToValueAtTime(520, when + dur);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 11;
    lfoGain.gain.value = 12;
    lfo.connect(lfoGain).connect(o.frequency);
    lfo.start(when);
    lfo.stop(when + dur);
  },

  /** "Phù~" inflate: rising airy noise. */
  sfx_inflate(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 1.2;
    const g = envGain(ctx, out, when, 0.4 * v, dur * 0.7, dur * 0.3);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(300, when);
    bp.frequency.exponentialRampToValueAtTime(1800, when + dur);
    bp.connect(g);
    noise(ctx, bp, when, dur);
  },

  /** Mochi's happy "mo~": two-note vocal-ish blip. */
  sfx_mochi_happy(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const p = cue.pitch ?? 1;
    const g = envGain(ctx, out, when, 0.35 * v, 0.03, 0.45);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    lp.connect(g);
    const o = osc(ctx, 'triangle', lp, when, 0.5);
    o.frequency.setValueAtTime(587 * p, when);
    o.frequency.linearRampToValueAtTime(784 * p, when + 0.12);
    o.frequency.linearRampToValueAtTime(659 * p, when + 0.45);
  },

  /** Balloon "PỐP": sharp click + bright noise burst. */
  sfx_pop(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1200;
    hp.connect(envGain(ctx, out, when, 0.9 * v, 0.001, 0.09));
    noise(ctx, hp, when, 0.12);
    const g = envGain(ctx, out, when, 0.5 * v, 0.001, 0.05);
    const o = osc(ctx, 'square', g, when, 0.06);
    o.frequency.setValueAtTime(900, when);
    o.frequency.exponentialRampToValueAtTime(200, when + 0.05);
  },

  /** Cartoon falling whistle "fiuuuu...": slow downward slide. */
  sfx_fall_whistle(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.25 * v, when + 0.05);
    g.gain.setValueAtTime(0.25 * v, when + dur - 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    g.connect(out);
    const o = osc(ctx, 'sine', g, when, dur);
    o.frequency.setValueAtTime(2000, when);
    o.frequency.exponentialRampToValueAtTime(350, when + dur);
  },

  /** Sparrow "chíp?": two quick rising blips. */
  sfx_chirp(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const p = cue.pitch ?? 1;
    [0, 0.13].forEach((d, i) => {
      const at = when + d;
      const g = envGain(ctx, out, at, 0.25 * v, 0.004, 0.08);
      const o = osc(ctx, 'sine', g, at, 0.1);
      o.frequency.setValueAtTime(2600 * p, at);
      o.frequency.exponentialRampToValueAtTime((i ? 4200 : 3400) * p, at + 0.08);
    });
  },

  /** "Cộp": hard wooden knock of an apple hitting the ground. */
  sfx_cop(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const g = envGain(ctx, out, when, 0.8 * v, 0.002, 0.12);
    const o = osc(ctx, 'sine', g, when, 0.15);
    o.frequency.setValueAtTime(820, when);
    o.frequency.exponentialRampToValueAtTime(420, when + 0.08);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2200;
    bp.Q.value = 3;
    bp.connect(envGain(ctx, out, when, 0.5 * v, 0.001, 0.05));
    noise(ctx, bp, when, 0.07);
  },

  /** "Tạch tạch tạch": tiny running footsteps. */
  sfx_steps(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const n = Math.round((cue.duration ?? 0.8) / 0.11);
    for (let i = 0; i < n; i++) {
      const at = when + i * 0.11;
      const g = envGain(ctx, out, at, 0.35 * v, 0.001, 0.035);
      osc(ctx, 'square', g, at, 0.05).frequency.value = i % 2 ? 1300 : 1100;
    }
  },

  /** Placeholder deadpan voice: a flat low "Ờ." */
  sfx_o(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const g = envGain(ctx, out, when, 0.35 * v, 0.04, 0.35);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    lp.connect(g);
    const o = osc(ctx, 'sawtooth', lp, when, 0.4);
    o.frequency.setValueAtTime(140, when);
    o.frequency.linearRampToValueAtTime(128, when + 0.38);
  },

  /** Placeholder "Hử?": short rising question blip. */
  sfx_hu(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const g = envGain(ctx, out, when, 0.35 * v, 0.02, 0.28);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1200;
    lp.connect(g);
    const o = osc(ctx, 'sawtooth', lp, when, 0.32);
    o.frequency.setValueAtTime(150, when);
    o.frequency.exponentialRampToValueAtTime(300, when + 0.28);
  },

  /** "Haizz": a long sigh (breathy noise falling in pitch). */
  sfx_haizz(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 1;
    const g = envGain(ctx, out, when, 0.35 * v, dur * 0.25, dur * 0.75);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 2;
    bp.frequency.setValueAtTime(1600, when);
    bp.frequency.exponentialRampToValueAtTime(500, when + dur);
    bp.connect(g);
    noise(ctx, bp, when, dur);
  },
};
