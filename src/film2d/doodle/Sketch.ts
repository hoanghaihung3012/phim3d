// Hand-drawn stroke helpers for the 2D film.
// - Every stroke gets a stable id; its wobble only changes when `seed` changes, which
//   reproduces the hand-animation "line boil" (a few redraws cycling).
// - Line widths and wobble amplitudes are given in SCREEN pixels, so outlines keep the
//   same thickness in wide shots and close-ups (like a real pen on paper).
import { INK, LW } from './style';

export type Pt = [number, number];

const TAU = Math.PI * 2;

function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export class Sketch {
  /** Boil seed: changes a few times per second. */
  seed = 0;
  /** Camera matrix (world -> canvas pixels); lets objects convert local points to world. */
  camera = new DOMMatrix();
  private cameraInv = new DOMMatrix();

  constructor(readonly ctx: CanvasRenderingContext2D) {}

  setCamera(m: DOMMatrix): void {
    this.camera = m;
    this.cameraInv = m.inverse();
    this.ctx.setTransform(m);
  }

  /** Current local -> screen scale factor. */
  scaleNow(): number {
    const m = this.ctx.getTransform();
    return Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
  }

  /** Converts screen pixels to current local units. */
  px(n: number): number {
    return n / this.scaleNow();
  }

  /** Local point (current transform) -> world point (camera space). */
  toWorld(p: Pt): Pt {
    const q = this.cameraInv.multiply(this.ctx.getTransform()).transformPoint(new DOMPoint(p[0], p[1]));
    return [q.x, q.y];
  }

  /** Smooth periodic noise in [-1, 1] for stroke `id` at path position u (0..1). */
  noise(id: number, u: number, channel = 0): number {
    const k = this.seed * 101 + id * 17 + channel * 7;
    const p1 = hash(k) * TAU;
    const p2 = hash(k + 3.3) * TAU;
    return 0.6 * Math.sin(TAU * 2 * u + p1) + 0.4 * Math.sin(TAU * 5 * u + p2);
  }

  /** Per-stroke random value in [-1, 1]. */
  jitter(id: number, channel = 0): number {
    return hash(this.seed * 101 + id * 17 + channel * 7 + 0.5) * 2 - 1;
  }

  /** Jitters points; amp is in screen px. */
  wobble(pts: Pt[], id: number, ampPx: number): Pt[] {
    const amp = this.px(ampPx);
    const n = pts.length;
    return pts.map(([x, y], i) => {
      const u = i / n;
      return [x + amp * this.noise(id, u, 0), y + amp * this.noise(id, u, 1)];
    });
  }

  /** Traces pts as a smooth curve (quadratic through midpoints). Does not stroke/fill. */
  trace(pts: Pt[], closed: boolean): void {
    const c = this.ctx;
    const n = pts.length;
    const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    c.beginPath();
    if (n < 2) return;
    if (closed) {
      const start = mid(pts[n - 1], pts[0]);
      c.moveTo(start[0], start[1]);
      for (let i = 0; i < n; i++) {
        const m = mid(pts[i], pts[(i + 1) % n]);
        c.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
      }
      c.closePath();
    } else {
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < n - 1; i++) {
        const m = mid(pts[i], pts[i + 1]);
        c.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
      }
      c.lineTo(pts[n - 1][0], pts[n - 1][1]);
    }
  }

  private pen(widthPx: number, color: string): void {
    const c = this.ctx;
    c.lineWidth = this.px(widthPx);
    c.strokeStyle = color;
    c.lineCap = 'round';
    c.lineJoin = 'round';
  }

  /** Open wobbly line. */
  line(pts: Pt[], id: number, opts: { amp?: number; width?: number; color?: string } = {}): void {
    this.trace(this.wobble(pts, id, opts.amp ?? 1.2), false);
    this.pen(opts.width ?? LW, opts.color ?? INK);
    this.ctx.stroke();
  }

  /** Closed wobbly shape with fill and/or outline. */
  shape(pts: Pt[], id: number, opts: { fill?: string; stroke?: boolean; amp?: number; width?: number } = {}): void {
    const c = this.ctx;
    this.trace(this.wobble(pts, id, opts.amp ?? 1.6), true);
    if (opts.fill) {
      c.fillStyle = opts.fill;
      c.fill();
    }
    if (opts.stroke !== false) {
      this.pen(opts.width ?? LW, INK);
      c.stroke();
    }
  }

  /** Outlined round-capped tube (legs, noodle arms, stems, branches). Width is local units. */
  tube(pts: Pt[], id: number, width: number, fill: string, amp = 1): void {
    const c = this.ctx;
    this.trace(this.wobble(pts, id, amp), false);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = INK;
    c.lineWidth = width + this.px(LW) * 2;
    c.stroke();
    c.strokeStyle = fill;
    c.lineWidth = width;
    c.stroke();
  }

  /** Slightly wobbly filled ellipse (eye dots, blush). */
  blob(x: number, y: number, rx: number, ry: number, id: number, fill: string, amp = 0.6): void {
    this.trace(this.wobble(ellipse(x, y, rx, ry, 16), id, amp), true);
    this.ctx.fillStyle = fill;
    this.ctx.fill();
  }
}

export function ellipse(x: number, y: number, rx: number, ry: number, n = 24): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]);
  }
  return pts;
}

/** Samples a quadratic bezier into n points. */
export function quad(a: Pt, ctrl: Pt, b: Pt, n = 8): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const u = 1 - t;
    pts.push([
      u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1],
    ]);
  }
  return pts;
}

/** Scalloped cloud/bush outline: `lobes` bumps around an ellipse, flatter at the bottom. */
export function scallop(x: number, y: number, rx: number, ry: number, lobes: number, depth = 0.12, n = 96): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const bump = 1 + depth * Math.pow(Math.abs(Math.sin((a * lobes) / 2)), 0.6);
    const s = Math.sin(a);
    pts.push([x + Math.cos(a) * rx * bump, y + s * ry * (s > 0 ? 0.8 : bump)]);
  }
  return pts;
}

/** Deterministic pseudo-random in [0, 1) for layout (not boil). */
export function rand(n: number): number {
  return hash(n * 13.37 + 0.123);
}
