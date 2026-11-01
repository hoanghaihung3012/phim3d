// The Táo family living room: mostly blank paper wall, a window with curtains, a framed
// picture above the blue sofa, a rug, a potted plant and Vịt's little stool.
// The wall picture can show a photo (an offscreen canvas) instead of its doodle.
import { Sketch, box, ellipse, quad, scallop, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';

const C = {
  sofa: '#8EC3F5',
  sofaShade: '#77AEE6',
    floor: '#F3E6D2',
  rug: '#FFD6DE',
  rugInner: '#FFE9EE',
  window: '#E3F2FF',
  curtain: '#FFF1A8',
  frame: '#F3D8AE',
  pot: '#F4A68B',
  leaf: '#9ADB8F',
  stool: '#F3D8AE',
  sun: '#FFF1B8',
  cloud: '#FFFFFF',
};

export const SOFA = { x: -150, w: 780, seatY: -150, backY: -290 };
export const STOOL = { x: 640, topY: -120 };
export const WALL_FRAME = { x: -300, y: -800, w: 300, h: 169 };

export class LivingRoom2D {
  /** 1: the wall frame shows `photo` instead of its doodle. */
  photo = 0;
  photoImage: CanvasImageSource | null = null;
  stool = 1;

  drawBack(sk: Sketch, t: number): void {
    const c = sk.ctx;
    // Floor band and skirting line.
    c.fillStyle = C.floor;
    c.fillRect(-3000, 0, 6000, 1200);
    sk.line([[-3000, 0], [-1000, 2], [1000, -1], [3000, 0]], 7000, { width: LW });
    sk.shape(ellipse(SOFA.x + 120, 40, 820, 46, 30), 7001, { fill: C.rug, width: LW * 0.8 });
    sk.shape(ellipse(SOFA.x + 120, 40, 700, 30, 30), 7002, { fill: C.rugInner, width: LW * 0.5 });

    this.drawWindow(sk, t);
    this.drawFrame(sk);
    this.drawPlant(sk, t);
  }

  private drawWindow(sk: Sketch, t: number): void {
    const x0 = -900;
    const x1 = -660;
    const y0 = -790;
    const y1 = -470;
    sk.shape(box(x0, y0, x1, y1, 10), 7010, { fill: C.window });
    sk.blob(x0 + 70, y0 + 80, 34, 34, 7011, C.sun);
    sk.shape(scallop(x0 + 160 + 6 * Math.sin(t * 0.4), y0 + 150, 50, 22, 4), 7012, { fill: C.cloud, width: LW * 0.6 });
    sk.line([[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]], 7013, { width: LW * 0.8 });
    sk.line([[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]], 7014, { width: LW * 0.8 });
    // Curtains tied at the sides.
    for (const [x, s, id] of [[x0, -1, 7015], [x1, 1, 7016]] as const) {
      sk.shape([[x - s * 10, y0 - 30], [x + s * 40, y0 - 30], [x + s * 10, (y0 + y1) / 2], [x + s * 50, y1 + 40], [x - s * 14, y1 + 40]], id, { fill: C.curtain });
    }
    sk.line([[x0 - 50, y0 - 30], [x1 + 60, y0 - 30]], 7017, { width: LW * 1.1 });
  }

  private drawFrame(sk: Sketch): void {
    const { x, y, w, h } = WALL_FRAME;
    const b = 22;
    const c = sk.ctx;
    sk.line([[x - 60, y - h / 2 - b], [x, y - h / 2 - 70], [x + 60, y - h / 2 - b]], 7020, { width: LW * 0.6 });
    sk.blob(x, y - h / 2 - 70, 7, 7, 7021, '#3A3F4E');
    sk.shape(box(x - w / 2 - b, y - h / 2 - b, x + w / 2 + b, y + h / 2 + b, 10), 7022, { fill: C.frame });
    const inner: Pt[] = box(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 6);
    if (this.photo > 0.5 && this.photoImage) {
      c.drawImage(this.photoImage, x - w / 2, y - h / 2, w, h);
      sk.shape(inner, 7023, { width: LW * 0.7, amp: 0.6 });
      return;
    }
    // A child's doodle: hill, sun and a flower.
    sk.shape(inner, 7023, { fill: '#FFFFFF', width: LW * 0.7, amp: 0.6 });
    sk.shape([[x - w / 2, y + h / 2], ...quad([x - w / 2, y + 20], [x, y - 30], [x + w / 2, y + 30], 8), [x + w / 2, y + h / 2]], 7024, { fill: '#D5F0C8', width: LW * 0.55 });
    sk.blob(x + 90, y - 40, 22, 22, 7025, C.sun);
    sk.line([[x - 40, y + 40], [x - 40, y - 10]], 7026, { width: LW * 0.5 });
    sk.blob(x - 40, y - 18, 14, 14, 7027, '#FFB3C6');
  }

  private drawPlant(sk: Sketch, t: number): void {
    const x = -760;
    sk.shape([[x - 50, -120], [x + 50, -120], [x + 38, 0], [x - 38, 0]], 7030, { fill: C.pot });
    for (let i = 0; i < 5; i++) {
      const a = -1.1 + i * 0.55 + 0.04 * Math.sin(t * 1.5 + i);
      const tip: Pt = [x + Math.sin(a) * 150, -120 - Math.cos(a) * 170];
      const mid: Pt = [x + Math.sin(a) * 70, -120 - Math.cos(a) * 110];
      sk.shape([[x, -118], [mid[0] - 26, mid[1]], tip, [mid[0] + 26, mid[1] + 6]], 7031 + i, { fill: C.leaf, width: LW * 0.75, amp: 1 });
    }
  }

  /** The sofa goes in front of Ba and Mẹ (standing behind it) and under the kids. */
  drawSofa(sk: Sketch): void {
    const { x, w, seatY, backY } = SOFA;
    const l = x - w / 2;
    const r = x + w / 2;
    // Skirt down to the floor (hides the legs of whoever stands behind the sofa).
    sk.shape(box(l + 40, -60, r - 40, -2, 8), 7040, { fill: C.sofaShade });
    // Back rest with two cushion seams.
    sk.shape([[l + 30, backY + 10], [l + 60, backY], [r - 60, backY], [r - 30, backY + 10], [r - 30, seatY + 20], [l + 30, seatY + 20]], 7042, { fill: C.sofaShade });
    sk.line([[x - w / 6, backY + 14], [x - w / 6, seatY + 4]], 7043, { width: LW * 0.55 });
    sk.line([[x + w / 6, backY + 14], [x + w / 6, seatY + 4]], 7044, { width: LW * 0.55 });
    // Seat.
    sk.shape([[l + 40, seatY], [r - 40, seatY], [r - 34, -40], [l + 34, -40]], 7045, { fill: C.sofa });
    sk.line([[x, seatY + 6], [x, -54]], 7046, { width: LW * 0.5 });
    // Rolled arms.
    for (const [ax, id] of [[l + 20, 7047], [r - 20, 7048]] as const) {
      sk.shape([[ax - 48, -220], [ax - 30, -246], [ax + 30, -246], [ax + 48, -220], [ax + 44, -2], [ax - 44, -2]], id, { fill: C.sofa });
    }
  }

  drawStool(sk: Sketch): void {
    if (this.stool < 0.5) return;
    const { x, topY } = STOOL;
    sk.tube([[x - 40, topY + 10], [x - 52, -6]], 7050, 18, C.stool, 0.6);
    sk.tube([[x + 40, topY + 10], [x + 52, -6]], 7051, 18, C.stool, 0.6);
    sk.shape([[x - 70, topY], [x + 70, topY], [x + 66, topY + 26], [x - 66, topY + 26]], 7052, { fill: C.stool });
  }
}
