import { clamp01, easings, lerp, type EaseName } from './easing';

/**
 * A keyframe: at absolute film time `t` (seconds) the property equals `v`.
 * `ease` shapes the segment ARRIVING at this key (from the previous key).
 */
export interface Key {
  t: number;
  v: number;
  ease?: EaseName;
}

/** Shorthand tuple accepted by Timeline.key(): [t, value, ease?] */
export type KeyTuple = [t: number, v: number, ease?: EaseName];

type Target = Record<string, unknown>;

class Track {
  private keys: Key[] = [];

  constructor(
    readonly target: Target,
    readonly prop: string,
  ) {}

  add(keys: Key[]) {
    this.keys.push(...keys);
    this.keys.sort((a, b) => a.t - b.t);
  }

  get start() {
    return this.keys[0]?.t ?? 0;
  }

  get end() {
    return this.keys[this.keys.length - 1]?.t ?? 0;
  }

  /** Pure function of t: no accumulated state, so seeking is always exact. */
  evaluate(t: number): number {
    const k = this.keys;
    if (t <= k[0].t) return k[0].v;
    const last = k[k.length - 1];
    if (t >= last.t) return last.v;
    // Binary search for the segment [a, b] containing t.
    let lo = 0;
    let hi = k.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (k[mid].t <= t) lo = mid;
      else hi = mid;
    }
    const a = k[lo];
    const b = k[hi];
    const x = clamp01((t - a.t) / (b.t - a.t));
    return lerp(a.v, b.v, easings[b.ease ?? 'inOutSine'](x));
  }

  apply(t: number) {
    this.target[this.prop] = this.evaluate(t);
  }
}

/** A procedural update that runs every frame after keyframes are applied. */
export type UpdateHook = (t: number) => void;

export interface Marker {
  t: number;
  label: string;
}

/**
 * The film's master timeline, driven by ABSOLUTE time.
 * `evaluate(t)` sets every animated property for time t, so any frame can be
 * reproduced exactly (needed for seek-while-debugging and frame-exact export).
 *
 * Keys for the same (target, prop) are merged into one track even when they
 * come from different scenes, so scenes never fight over a property.
 */
export class Timeline {
  private tracks = new Map<Target, Map<string, Track>>();
  private hooks: UpdateHook[] = [];
  readonly markers: Marker[] = [];
  duration = 0;

  /** Animate `target[prop]` with keyframes: tl.key(mochi, 'squash', [[14, 1], [15.5, 0.5, 'outQuad']]) */
  key<T extends object>(target: T, prop: keyof T & string, keys: KeyTuple[]): this {
    const tgt = target as unknown as Target;
    let byProp = this.tracks.get(tgt);
    if (!byProp) {
      byProp = new Map();
      this.tracks.set(tgt, byProp);
    }
    let track = byProp.get(prop);
    if (!track) {
      track = new Track(tgt, prop);
      byProp.set(prop, track);
    }
    track.add(keys.map(([t, v, ease]) => ({ t, v, ease })));
    this.duration = Math.max(this.duration, track.end);
    return this;
  }

  /** Register a procedural per-frame update (blinks, bobbing, wobble...). */
  onUpdate(hook: UpdateHook): this {
    this.hooks.push(hook);
    return this;
  }

  /** Named marker (scene start etc.) shown in the HUD. */
  mark(t: number, label: string): this {
    this.markers.push({ t, label });
    this.markers.sort((a, b) => a.t - b.t);
    return this;
  }

  markerAt(t: number): Marker | undefined {
    let found: Marker | undefined;
    for (const m of this.markers) if (m.t <= t) found = m;
    return found;
  }

  evaluate(t: number) {
    for (const byProp of this.tracks.values()) for (const track of byProp.values()) track.apply(t);
    for (const hook of this.hooks) hook(t);
  }
}
