/** Easing functions: map progress x in [0,1] to eased progress. */
export type EaseFn = (x: number) => number;

const c1 = 1.70158;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;

export const easings = {
  linear: (x: number) => x,
  /** Holds the previous value, then jumps at the key time. Use for camera cuts. */
  step: (x: number) => (x >= 1 ? 1 : 0),
  inQuad: (x: number) => x * x,
  outQuad: (x: number) => 1 - (1 - x) * (1 - x),
  inOutQuad: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  inCubic: (x: number) => x * x * x,
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  inOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  inBack: (x: number) => c3 * x * x * x - c1 * x * x,
  outBack: (x: number) => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),
  outElastic: (x: number) =>
    x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,
  outBounce: (x: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) return n1 * x * x;
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  },
} satisfies Record<string, EaseFn>;

export type EaseName = keyof typeof easings;

export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
