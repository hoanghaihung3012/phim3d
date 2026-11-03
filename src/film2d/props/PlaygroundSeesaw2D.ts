// A playground seesaw in the comic-strip look: a pastel triangle stand and a long plank with
// a handle near each end. The plank tilts around the top of the stand; riders sit on it at a
// position `u` along the plank (-1 left end, 0 middle, +1 right end), see `seat()`.
import { Sketch, ellipse, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';

const C = { stand: '#A9D4FF', standShade: '#8DC0F2', plank: '#FFB3A7', plankEdge: '#F59A8E', handle: '#FFE58A', bolt: '#FFFFFF' };
const ID = { stand: 8100, plank: 8110, handle: 8120, bolt: 8130 };

/** Half the plank length, plank thickness and the pivot height above the ground (world units). */
export const SEESAW = { half: 360, thick: 30, pivotH: 150 } as const;

export class PlaygroundSeesaw2D {
  /** Pivot x (ground y = 0). */
  x = 0;
  /** Plank rotation (radians, + = right end down). Clamp with `maxTilt()`. */
  rot = 0;

  /** Tilt at which one end rests on the ground (+ right end down). */
  static maxTilt(): number {
    return Math.asin((SEESAW.pivotH - SEESAW.thick / 2) / SEESAW.half);
  }

  /** World point on the top of the plank at position u (-1..1) for a given pivot x and tilt. */
  static seatAt(x: number, rot: number, u: number): Pt {
    const d = u * SEESAW.half;
    const top = SEESAW.thick / 2;
    return [x + d * Math.cos(rot) + top * Math.sin(rot), -SEESAW.pivotH + d * Math.sin(rot) - top * Math.cos(rot)];
  }

  seat(u: number): Pt {
    return PlaygroundSeesaw2D.seatAt(this.x, this.rot, u);
  }

  draw(sk: Sketch): void {
    const c = sk.ctx;
    const { half, thick, pivotH } = SEESAW;
    const x = this.x;
    // Stand: a rounded triangle with a darker inner panel.
    sk.shape([[x - 92, 0], [x - 14, -pivotH + 6], [x + 14, -pivotH + 6], [x + 92, 0]], ID.stand, { fill: C.stand, amp: 1 });
    sk.shape([[x - 46, -8], [x, -pivotH + 54], [x + 46, -8]], ID.stand + 1, { fill: C.standShade, width: LW * 0.6, amp: 0.8 });
    // Plank in its own rotated frame.
    const base = c.getTransform();
    c.setTransform(base.translate(x, -pivotH).rotate((this.rot * 180) / Math.PI));
    const t = thick / 2;
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) pts.push([-half + (i / 12) * half * 2, -t]);
    pts.push([half + 8, -t * 0.4], [half + 8, t * 0.4]);
    for (let i = 12; i >= 0; i--) pts.push([-half + (i / 12) * half * 2, t]);
    pts.push([-half - 8, t * 0.4], [-half - 8, -t * 0.4]);
    sk.shape(pts, ID.plank, { fill: C.plank, amp: 1 });
    sk.line([[-half + 30, t * 0.35], [half - 30, t * 0.35]], ID.plank + 1, { width: LW * 0.45, color: C.plankEdge });
    // Handles: little T bars a bit in from each end.
    for (const s of [-1, 1] as const) {
      const hx = s * (half - 120);
      sk.tube([[hx, -t], [hx, -t - 62]], ID.handle + (s > 0 ? 1 : 0), 14, C.handle, 0.4);
      sk.tube([[hx - 26, -t - 62], [hx + 26, -t - 62]], ID.handle + (s > 0 ? 3 : 2), 14, C.handle, 0.4);
    }
    // Pivot bolt.
    sk.shape(ellipse(0, 0, 13, 13, 12), ID.bolt, { fill: C.bolt, width: LW * 0.6 });
    c.setTransform(base);
  }
}
