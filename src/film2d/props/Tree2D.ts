// The apple tree: pale trunk, scalloped canopy, a few ordinary (faceless) apples and the
// branch Táo hangs from.
import { Sketch, ellipse, quad, scallop, type Pt } from '../doodle/Sketch';
import { COLORS, LW } from '../doodle/style';

const ID = { trunk: 401, canopy: 402, branch: 403, apples: 410, stems: 430, marks: 450 };
const CANOPY_Y = -640;

export class Tree2D {
  x = 0;
  /** World point where Táo's stem meets the branch. */
  anchorX = 190;
  anchorY = -420;
  /** 1 = the branch still holds Táo (draw the twig down to the anchor). */
  holding = 1;
  /** Wind sway amount for the plain apples. */
  wind = 1;

  /** Táo's anchor in world coordinates. */
  anchor(): Pt {
    return [this.x + this.anchorX, this.anchorY];
  }

  draw(sk: Sketch, t: number): void {
    const c = sk.ctx;
    const x = this.x;

    // Trunk with a fork.
    const trunk: Pt[] = [
      [x - 46, 0], [x - 38, -200], [x - 30, -380], [x - 80, -500], [x - 50, -520], [x, -430],
      [x + 50, -520], [x + 80, -500], [x + 30, -380], [x + 38, -200], [x + 46, 0],
    ];
    sk.shape(trunk, ID.trunk, { fill: COLORS.trunk, amp: 1.5 });
    sk.line(quad([x - 10, -120], [x + 6, -170], [x - 4, -230], 5), ID.marks, { width: LW * 0.6 });

    // Branch toward Táo.
    const [ax, ay] = this.anchor();
    sk.tube(quad([x + 120, CANOPY_Y + 150], [ax - 20, ay - 60], [ax, ay + (this.holding > 0.5 ? 0 : -30)], 7), ID.branch, 14, COLORS.trunk);

    // Canopy.
    const canopy = sk.wobble(scallop(x, CANOPY_Y, 330, 210, 11, 0.12), ID.canopy, 2);
    c.save();
    sk.trace(canopy, true);
    c.fillStyle = sk.paint(COLORS.canopyShade);
    c.fill();
    c.clip();
    c.translate(-30, -26);
    sk.trace(canopy, true);
    c.fillStyle = sk.paint(COLORS.canopy);
    c.fill();
    c.restore();
    sk.trace(canopy, true);
    c.lineWidth = sk.lw(LW);
    c.strokeStyle = sk.ink;
    c.lineJoin = 'round';
    c.stroke();
    // A few leaf ticks on the canopy.
    const ticks: Pt[] = [[-180, -60], [-40, -120], [120, -50], [220, 40], [-230, 60], [30, 70]];
    ticks.forEach(([dx, dy], i) =>
      sk.line(quad([x + dx, CANOPY_Y + dy], [x + dx + 12, CANOPY_Y + dy - 14], [x + dx + 26, CANOPY_Y + dy], 4), ID.marks + 1 + i, {
        width: LW * 0.6,
      }),
    );

    // Ordinary apples hanging from the canopy, swaying in the wind.
    const apples: Pt[] = [[-230, 150], [-90, 190], [40, 175], [260, 110]];
    apples.forEach(([dx, dy], i) => {
      const sway = Math.sin(t * 1.8 + i * 1.3) * 0.12 * this.wind;
      c.save();
      c.translate(x + dx, CANOPY_Y + dy);
      c.rotate(sway);
      sk.line([[0, -6], [2, 22]], ID.stems + i, { width: LW * 0.7 });
      sk.shape(ellipse(0, 50, 30, 28, 18), ID.apples + i, { fill: COLORS.plainApple, amp: 0.9 });
      c.restore();
    });
  }
}
