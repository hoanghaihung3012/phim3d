// The world is mostly blank paper: one wobbly ground line, grass tufts, a few flowers.
import { Sketch, ellipse, rand, type Pt } from '../doodle/Sketch';
import { COLORS, LW } from '../doodle/style';

const ID = { line: 501, tuft: 600, flower: 800 };
const X0 = -2400;
const X1 = 4400;

export class Ground2D {
  draw(sk: Sketch): void {
    const c = sk.ctx;
    // Draw the ground line in segments so the wobble stays fine-grained along its length.
    const SEG = 600;
    for (let x = X0, i = 0; x < X1; x += SEG, i++) {
      const pts: Pt[] = [];
      for (let k = 0; k <= 8; k++) {
        const px = x + (k / 8) * SEG;
        pts.push([px, Math.sin(px * 0.003) * 6]);
      }
      sk.line(pts, ID.line + i, { amp: 2 });
    }

    // Grass tufts: little "w" marks along the line.
    for (let i = 0; i < 46; i++) {
      const x = X0 + rand(i) * (X1 - X0);
      const s = 0.7 + rand(i + 100) * 0.6;
      const y = Math.sin(x * 0.003) * 6 + 2;
      sk.line(
        [[x - 14 * s, y], [x - 8 * s, y - 16 * s], [x - 2 * s, y], [x + 5 * s, y - 20 * s], [x + 12 * s, y]],
        ID.tuft + i,
        { width: LW * 0.6, amp: 1 },
      );
    }

    // Flowers.
    for (let i = 0; i < 12; i++) {
      const x = X0 + rand(i + 300) * (X1 - X0);
      const y = Math.sin(x * 0.003) * 6;
      const color = [COLORS.balloons[0], COLORS.balloons[1], COLORS.balloons[2]][i % 3];
      sk.line([[x, y], [x + 2, y - 34]], ID.flower + i * 3, { width: LW * 0.6 });
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        c.save();
        sk.shape(ellipse(x + 2 + Math.cos(a) * 10, y - 40 + Math.sin(a) * 10, 8, 8, 10), ID.flower + i * 3 + 1, {
          fill: color,
          width: LW * 0.5,
          amp: 0.4,
        });
        c.restore();
      }
      sk.blob(x + 2, y - 40, 6, 6, ID.flower + i * 3 + 2, '#FFD86B');
    }
  }
}
