// Round little side characters from comic #11 "Táo bón": Gà (white hen with a red comb),
// Chó (beige puppy with floppy brown ears) and Mèo (grey kitten with pink-lined ears).
// All three are one round ball on two stubby legs, front view, dot eyes and blush, like Vịt
// in the comic-strip look. Origin: ground between the feet.
import { Sketch, ellipse, quad, type Pt } from '../doodle/Sketch';
import { INK, LW } from '../doodle/style';
import { FACE_EYES, FACE_MOUTHS, drawBlush, drawEye, drawMouth, drawSweat, eyeOf, mouthOf } from './face';

export type CritterKind = 'hen' | 'dog' | 'cat';

const PALETTE: Record<CritterKind, { body: string; shade: string; leg: string; extra: string; blush: string }> = {
  hen: { body: '#FFFFFF', shade: '#EDEFF5', leg: '#FFA94D', extra: '#FF6B6B', blush: '#FF9DB0' },
  dog: { body: '#F2D3A6', shade: '#E2BD8A', leg: '#F2D3A6', extra: '#B98256', blush: '#FF9DB0' },
  cat: { body: '#C9CCD8', shade: '#B4B8C8', leg: '#C9CCD8', extra: '#FFB3C6', blush: '#FF9DB0' },
};

/** Ball radius in local units. */
const R = 78;
const CY = -R - 30;

export class Critter2D {
  readonly eyeSet = FACE_EYES;
  readonly mouthSet = FACE_MOUTHS;
  x = 0;
  y = 0;
  scale = 1;
  flip = 1;
  sx = 1;
  sy = 1;
  visible = 1;
  eyes = 0;
  mouth = 0;
  talk = 0;
  lookX = 0;
  blush = 1;
  blink = 1;
  sweat = 0;
  hop = 0;
  /** Walking: legs cycle and the body bobs. */
  walk = 0;
  /** Holding a fruit basket in front (1) or not (0). */
  basket = 0;
  /** Pet look: red collar with a little gold bell. */
  collar = 0;
  /** Front paw raised towards +x (0 down .. 1 held out for a handshake). */
  paw = 0;
  /** Roll angle (radians) around the middle of the ball (a cat rolling over). */
  roll = 0;

  constructor(readonly kind: CritterKind) {}

  headTop(): Pt {
    return [this.x, this.y - (2 * R + 30 + this.hop) * this.scale];
  }

  /** World position of the mouth (where a spoon goes). */
  mouthWorld(): Pt {
    return [this.x + this.lookX * 12 * this.scale * this.flip, this.y + (CY + 30 - this.hop) * this.scale];
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    const p = PALETTE[this.kind];
    const bob = this.walk > 0.5 ? 8 * Math.abs(Math.sin(t * 14)) : 0;
    c.save();
    c.setTransform(
      sk.camera.multiply(new DOMMatrix().translate(this.x, this.y - (this.hop + bob) * this.scale).scale(this.scale * this.flip, this.scale)),
    );
    if (this.roll !== 0) {
      c.translate(0, CY);
      c.rotate(this.roll);
      c.translate(0, -CY);
    }
    // Legs.
    for (const s of [-1, 1]) {
      const dx = this.walk > 0.5 ? 8 * Math.sin(t * 14 + (s > 0 ? Math.PI : 0)) : 0;
      const up = this.walk > 0.5 ? Math.max(0, 8 * Math.cos(t * 14 + (s > 0 ? Math.PI : 0))) : 0;
      if (this.kind === 'hen') {
        sk.tube([[s * 22, -34], [s * 24 + dx, -6 - up]], 5301 + s, 9, p.leg, 0.5);
        sk.line([[s * 24 + dx - 12, -4 - up], [s * 24 + dx, -6 - up], [s * 24 + dx + 12, -4 - up]], 5304 + s, { width: LW * 0.8, color: '#E58A2E' });
      } else {
        sk.tube([[s * 30, -40], [s * 32 + dx, -12 - up]], 5301 + s, 30, p.leg, 0.5);
      }
    }
    const breath = Math.sin(t * 2.6 + this.kind.length);
    c.scale(this.sx * (1 - 0.012 * breath), this.sy * (1 + 0.02 * breath));
    this.drawBack(sk, t, p);
    sk.shape(ellipse(0, CY, R, R * 0.94, 30), 5310, { fill: p.body });
    this.drawFront(sk, t, p);
    this.drawFace(sk, t, p);
    if (this.collar > 0.5) this.drawCollar(sk);
    if (this.paw > 0.01) this.drawPaw(sk, p);
    if (this.basket > 0.5) this.drawBasket(sk);
    if (this.sweat > 0) drawSweat(sk, R * 0.75, CY - R * 0.7 + this.sweat * 20, 12, 5340);
    c.restore();
  }

