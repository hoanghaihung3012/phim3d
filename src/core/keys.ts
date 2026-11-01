import { easings, lerp, type EaseName } from './easing';
import type { KeyTuple } from './Timeline';

/**
 * "On twos/threes" animation: samples a move from v0 to v1 at a low frame rate
 * (default 12 fps) and holds each pose with 'step', for a choppy hand-made feel.
 */
export function steppedKeys(t0: number, t1: number, v0: number, v1: number, ease: EaseName = 'linear', fps = 12): KeyTuple[] {
  const keys: KeyTuple[] = [[t0, v0]];
  const n = Math.max(1, Math.round((t1 - t0) * fps));
  for (let i = 1; i <= n; i++) {
    const x = i / n;
    keys.push([t0 + (t1 - t0) * x, lerp(v0, v1, easings[ease](x)), 'step']);
  }
  return keys;
}
