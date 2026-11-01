// Hand-drawn stroke helpers: wobbly ("boiling") polylines traced as smooth curves.
// Every stroke gets a stable id so its wobble only changes when the boil seed changes,
// which reproduces the classic hand-animation "line boil" (2-3 redraws cycling).

export type Pt = [number, number];

const TAU = Math.PI * 2;

function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export class Sketch {
  /** Boil seed: change it a few times per second to make the lines shimmer. */
  seed = 0;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public ink: string,
    public lineWidth: number,
  ) {}

  /** Smooth periodic noise in [-1, 1] for stroke `id` at path position u (0..1). */
  noise(id: number, u: number, channel = 0): number {
    const k = this.seed * 101 + id * 17 + channel * 7;
    const p1 = hash(k) * TAU;
    const p2 = hash(k + 3.3) * TAU;
    return 0.6 * Math.sin(TAU * 2 * u + p1) + 0.4 * Math.sin(TAU * 5 * u + p2);
  }

  /** Small per-stroke random value in [-1, 1] (e.g. to nudge an eye dot). */
  jitter(id: number, channel = 0): number {
    return hash(this.seed * 101 + id * 17 + channel * 7 + 0.5) * 2 - 1;
  }

  wobble(pts: Pt[], id: number, amp: number): Pt[] {
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

  line(pts: Pt[], id: number, opts: { amp?: number; width?: number; color?: string } = {}): void {
    const c = this.ctx;
    this.trace(this.wobble(pts, id, opts.amp ?? 1.5), false);
    c.lineWidth = opts.width ?? this.lineWidth;
    c.strokeStyle = opts.color ?? this.ink;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.stroke();
  }

  /** Outlined round-capped tube along pts: stubby legs, noodle arms, the stem. */
  tube(pts: Pt[], id: number, width: number, fill: string, amp = 1.2): void {
    const c = this.ctx;
    this.trace(this.wobble(pts, id, amp), false);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = this.ink;
    c.lineWidth = width + this.lineWidth * 2;
    c.stroke();
    c.strokeStyle = fill;
    c.lineWidth = width;
    c.stroke();
  }

  /** Slightly wobbly filled ellipse (eye dots, blush). */
  blob(x: number, y: number, rx: number, ry: number, id: number, fill: string, amp = 0.8): void {
    const pts: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]);
    }
    this.trace(this.wobble(pts, id, amp), true);
    this.ctx.fillStyle = fill;
    this.ctx.fill();
  }
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
