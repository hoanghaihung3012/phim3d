// Vịt's bedroom in the comic-strip look of "Táo bón" (comic #11): cream wall, wooden floor
// band, a bed with a blue blanket and a yellow door that can swing open.
// Draw order: drawWall (screen space) -> drawBack (floor, door, bed frame, pillow)
// -> whoever is in bed -> drawBlanket -> everyone else.
import { Sketch, box, ellipse, quad, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';

const C = {
  wall: '#FFF4DE',
  floor: '#F2D9B0',
  wood: '#C9A27A',
  bedBase: '#FFFFFF',
  blanket: '#9CCBFF',
  blanketShade: '#86B8F2',
  pillow: '#EAF3FF',
  door: '#F5C66B',
  doorDark: '#3A3F4E',
  frame: '#E6B95A',
};

/** Bed layout (world units, floor y = 0). */
export const BED = { x0: -460, x1: 40, top: -190, headTop: -520 } as const;
/** Door: left edge x, width, height. */
export const DOOR = { x: 210, w: 190, h: 560 } as const;

export class Bedroom2D {
  /** 0 closed, 1 wide open (the leaf swings toward the viewer). */
  door = 0;

  /** Wall fill in screen space (call before the camera is applied). */
  drawWall(sk: Sketch, width: number, height: number): void {
    const c = sk.ctx;
    c.fillStyle = sk.paint(C.wall);
    c.fillRect(0, 0, width, height);
  }

  drawBack(sk: Sketch): void {
    const c = sk.ctx;
    c.fillStyle = sk.paint(C.floor);
    c.fillRect(-3000, 0, 6000, 1400);
    sk.line([[-3000, 0], [-1000, 2], [1000, -1], [3000, 0]], 7100, { width: LW });
    sk.line([[-3000, 46], [3000, 46]], 7101, { width: LW * 0.4 });
    this.drawDoor(sk);
    this.drawBedBack(sk);
  }

  private drawDoor(sk: Sketch): void {
    const { x, w, h } = DOOR;
    // Dark doorway, then the frame, then the leaf narrowing as it opens.
    sk.shape(box(x - 14, -h - 14, x + w + 14, 0, 8), 7110, { fill: C.frame });
    sk.shape(box(x, -h, x + w, 0, 6), 7111, { fill: '#5B6070', width: LW * 0.7 });
    const open = Math.max(0, Math.min(1, this.door));
    const lw = w * (1 - open * 0.82);
    const flare = open * 40;
    const leaf: Pt[] = [[x + w - lw, -h - flare], [x + w, -h], [x + w, 0], [x + w - lw, flare * 0.4]];
    sk.shape(leaf, 7112, { fill: C.door });
    const knobX = x + w - lw + lw * 0.16;
    sk.blob(knobX, -h * 0.47, 10 * (1 - open * 0.6), 10, 7113, C.doorDark);
  }

  private drawBedBack(sk: Sketch): void {
    const { x0, x1, top, headTop } = BED;
    // Headboard post at the left, footboard post at the right.
    sk.shape(box(x0 - 40, headTop, x0 + 20, 10, 16), 7120, { fill: C.wood });
    sk.shape(box(x1 - 30, top - 30, x1 + 24, 14, 14), 7121, { fill: C.wood });
    // Mattress base.
    sk.shape(box(x0 + 10, top + 10, x1 - 10, -60, 22), 7122, { fill: C.bedBase });
    // Pillow against the headboard.
    sk.shape(ellipse(x0 + 110, top - 30, 110, 46, 20), 7123, { fill: C.pillow, width: LW * 0.85 });
  }

  /** The blanket goes over the lower half of whoever lies in bed. */
  drawBlanket(sk: Sketch, t: number): void {
    const { x0, x1, top } = BED;
    const breathe = 3 * Math.sin(t * 2.2);
    const pts: Pt[] = [
      ...quad([x0 + 40, top + 30], [x0 + 260, top - 70 - breathe], [x1 - 20, top - 10], 10),
      [x1 - 6, top + 40],
      ...quad([x1 - 20, top + 70], [(x0 + x1) / 2, top + 100], [x0 + 40, top + 72], 8),
    ];
    sk.shape(pts, 7130, { fill: C.blanket });
    for (let i = 0; i < 3; i++) {
      const x = x0 + 190 + i * 130;
      sk.line([[x, top - 30 + i * 6], [x + 16, top + 80]], 7131 + i, { width: LW * 0.45, color: C.blanketShade });
    }
  }
}

/** A bowl of rice porridge with steam; drawn at (x, y) = bottom of the bowl. */
export function drawPorridge(sk: Sketch, x: number, y: number, size: number, t: number, steam: number): void {
  const s = size;
  sk.shape([...quad([x - 60 * s, y - 40 * s], [x, y + 30 * s], [x + 60 * s, y - 40 * s], 10)], 7140, { fill: '#FFFFFF', width: LW * 0.8 });
  sk.shape(ellipse(x, y - 40 * s, 60 * s, 12 * s, 16), 7141, { fill: '#FFF6DA', width: LW * 0.7 });
  if (steam <= 0) return;
  const c = sk.ctx;
  c.globalAlpha = Math.min(1, steam);
  for (let i = 0; i < 3; i++) {
    const bx = x + (i - 1) * 22 * s;
    const ph = t * 3 + i;
    const pts: Pt[] = [];
    for (let j = 0; j < 6; j++) pts.push([bx + 8 * s * Math.sin(ph + j * 1.2), y - 60 * s - j * 14 * s]);
    sk.line(pts, 7142 + i, { width: LW * 0.45 });
  }
  c.globalAlpha = 1;
}

/**
 * A spoon from the hand `from` toward `to`; `reach` 0..1 slides it from a short spoon
 * (90 units) to one that touches `to`.
 */
export function drawSpoon(sk: Sketch, from: Pt, to: Pt, reach: number, full: boolean): void {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.hypot(dx, dy) || 1;
  const len = 90 + (dist - 90) * Math.max(0, Math.min(1, reach));
  const ux = dx / dist;
  const uy = dy / dist;
  const tip: Pt = [from[0] + ux * len, from[1] + uy * len];
  const neck: Pt = [tip[0] - ux * 30, tip[1] - uy * 30];
  sk.tube([from, neck], 7150, 10, '#E3E6F0', 0.4);
  const a = Math.atan2(uy, ux);
  const bowl = ellipse(0, 0, 30, 16, 14).map(([px, py]): Pt => [tip[0] + px * Math.cos(a) - py * Math.sin(a), tip[1] + px * Math.sin(a) + py * Math.cos(a)]);
  sk.shape(bowl, 7151, { fill: '#E3E6F0', width: LW * 0.7, amp: 0.4 });
  if (full) sk.blob(tip[0], tip[1] - 3, 18, 8, 7152, '#FFF6DA');
}
