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
  /** "Rắc": a dry twig snap (short bright noise click). */
  sfx_snap(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2500;
    hp.connect(envGain(ctx, out, when, 0.9 * v, 0.001, 0.06));
    noise(ctx, hp, when, 0.08);
    const g = envGain(ctx, out, when + 0.03, 0.3 * v, 0.001, 0.04);
    osc(ctx, 'square', g, when + 0.03, 0.05).frequency.value = 1800;
  },

  /** Crickets: pulsed high chirps over `duration` (the awkward-silence gag). */
  sfx_crickets(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 3;
    for (let at = 0; at < dur; at += 0.55) {
      for (let p = 0; p < 3; p++) {
        const s = when + at + p * 0.045;
        const g = envGain(ctx, out, s, 0.12 * v, 0.004, 0.03);
        osc(ctx, 'sine', g, s, 0.04).frequency.value = 4400;
      }
    }
  },

  /** Sad trombone "wah wah wah waaah": four falling notes. */
  sfx_trombone(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const notes = [311, 294, 277, 262];
    notes.forEach((f, i) => {
      const s = when + i * 0.42;
      const len = i === 3 ? 1.0 : 0.36;
      const g = envGain(ctx, out, s, 0.3 * v, 0.03, len);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1100;
      lp.connect(g);
      const o = osc(ctx, 'sawtooth', lp, s, len + 0.05);
      o.frequency.setValueAtTime(f, s);
      if (i === 3) {
        const lfo = ctx.createOscillator();
        const lg = ctx.createGain();
        lfo.frequency.value = 6;
        lg.gain.value = 8;
        lfo.connect(lg).connect(o.frequency);
        lfo.start(s);
        lfo.stop(s + len + 0.1);
      }
    });
  },

  /** "BÉP!": flat slap of a plank (noise burst + low thump). */
  sfx_smack(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const p = cue.pitch ?? 1;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1400 * p;
    bp.Q.value = 0.8;
    bp.connect(envGain(ctx, out, when, 1.0 * v, 0.001, 0.12));
    noise(ctx, bp, when, 0.14);
    const g = envGain(ctx, out, when, 0.7 * v, 0.002, 0.18);
    const o = osc(ctx, 'sine', g, when, 0.2);
    o.frequency.setValueAtTime(180 * p, when);
    o.frequency.exponentialRampToValueAtTime(70 * p, when + 0.18);
  },

  /** "Phụp": soft cushiony landing (low-passed noise puff). */
  sfx_poof(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1200, when);
    lp.frequency.exponentialRampToValueAtTime(200, when + 0.35);
    lp.connect(envGain(ctx, out, when, 0.8 * v, 0.02, 0.35));
    noise(ctx, lp, when, 0.4);
  },

  // ---- "Ảnh gia đình" ------------------------------------------------------

  /** Camera shutter "tách": two dry clicks and a short flash whine. */
  sfx_shutter(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    for (const d of [0, 0.07]) {
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 3000;
      hp.connect(envGain(ctx, out, when + d, 0.8 * v, 0.001, 0.05));
      noise(ctx, hp, when + d, 0.07);
    }
    const g = envGain(ctx, out, when, 0.06 * v, 0.01, 0.35);
    const o = osc(ctx, 'sine', g, when, 0.4);
    o.frequency.setValueAtTime(2400, when);
    o.frequency.exponentialRampToValueAtTime(5200, when + 0.35);
  },

  /** "Hắt xì!": a breathy burst with a vocal "chi" on top. */
  sfx_sneeze(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(3200, when);
    bp.frequency.exponentialRampToValueAtTime(1400, when + 0.35);
    bp.Q.value = 1.2;
    bp.connect(envGain(ctx, out, when, 0.9 * v, 0.01, 0.35));
    noise(ctx, bp, when, 0.4);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1500;
    lp.connect(envGain(ctx, out, when, 0.3 * v, 0.01, 0.2));
    const o = osc(ctx, 'sawtooth', lp, when, 0.22);
    o.frequency.setValueAtTime(260, when);
    o.frequency.exponentialRampToValueAtTime(140, when + 0.2);
  },

  /** Clock-like ticks over `duration` (holding a smile for the video). */
  sfx_ticks(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 3;
    for (let at = 0, i = 0; at < dur; at += 0.5, i++) {
      const g = envGain(ctx, out, when + at, 0.25 * v, 0.002, 0.04);
      osc(ctx, 'square', g, when + at, 0.05).frequency.value = i % 2 ? 1500 : 1900;
    }
  },

  /** Fast-forward "tua tua": quick clicks slowing down over `duration`. */
  sfx_scrub(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 2;
    let at = 0;
    let gap = 0.04;
    while (at < dur) {
      const g = envGain(ctx, out, when + at, 0.2 * v, 0.002, 0.025);
      osc(ctx, 'triangle', g, when + at, 0.04).frequency.value = 2200;
      at += gap;
      gap *= 1.09;
    }
  },

  /** Light ukulele-ish music bed (C - Am - F - G), plucked arpeggios + soft bass. */
  music_bed(ctx, out, when, cue) {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 8;
    const beat = 60 / 112;
    const chords = [
      [261.6, 329.6, 392.0, 523.3],
      [220.0, 261.6, 329.6, 440.0],
      [174.6, 220.0, 261.6, 349.2],
      [196.0, 246.9, 293.7, 392.0],
    ];
    const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, when);
    bus.gain.exponentialRampToValueAtTime(1, when + 0.3);
    bus.gain.setValueAtTime(1, when + Math.max(0.3, dur - 0.4));
    bus.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    bus.connect(out);
    for (let i = 0; i * beat * 0.5 < dur; i++) {
      const at = when + i * beat * 0.5;
      const chord = chords[Math.floor(i / 8) % 4];
      const f = chord[pattern[i % 8]];
      const g = envGain(ctx, bus, at, 0.09 * v, 0.004, 0.32);
      osc(ctx, 'triangle', g, at, 0.36).frequency.value = f * 2;
      if (i % 4 === 0) {
        const bg = envGain(ctx, bus, at, 0.16 * v, 0.01, beat * 1.6);
        osc(ctx, 'sine', bg, at, beat * 1.7).frequency.value = chord[0] / 2;
      }
    }
  },

  sfx_babble_ba: babble(150, 0.13, 'triangle', 0.25),
  sfx_babble_me: babble(290, 0.12, 'triangle', 0.3),
  sfx_babble_nam: babble(360, 0.09, 'triangle', 0.35),
  sfx_babble_vit: babble(420, 0.1, 'square', 0.3),
  /** Táo: low and perfectly flat, like his face. */
  sfx_babble_tao: babble(135, 0.16, 'sawtooth', 0),
};

/**
 * Placeholder "voice": syllable blips around a base pitch (like comic gibberish), so lines
 * have a rhythm before real voice recordings exist. `spread` is the pitch variation.
 */
function babble(base: number, syllable: number, type: OscillatorType, spread: number): Synth {
  return (ctx, out, when, cue) => {
    const v = cue.volume ?? 1;
    const dur = cue.duration ?? 1;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = type === 'square' ? 1800 : 1400;
    lp.connect(out);
    for (let i = 0, at = 0; at < dur; i++, at += syllable) {
      const r = Math.sin(i * 12.9898 + base) * 43758.5453;
      const k = (r - Math.floor(r)) * 2 - 1;
      const f = base * (1 + spread * k) * (at > dur - syllable * 1.5 ? 0.9 : 1);
      const g = envGain(ctx, lp, when + at, 0.22 * v, 0.012, syllable * 0.75);
      const o = osc(ctx, type, g, when + at, syllable * 0.85);
      o.frequency.setValueAtTime(f, when + at);
      o.frequency.linearRampToValueAtTime(f * (spread ? 0.94 : 0.99), when + at + syllable * 0.8);
    }
  };
}