  /** Parts behind the ball: tail, cat ears. */
  private drawBack(sk: Sketch, t: number, p: (typeof PALETTE)[CritterKind]): void {
    const wag = Math.sin(t * (this.kind === 'dog' ? 10 : 3));
    if (this.kind === 'hen') {
      // Tail feathers fanned up at the back left.
      sk.shape([[-R * 0.8, CY], [-R * 1.25, CY - 40 + wag * 4], [-R * 1.05, CY - 10], [-R * 1.3, CY + 4], [-R * 0.9, CY + 26]], 5311, { fill: p.body, width: LW * 0.85 });
    } else if (this.kind === 'dog') {
      sk.tube(quad([R * 0.7, CY + 30], [R * 1.15, CY + 10], [R * 1.1 + wag * 10, CY - 30], 6), 5311, 18, p.body, 0.6);
    } else {
      sk.tube(quad([-R * 0.7, CY + 40], [-R * 1.3, CY + 20], [-R * 1.15 + wag * 6, CY - 50], 7), 5311, 20, p.body, 0.6);
      for (const s of [-1, 1]) {
        const ear: Pt[] = [[s * R * 0.25, CY - R * 0.8], [s * R * 0.55, CY - R * 1.3], [s * R * 0.8, CY - R * 0.55]];
        sk.shape(ear, 5312 + s, { fill: p.body, width: LW * 0.85 });
        sk.shape([[s * R * 0.38, CY - R * 0.8], [s * R * 0.55, CY - R * 1.12], [s * R * 0.68, CY - R * 0.68]], 5315 + s, { fill: p.extra, stroke: false });
      }
    }
  }

  /** Parts on top of the ball: hen comb, dog ears, cat whiskers. */
  private drawFront(sk: Sketch, t: number, p: (typeof PALETTE)[CritterKind]): void {
    if (this.kind === 'hen') {
      const cx = 0;
      const top = CY - R * 0.9;
      sk.shape([[cx - 26, top + 10], [cx - 22, top - 18], [cx - 8, top - 6], [cx, top - 28], [cx + 10, top - 6], [cx + 24, top - 20], [cx + 26, top + 10]], 5320, { fill: p.extra, width: LW * 0.8 });
    } else if (this.kind === 'dog') {
      const flop = 0.06 * Math.sin(t * 3);
      for (const s of [-1, 1]) {
        const ear: Pt[] = [[s * R * 0.45, CY - R * 0.85], [s * R * 1.05, CY - R * 0.55], [s * R * (1.1 + flop), CY + R * 0.05], [s * R * 0.85, CY + R * 0.15], [s * R * 0.62, CY - R * 0.45]];
        sk.shape(ear, 5320 + s, { fill: p.extra, width: LW * 0.85 });
      }
    }
  }

  private drawFace(sk: Sketch, t: number, p: (typeof PALETTE)[CritterKind]): void {
    const lx = this.lookX * 14;
    let eyes = eyeOf(this.eyes);
    if (this.blink > 0.5 && eyes === 'dot' && (t + this.kind.length * 0.7) % 3.3 < 0.1) eyes = 'closed';
    drawBlush(sk, lx, CY + 18, 50, 14, this.blush, p.blush, 5330);
    drawEye(sk, eyes, lx - 26, CY - 8, 7, -1, 5332);
    drawEye(sk, eyes, lx + 26, CY - 8, 7, 1, 5333);
    const mouth = mouthOf(this.mouth, this.talk, t);
    if (this.kind === 'hen') {
      // Little orange beak; opens for talking / "A~".
      const open = mouth === 'o' || mouth === 'grin' || mouth === 'sneeze';
      sk.shape([[lx - 12, CY + 8], [lx + 12, CY + 8], [lx, CY + 24]], 5334, { fill: '#FFA94D', width: LW * 0.7, amp: 0.4 });
      if (open) sk.shape([[lx - 10, CY + 28], [lx + 10, CY + 28], [lx, CY + 40]], 5335, { fill: '#FFA94D', width: LW * 0.7, amp: 0.4 });
      return;
    }
    // Nose, then the mouth below it.
    sk.blob(lx, CY + 10, 7, 5, 5334, INK);
    if (this.kind === 'cat') {
      for (const s of [-1, 1]) {
        sk.line([[lx + s * 40, CY + 12], [lx + s * 66, CY + 6]], 5336 + s, { width: LW * 0.4 });
        sk.line([[lx + s * 40, CY + 20], [lx + s * 66, CY + 24]], 5338 + s, { width: LW * 0.4 });
      }
    }
    drawMouth(sk, mouth, lx, CY + 24, 9, 5335);
  }

  private drawCollar(sk: Sketch): void {
    const y = CY + R * 0.62;
    sk.line(quad([-R * 0.78, y - 8], [0, y + 16], [R * 0.78, y - 8], 10), 5360, { width: LW * 1.6, color: '#FF6B6B' });
    sk.blob(0, y + 18, 11, 11, 5361, '#FFD84D');
    sk.line([[-6, y + 22], [6, y + 22]], 5362, { width: LW * 0.35 });
  }

  /** One stubby front paw held out to the +x side, rising with `paw`. */
  private drawPaw(sk: Sketch, p: (typeof PALETTE)[CritterKind]): void {
    const k = Math.min(1, this.paw);
    const from: Pt = [R * 0.45, CY + R * 0.55];
    const to: Pt = [R * (0.55 + 0.6 * k), CY + R * (0.6 - 0.55 * k)];
    sk.tube([from, to], 5363, 26, p.leg, 0.5);
    sk.blob(to[0], to[1], 17, 15, 5364, p.leg);
  }

  private drawBasket(sk: Sketch): void {
    const y = CY + 50;
    sk.line(quad([-44, y - 10], [0, y - 80], [44, y - 10], 8), 5350, { width: LW * 0.8 });
    sk.blob(-20, y - 14, 18, 18, 5351, '#FF8C82');
    sk.blob(14, y - 18, 16, 16, 5352, '#FFE16B');
    sk.blob(30, y - 8, 14, 14, 5353, '#9ADB8F');
    sk.shape([[-50, y - 10], [50, y - 10], [40, y + 34], [-40, y + 34]], 5354, { fill: '#E9C49A', width: LW * 0.85 });
    sk.line([[-44, y + 8], [44, y + 8]], 5355, { width: LW * 0.45 });
  }
}
