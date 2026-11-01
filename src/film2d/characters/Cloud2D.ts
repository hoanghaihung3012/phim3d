// Bé Mây: a soft white doodle cloud with bean eyes and a goofy smile. Always floating.
import { Sketch, ellipse, quad, scallop } from '../doodle/Sketch';
import { COLORS, INK, LW } from '../doodle/style';

const RX = 170;
const RY = 100;
const ID = { body: 101, eyeL: 102, eyeR: 103, mouth: 104, blushL: 105, blushR: 106, arm: 107, shadow: 108 };

export class Cloud2D {
  /** Center of the cloud. */
  x = 0;
  y = 0;
  scale = 0.6;
  sx = 1;
  sy = 1;
  tilt = 0;
  visible = 0;
  /** Floating bob amplitude (local units). */
  bob = 1;
  /** 0 bean dots, 1 happy arcs, 2 closed. */
  eyes = 0;
  /** Waving puff on the right side. */
  wave = 0;
  lookX = 0;
  lookY = 0;
  /** Shadow on the ground under the cloud (0..1), ground at y = 0. */
  shadow = 0;

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    const bobY = Math.sin(t * 2) * 12 * this.bob;

    if (this.shadow > 0) {
      c.save();
      c.globalAlpha = 0.12 * this.shadow;
      c.fillStyle = sk.paint(INK);
      c.beginPath();
      c.ellipse(this.x, 0, RX * this.scale * 1.1, 18 * this.scale + 6, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    c.save();
    c.translate(this.x, this.y + bobY * this.scale);
    c.rotate(this.tilt);
    c.scale(this.scale * this.sx, this.scale * this.sy);

    if (this.wave > 0.5) {
      // A little puff that waves like a hand.
      const a = -0.5 + Math.sin(t * 10) * 0.45;
      const hx = RX * 0.95 + Math.cos(a) * 40;
      const hy = -RY * 0.1 + Math.sin(a) * 60;
      sk.shape(ellipse(hx, hy, 30, 28, 14), ID.arm, { fill: COLORS.cloud, amp: 1 });
    }

    const body = sk.wobble(scallop(0, 0, RX, RY, 9, 0.16), ID.body, 1.6);
    c.save();
    sk.trace(body, true);
    c.fillStyle = sk.paint(COLORS.cloudShade);
    c.fill();
    c.clip();
    c.translate(-18, -18);
    sk.trace(body, true);
    c.fillStyle = sk.paint(COLORS.cloud);
    c.fill();
    c.restore();
    sk.trace(body, true);
    c.lineWidth = sk.lw(LW);
    c.strokeStyle = sk.ink;
    c.lineJoin = 'round';
    c.stroke();

    const lx = this.lookX * 12;
    const ly = this.lookY * 8;
    c.globalAlpha = 0.8;
    sk.blob(-62 + lx * 0.5, 22, 20, 11, ID.blushL, COLORS.blush);
    sk.blob(62 + lx * 0.5, 22, 20, 11, ID.blushR, COLORS.blush);
    c.globalAlpha = 1;

    const eyes = Math.round(this.eyes);
    for (const [s, id] of [[-1, ID.eyeL], [1, ID.eyeR]] as const) {
      const x = s * 40 + lx;
      const y = -6 + ly;
      if (eyes === 0) sk.blob(x, y, 9, 13, id, INK);
      else if (eyes === 1) sk.line(quad([x - 12, y + 5], [x, y - 12], [x + 12, y + 5], 5), id, { width: LW * 0.7 });
      else sk.line(quad([x - 12, y], [x, y + 7], [x + 12, y], 5), id, { width: LW * 0.7 });
    }
    sk.line(quad([lx - 16, 20 + ly], [lx, 38 + ly], [lx + 16, 20 + ly], 6), ID.mouth, { width: LW * 0.6 });
    c.restore();
  }
}
