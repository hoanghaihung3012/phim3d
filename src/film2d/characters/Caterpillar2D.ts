// Sâu: Táo's pet caterpillar. Pale green, a few round segments, two little antennae with
// dot tips, dot eyes and blush. Never talks (its bubbles only ever say "...").
// Faces right (+x); flip = -1 faces left. Origin: ground under the head.
import { Sketch, ellipse, type Pt } from '../doodle/Sketch';
import { INK, LW } from '../doodle/style';
import { FACE_EYES, FACE_MOUTHS, drawBlush, drawEye, drawMouth, eyeOf, mouthOf } from './face';

const C = { body: '#C9EFA2', shade: '#B0DF84', blush: '#FF9DB0' };
const SEGMENTS = 5;

export class Caterpillar2D {
  readonly eyeSet = FACE_EYES;
  readonly mouthSet = FACE_MOUTHS;
  x = 0;
  y = 0;
  scale = 1;
  flip = 1;
  visible = 1;
  eyes = 0;
  mouth = 0;
  lookX = 0;
  blush = 1;
  blink = 1;
  /** Crawl wave amount (0 still, 1 inching along). */
  wiggle = 0;
  /** Head raised (0 lying, 1 standing up curious). */
  rear = 0;
  /** Antenna droop (-1) / perk (1). */
  perk = 0;

  headTop(): Pt {
    return [this.x, this.y - (78 + this.rear * 46) * this.scale];
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    c.save();
    c.setTransform(sk.camera.multiply(new DOMMatrix().translate(this.x, this.y).scale(this.scale * this.flip, this.scale)));
    // Tail first, head last.
    for (let i = SEGMENTS - 1; i >= 1; i--) {
      const r = 23 - i * 1.6;
      const bob = this.wiggle * 10 * Math.max(0, Math.sin(t * 9 - i * 0.9));
      const x = -i * 31 + this.wiggle * 4 * Math.sin(t * 9 - i * 0.9);
      sk.shape(ellipse(x, -r - bob, r, r, 14), 6000 + i, { fill: i % 2 ? C.body : C.shade, width: LW * 0.8, amp: 0.8 });
      sk.line([[x - 6, -2], [x - 6, 4]], 6010 + i, { width: LW * 0.6, amp: 0.3 });
    }
    const hx = 6;
    const hy = -34 - this.rear * 46 - this.wiggle * 6 * Math.max(0, Math.sin(t * 9));
    // Neck to raise the head.
    if (this.rear > 0.05) sk.tube([[-4, -22], [hx, hy + 14]], 6020, 34, C.body, 0.6);
    // Antennae.
    for (const s of [-1, 1]) {
      const a = 0.35 * s - this.perk * 0.15 * s;
      const base: Pt = [hx + s * 10, hy - 26];
      const tip: Pt = [base[0] + Math.sin(a) * 30 + 4, base[1] - Math.cos(a) * (30 + this.perk * 6) + (this.perk < 0 ? 18 : 0)];
      sk.line([base, [(base[0] + tip[0]) / 2 + s * 3, (base[1] + tip[1]) / 2], tip], 6022 + s, { width: LW * 0.6, amp: 0.5 });
      sk.blob(tip[0], tip[1], 6, 6, 6025 + s, INK);
    }
    sk.shape(ellipse(hx, hy, 32, 30, 18), 6028, { fill: C.body });
    let eyes = eyeOf(this.eyes);
    if (this.blink > 0.5 && eyes === 'dot' && (t + 2.2) % 2.9 < 0.1) eyes = 'closed';
    const fx = hx + this.lookX * 6;
    drawBlush(sk, fx + 2, hy + 10, 18, 8, this.blush, C.blush, 6030);
    drawEye(sk, eyes, fx - 7, hy - 4, 5, -1, 6032);
    drawEye(sk, eyes, fx + 11, hy - 4, 5, 1, 6033);
    drawMouth(sk, mouthOf(this.mouth, 0, t), fx + 2, hy + 12, 6, 6034);
    c.restore();
  }
}
