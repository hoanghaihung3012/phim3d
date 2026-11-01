// Background doodles drawn with parallax: a sun and faceless outline clouds spread upward,
// so rising shots (balloons, Bé Mây) show the sky sliding past.
import { Sketch, rand, scallop } from '../doodle/Sketch';
import { COLORS, LW } from '../doodle/style';

const ID = { sun: 701, rays: 702, cloud: 720 };

export class Sky2D {
  /** Sunset tint 0..1. */
  dusk = 0;
  /** Extra horizontal drift of the background clouds (flying scenes). */
  drift = 0;

  /** Called with the camera already applied at the sky's parallax. */
  drawFar(sk: Sketch, t: number): void {
    // Sun.
    const sx = 760;
    const sy = -380;
    sk.shape(scallop(sx, sy, 70, 70, 1, 0, 32), ID.sun, { fill: this.dusk > 0.5 ? '#FFC8A8' : COLORS.sun, amp: 1 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      sk.line(
        [[sx + Math.cos(a) * 92, sy + Math.sin(a) * 92], [sx + Math.cos(a) * 122, sy + Math.sin(a) * 122]],
        ID.rays + i,
        { width: LW * 0.7 },
      );
    }
    void t;
  }

  drawMid(sk: Sketch, t: number): void {
    const c = sk.ctx;
    for (let i = 0; i < 40; i++) {
      const span = 5200;
      const baseX = -1800 + rand(i) * span;
      const x = ((baseX - this.drift * (0.6 + rand(i + 9) * 0.4) + t * 6 + 1800) % span + span) % span - 1800;
      const y = -300 - rand(i + 50) * 2600;
      const w = 90 + rand(i + 70) * 80;
      const pts = scallop(x, y, w, w * 0.45, 5 + Math.floor(rand(i + 3) * 3), 0.2, 48);
      sk.trace(sk.wobble(pts, ID.cloud + i, 1.4), true);
      c.fillStyle = sk.paint(this.dusk > 0.5 ? '#FFF4EE' : '#FFFFFF');
      c.fill();
      c.lineWidth = sk.lw(LW * 0.8);
      c.strokeStyle = sk.ink;
      c.stroke();
    }
  }
}
