// Sẻ Bông: a round yellow doodle bird with dot eyes set too far apart. Not evil, just dim.
import { Sketch, ellipse, quad, type Pt } from '../doodle/Sketch';
import { COLORS, INK, LW } from '../doodle/style';
import type { Balloons2D } from '../props/Balloons2D';

const ID = { body: 201, wing: 202, beak: 203, eyeL: 204, eyeR: 205, legL: 206, legR: 207, tail: 208, stars: 210 };

export class Sparrow2D {
  /** Feet position. */
  x = 0;
  y = 0;
  scale = 0.55;
  /** Facing: 1 right, -1 left. */
  dir = -1;
  visible = 0;
  headTilt = 0;
  /** Wings flapping (0/1). */
  flap = 0;
  /** 0..1 lean forward to peck. */
  peck = 0;
  lookX = 0;
  /** Show legs (perched / standing). */
  legs = 1;
  sx = 1;
  sy = 1;
  /** Dizzy stars after being smacked. */
  dizzy = 0;
  /** When > 0, sits on top of balloon (perch - 1) and ignores x / y. */
  perch = 0;
  balloons?: Balloons2D;

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    let [x, y] = [this.x, this.y];
    if (this.perch > 0.5 && this.balloons) [x, y] = this.balloons.topWorld(Math.round(this.perch) - 1, t);

    c.save();
    c.translate(x, y);
    c.scale(this.scale * this.dir, this.scale);
    // Peck pivots on the feet.
    c.rotate(this.peck * 0.7);
    c.scale(this.sx, this.sy);
    const by = -70; // body center

    if (this.legs > 0.5) {
      for (const [lx, id] of [[-14, ID.legL], [14, ID.legR]] as const) {
        sk.line([[lx, by + 40], [lx, -2]], id, { width: LW * 0.6 });
        sk.line([[lx - 9, 0], [lx, -3], [lx + 9, 0]], id + 20, { width: LW * 0.5 });
      }
    }
    // Tail feathers (behind).
    sk.shape([[-50, by - 4], [-92, by - 30], [-86, by - 4], [-96, by + 12], [-50, by + 14]], ID.tail, {
      fill: COLORS.sparrowShade,
      amp: 1,
    });
    // Round body.
    sk.shape(ellipse(0, by, 62, 56, 28), ID.body, { fill: COLORS.sparrow, amp: 1.2 });

    // Head tilt only moves the face features (the bird is one round ball).
    c.save();
    c.translate(20, by - 10);
    c.rotate(this.headTilt);
    const lx = this.lookX * 6;
    sk.blob(-6 + lx, -12, 7, 9, ID.eyeL, INK);
    sk.blob(34 + lx, -14, 7, 9, ID.eyeR, INK);
    const beak: Pt[] = [[38, 4], [70, 12], [38, 20]];
    sk.shape(beak, ID.beak, { fill: COLORS.beak, width: LW * 0.7, amp: 0.6 });
    c.restore();

    // Wing.
    const flapA = this.flap > 0.5 ? Math.sin(t * 40) * 0.9 - 0.4 : 0.15;
    c.save();
    c.translate(-14, by - 4);
    c.rotate(-flapA);
    sk.shape(ellipse(-16, 6, 32, 20, 16), ID.wing, { fill: COLORS.sparrowShade, width: LW * 0.8, amp: 0.8 });
    c.restore();

    if (this.dizzy > 0) {
      for (let i = 0; i < 3; i++) {
        const a = t * 5 + (i * Math.PI * 2) / 3;
        const sxp = Math.cos(a) * 50;
        const syp = by - 90 + Math.sin(a) * 14;
        sk.line(quad([sxp - 10, syp], [sxp, syp - 12], [sxp + 10, syp], 4), ID.stars + i, { width: LW * 0.6 });
        sk.line(quad([sxp - 10, syp], [sxp, syp + 12], [sxp + 10, syp], 4), ID.stars + 5 + i, { width: LW * 0.6 });
      }
    }
    c.restore();
  }
}
