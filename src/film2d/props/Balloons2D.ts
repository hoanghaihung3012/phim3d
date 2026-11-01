// Three pastel balloons on one bunch of strings. Pops are scheduled by time so seeking is exact.
import { Sketch, ellipse, quad, type Pt } from '../doodle/Sketch';
import { COLORS, LW } from '../doodle/style';
import type { Apple2D } from '../characters/Apple2D';

const OFFSETS: Pt[] = [[-80, -250], [10, -300], [95, -240]];
const RX = 52;
const RY = 62;
const ID = { string: 301, body: 310, shine: 320, knot: 330, burst: 340 };

export class Balloons2D {
  /** String knot position when not held by the apple. */
  x = 0;
  y = 0;
  scale = 0.55;
  visible = 0;
  /** 1 = strings end at Táo's mouth. */
  held = 0;
  apple?: Apple2D;
  /** Film time at which each balloon pops (Infinity = never). */
  popAt: number[] = [Infinity, Infinity, Infinity];

  anchor(t: number): Pt {
    if (this.held > 0.5 && this.apple) return this.apple.mouthWorld(t);
    return [this.x, this.y];
  }

  private center(i: number, t: number): Pt {
    const [ax, ay] = this.anchor(t);
    const [ox, oy] = OFFSETS[i];
    return [ax + (ox + Math.sin(t * 1.6 + i * 2) * 8) * this.scale, ay + (oy + Math.sin(t * 2.1 + i) * 6) * this.scale];
  }

  /** World point on top of balloon i (the sparrow perches there). */
  topWorld(i: number, t: number): Pt {
    const [x, y] = this.center(i, t);
    return [x, y - RY * this.scale];
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    const [ax, ay] = this.anchor(t);
    for (let i = 0; i < 3; i++) {
      const since = t - this.popAt[i];
      if (since > 0.35) continue; // gone
      const [bx, by] = this.center(i, t);
      const s = this.scale;
      if (since >= 0 && since > 0.1) {
        // Burst lines for a moment after the pop.
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          const r0 = RX * s * 0.9;
          const r1 = RX * s * 1.6;
          sk.line([[bx + Math.cos(a) * r0, by + Math.sin(a) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]], ID.burst + k, {
            width: LW * 0.7,
          });
        }
        continue;
      }
      const grow = since >= 0 ? 1.2 : 1;
      const bottom: Pt = [bx, by + RY * s * grow];
      sk.line(quad([ax, ay], [(ax + bottom[0]) / 2 + 10 * s, (ay + bottom[1]) / 2], bottom, 7), ID.string + i, {
        width: LW * 0.4,
      });
      c.save();
      c.translate(bx, by);
      c.scale(s * grow, s * grow);
      sk.shape([[0, RY - 2], [-9, RY + 12], [9, RY + 12]], ID.knot + i, { fill: COLORS.balloons[i], width: LW * 0.7, amp: 0.5 });
      sk.shape(ellipse(0, 0, RX, RY, 24), ID.body + i, { fill: COLORS.balloons[i], amp: 1.2 });
      sk.line(quad([-30, -18], [-28, -38], [-12, -46], 5), ID.shine + i, { width: LW * 0.9, color: '#FFFFFF' });
      c.restore();
    }
  }
}
