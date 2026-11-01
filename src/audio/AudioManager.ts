import { AUDIO_ASSETS } from '../config/assets';
import { CUES, type Cue } from './cues';
import { SYNTHS } from './synth';

/**
 * Plays cues as the film time crosses them.
 * - Real samples (config/assets.ts) win; otherwise a synth with the same id plays.
 * - Seeking never floods: only cues crossed during forward playback fire.
 * - Everything goes through `master`, which also feeds a MediaStream for the recorder.
 */
export class AudioManager {
  private ctx?: AudioContext;
  private master?: GainNode;
  private recordDest?: MediaStreamAudioDestinationNode;
  private buffers = new Map<string, AudioBuffer>();
  private warned = new Set<string>();

  constructor(private readonly cues: Cue[] = CUES) {}

  /** Must be called from a user gesture (click) because of autoplay policy. */
  async unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.recordDest = this.ctx.createMediaStreamDestination();
      this.master.connect(this.recordDest);
      void this.loadSamples();
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }

  get stream(): MediaStream | undefined {
    return this.recordDest?.stream;
  }

  private async loadSamples() {
    const ctx = this.ctx!;
    await Promise.all(
      Object.entries(AUDIO_ASSETS).map(async ([id, url]) => {
        if (!url) return;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          this.buffers.set(id, await ctx.decodeAudioData(await res.arrayBuffer()));
        } catch (err) {
          console.warn(`[audio] could not load "${id}" from ${url}, using synth`, err);
        }
      }),
    );
  }

  /**
   * Fire cues with prevT < cue.t <= t. Call once per rendered frame while playing.
   * A big jump (seek) is ignored so scrubbing does not trigger every sound.
   */
  update(prevT: number, t: number) {
    if (!this.ctx || !this.master) return;
    if (t <= prevT || t - prevT > 0.5) return;
    for (const cue of this.cues) {
      if (cue.t > prevT && cue.t <= t) this.play(cue, t - cue.t);
    }
  }

  private play(cue: Cue, lateBy: number) {
    const ctx = this.ctx!;
    const out = this.master!;
    const when = ctx.currentTime;
    const buffer = this.buffers.get(cue.id);
    if (buffer) {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = cue.pitch ?? 1;
      const g = ctx.createGain();
      g.gain.value = cue.volume ?? 1;
      src.connect(g).connect(out);
      src.start(when, Math.min(lateBy, buffer.duration));
      return;
    }
    const synth = SYNTHS[cue.id];
    if (synth) synth(ctx, out, when, cue);
    else if (!this.warned.has(cue.id)) {
      this.warned.add(cue.id);
      console.warn(`[audio] no sample or synth for cue "${cue.id}"`);
    }
  }
}
