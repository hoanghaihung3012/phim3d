// The homemade catapult: a lumpy rock and a plank. The plank is keyed directly by its
// center and angle, so it can rest on the rock, tilt, or fly off and smack someone.
import { Sketch, ellipse, type Pt } from '../doodle/Sketch';
import { COLORS, LW } from '../doodle/style';

const ID = { rock: 801, plank: 802, grain: 803 };
export const PLANK_HALF = 250;
export const ROCK_TOP = 92;

export class Seesaw2D {
  rockX = 700;
  rockVisible = 0;
  rockRoll = 0;
  plankVisible = 0;
  /** Plank center and rotation (radians, + = right end down). */
  px = 700;
  py = -ROCK_TOP;
  rot = 0;

  /** Plank resting on the rock with the given tilt. */
  static onRock(rockX: number, rot: number): { px: number; py: number; rot: number } {
    return { px: rockX, py: -ROCK_TOP - 13, rot };
  }

  /** Tilt so one end touches the ground: + right end down. */
  static restTilt(): number {
    return Math.asin((ROCK_TOP + 13) / PLANK_HALF);
  }

  /** World position of the plank's left (-1) or right (+1) end, on its top surface. */
  end(side: -1 | 1): Pt {
    const cx = Math.cos(this.rot);
    const sn = Math.sin(this.rot);
    return [this.px + side * PLANK_HALF * cx + 13 * sn, this.py + side * PLANK_HALF * sn - 13 * cx];
  }

  draw(sk: Sketch): void {
    const c = sk.ctx;
    if (this.rockVisible > 0.5) {
      c.save();
      c.translate(this.rockX, -ROCK_TOP / 2);
      c.rotate(this.rockRoll);
      sk.shape(ellipse(0, 0, 72, ROCK_TOP / 2 + 2, 22), ID.rock, { fill: COLORS.rock, amp: 2.5 });
      sk.line([[-20, -10], [-6, -16], [6, -8]], ID.rock + 50, { width: LW * 0.5 });
      c.restore();
    }
    if (this.plankVisible > 0.5) {
      c.save();
      c.translate(this.px, this.py);
      c.rotate(this.rot);
      const pts: Pt[] = [];
      for (let i = 0; i <= 10; i++) pts.push([-PLANK_HALF + (i / 10) * PLANK_HALF * 2, -13]);
      pts.push([PLANK_HALF + 4, 0]);
      for (let i = 10; i >= 0; i--) pts.push([-PLANK_HALF + (i / 10) * PLANK_HALF * 2, 13]);
      pts.push([-PLANK_HALF - 4, 0]);
      sk.shape(pts, ID.plank, { fill: COLORS.plank, amp: 1.2 });
      sk.line([[-150, -2], [-60, -3], [10, -1]], ID.grain, { width: LW * 0.45 });
      sk.line([[60, 4], [140, 3]], ID.grain + 1, { width: LW * 0.45 });
      c.restore();
    }
  }
}
