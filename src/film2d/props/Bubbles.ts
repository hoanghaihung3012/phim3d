// Comic-strip speech bubbles: white rounded boxes with a thick ink outline, hand-written
// CAPITAL letters and a tail pointing at the speaker. Drawn in screen space so the text
// keeps its size in every shot. `shout` gives a spiky outline (the fierce moments).
import { FILM } from '../../config/film';
import type { Pt, Sketch } from '../doodle/Sketch';
import { FONT_FAMILY, LW } from '../doodle/style';

export interface Bubble {
  t0: number;
  t1: number;
  text: string;
  /** World point the tail points at (evaluated every frame, so it follows the speaker). */
  at: () => Pt;
  /** Bubble center offset from the anchor, in screen px. */
  dx?: number;
  dy?: number;
  size?: number;
  shout?: boolean;
  /** Bubble without a tail. */
  noTail?: boolean;
  /** Fixed screen position (fractions of the frame) instead of following `at`; no tail. */
  screen?: Pt;
}

/** Screen margins (px) bubbles are kept inside, e.g. a Reels safe zone. */
export interface SafeMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export class Bubbles {
  list: Bubble[] = [];
  /** Bubbles are clamped inside these margins (default: 24 px all round). */
  safe: SafeMargins = { left: 24, top: 24, right: 24, bottom: 24 };

  add(b: Bubble): void {
    this.list.push(b);
  }

  draw(sk: Sketch, t: number, camera: DOMMatrix): void {
    const c = sk.ctx;
    for (const [i, b] of this.list.entries()) {
      if (t < b.t0 || t >= b.t1) continue;
      const [wx, wy] = b.at();
      const a = camera.transformPoint(new DOMPoint(wx, wy));
      const size = b.size ?? 46;
      const lines = b.text.toUpperCase().split('\n');
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.font = `${size}px ${FONT_FAMILY}`;
      const tw = Math.max(...lines.map((l) => c.measureText(l).width));
      const lh = size * 1.12;
      const w = tw + size * 1.3;
      const h = lines.length * lh + size * 0.8;
      // Pop: first drawing slightly bigger.
      const pop = t - b.t0 < 1 / 12 ? 1.08 : 1;
      let cx = b.screen ? b.screen[0] * FILM.width : a.x + (b.dx ?? 0);
      let cy = b.screen ? b.screen[1] * FILM.height : a.y + (b.dy ?? -h / 2 - 50);
      const m = this.safe;
      cx = Math.min(FILM.width - w / 2 - m.right, Math.max(w / 2 + m.left, cx));
      cy = Math.min(FILM.height - h / 2 - m.bottom, Math.max(h / 2 + m.top, cy));

      c.save();
      c.translate(cx, cy);
      c.scale(pop, pop);
      const box = b.shout ? spiky(w * 0.62, h * 0.72) : rounded(w / 2, h / 2, Math.min(h / 2, 40));
      const id = 9000 + i * 7;
      const tail: Pt[] = [];
      if (!b.noTail && !b.screen) {
        const tx = a.x - cx;
        const ty = a.y - cy;
        const len = Math.hypot(tx, ty) || 1;
        const stop = Math.max(0, len - 34);
        const ux = tx / len;
        const uy = ty / len;
        const base = Math.min(w, h) * 0.18;
        // Tail starts inside the box so the joint is hidden by the fill.
        const sx = ux * Math.min(w, h) * 0.25;
        const sy = uy * Math.min(w, h) * 0.25;
        tail.push([sx - uy * base, sy + ux * base], [ux * stop, uy * stop], [sx + uy * base, sy - ux * base]);
      }
      // Outline pass (double width, half gets covered by the fill), then fill pass.
      if (tail.length) {
        sk.trace(sk.wobble(tail, id, 1), true);
        c.lineWidth = LW * 2 * sk.theme.lineScale;
        c.lineJoin = 'round';
        c.strokeStyle = sk.ink;
        c.stroke();
      }
      sk.trace(sk.wobble(box, id + 1, 1.4), true);
      c.lineWidth = LW * 2 * sk.theme.lineScale;
      c.strokeStyle = sk.ink;
      c.stroke();
      c.fillStyle = '#FFFFFF';
      c.fill();
      if (tail.length) {
        sk.trace(sk.wobble(tail, id, 1), true);
        c.fill();
      }
      c.fillStyle = sk.ink;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = `${size}px ${FONT_FAMILY}`;
      lines.forEach((l, k) => c.fillText(l, sk.jitter(id + k, 1) * 1.2, (k - (lines.length - 1) / 2) * lh + size * 0.04));
      c.restore();
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
}

function rounded(hw: number, hh: number, r: number): Pt[] {
  const pts: Pt[] = [];
  const corners: [number, number, number][] = [
    [hw - r, -hh + r, -Math.PI / 2],
    [hw - r, hh - r, 0],
    [-hw + r, hh - r, Math.PI / 2],
    [-hw + r, -hh + r, Math.PI],
  ];
  for (const [x, y, a0] of corners) {
    for (let i = 0; i <= 4; i++) {
      const a = a0 + (i / 4) * (Math.PI / 2);
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    }
  }
  return pts;
}

function spiky(rx: number, ry: number): Pt[] {
  const pts: Pt[] = [];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = i % 2 ? 1.18 : 0.96;
    pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]);
  }
  return pts;
}
