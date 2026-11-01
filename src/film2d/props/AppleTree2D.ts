// A big round apple tree and a bush in the comic-strip look (Táo #3 / "Thả diều"): pale
// trunk, scalloped green canopy with a darker inner lobe, thick ink outline.
// The apples themselves are Apple2D instances drawn by the episode on top of the canopy.
import { Sketch, quad, scallop, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';

const C = { trunk: '#C9A27A', canopy: '#9ADB8F', canopyShade: '#86CC7C', bush: '#A6E19A', bushShade: '#8FD283' };

export class AppleTree2D {
  x = 0;
  /** Canopy center height (world y, ground = 0) and radii. */
  canopyY = -820;
  rx = 440;
  ry = 330;
  /** 0..1: the whole tree shivers (someone is shaking the trunk). */
  shake = 0;

  /** Horizontal shake offset at time t (the apples follow it too). */
  shakeX(t: number): number {
    return this.shake * 14 * Math.sin(t * 47);
  }

  draw(sk: Sketch, t: number): void {
    const x = this.x;
    const dx = this.shakeX(t);
    const cy = this.canopyY;
    // Trunk, slightly flared at the bottom, with a fork into the canopy.
    const trunk: Pt[] = [
      [x - 62, 0], [x - 44, -160], [x - 40, -330], [x - 90, -470 + 0], [x - 56, -500], [x + dx * 0.5, -420],
      [x + 56 + dx, -500], [x + 90 + dx, -470], [x + 40 + dx * 0.5, -330], [x + 44, -160], [x + 62, 0],
    ];
    sk.shape(trunk, 7400, { fill: C.trunk, amp: 1.4 });
    sk.line(quad([x - 14, -110], [x + 4, -160], [x - 8, -220], 5), 7401, { width: LW * 0.6 });
    // Canopy: main scallop, darker lobe at the lower right, a few leaf ticks.
    sk.shape(scallop(x + dx, cy, this.rx, this.ry, 13, 0.1, 120), 7402, { fill: C.canopy, amp: 1.6 });
    sk.shape(scallop(x + dx + this.rx * 0.38, cy + this.ry * 0.3, this.rx * 0.36, this.ry * 0.3, 6, 0.14, 48), 7403, {
      fill: C.canopyShade,
      width: LW * 0.7,
    });
    const ticks: Pt[] = [[-300, -120], [-120, -230], [90, -250], [280, -140], [-330, 90], [330, 40]];
    ticks.forEach(([tx, ty], i) =>
      sk.line(quad([x + dx + tx, cy + ty], [x + dx + tx + 12, cy + ty - 14], [x + dx + tx + 26, cy + ty], 4), 7410 + i, {
        width: LW * 0.6,
      }),
    );
  }
}

export class Bush2D {
  x = 0;
  scale = 1;
  /** 0..1: rustles (someone is looking behind it). */
  rustle = 0;

  draw(sk: Sketch, t: number): void {
    const s = this.scale;
    const w = this.rustle * 6 * Math.sin(t * 40);
    sk.shape(scallop(this.x + w, -95 * s, 170 * s, 100 * s, 7, 0.16, 60), 7420, { fill: C.bush });
    sk.shape(scallop(this.x + 60 * s + w, -60 * s, 80 * s, 50 * s, 4, 0.16, 36), 7421, { fill: C.bushShade, width: LW * 0.7 });
    // Flat bottom on the ground.
    sk.line([[this.x - 150 * s, -4], [this.x + 150 * s, -4]], 7422, { width: LW * 0.6 });
  }
}
