// Vịt: Táo's friend, a round yellow duckling with a big flat orange bill, short webbed
// legs, a pointy tail and one curl of hair. Eager, show-offy, a bit of a worrier.
// Drawn in 3/4 view facing right (+x); use flip = -1 to face left.
// Can hold a little camera (camera = 1) with a flash and a REC light.
import { Sketch, ellipse, quad, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';
import { FACE_EYES, FACE_MOUTHS, drawBlush, drawBrows, drawEye, drawSweat, eyeOf } from './face';

const C = {
  body: '#FFE16B',
  bodyShade: '#F5CC4A',
  bill: '#FFA94D',
  billDark: '#E2707A',
  leg: '#FFA94D',
  blush: '#FF9DB0',
  cam: '#F1EFF8',
  camDark: '#8F93A6',
  lens: '#CFE6FF',
  rec: '#FF5A5A',
};

export class Duckling2D {
  readonly eyeSet = FACE_EYES;
  readonly mouthSet = FACE_MOUTHS;
  x = 0;
  y = 0;
  scale = 1;
  flip = 1;
  tilt = 0;
  sx = 1;
  sy = 1;
  visible = 1;
  eyes = 0;
  /** Unused (the bill opens instead); keeps the shared face helpers happy. */
  mouth = 0;
  /** Bill: 0 closed, 1 open. */
  bill = 0;
  talk = 0;
  lookX = 0;
  blush = 1;
  blink = 1;
  brows = 0;
  sweat = 0;
  /** Wing lift: 0 down, 1 raised (cheering). Ignored for the wing holding the camera. */
  wing = 0;
  hop = 0;
  breath = 1;
  // Camera prop
  camera = 0;
  /** Camera raised to the eye (1) or held at the chest (0). */
  aim = 0;
  rec = 0;

  headTop(): Pt {
    return [this.x + 25 * this.scale * this.flip, this.y - (270 + this.hop) * this.scale];
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    c.save();
    const m = new DOMMatrix()
      .translate(this.x, this.y - this.hop * this.scale)
      .scale(this.scale * this.flip, this.scale)
      .rotate((this.tilt * 180) / Math.PI);
    c.setTransform(sk.camera.multiply(m));
    this.drawLegs(sk);
    const breath = Math.sin(t * 2.6) * this.breath;
    c.scale(this.sx * (1 - 0.012 * breath), this.sy * (1 + 0.02 * breath));
    this.drawFarWing(sk, t);
    this.drawBody(sk);
    this.drawHead(sk, t);
    if (this.camera > 0.5) this.drawCamera(sk, t);
    this.drawNearWing(sk, t);
    c.restore();
  }

  private drawLegs(sk: Sketch): void {
    for (const [dx, id] of [[-18, 5001], [20, 5002]] as const) {
      sk.tube([[dx, -46], [dx + 2, -10]], id, 13, C.leg, 0.6);
      sk.shape([[dx - 14, -2], [dx + 28, -2], [dx + 30, -10], [dx + 6, -16]], id + 10, { fill: C.leg, width: LW * 0.7, amp: 0.6 });
    }
  }

  private drawBody(sk: Sketch): void {
    const pts: Pt[] = [];
    const n = 30;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pts.push([Math.cos(a) * 80, -98 + Math.sin(a) * 64]);
    }
    // Pointy tail at the back, sticking up.
    const tail = Math.round(n * 0.53);
    pts.splice(tail, 0, [-96, -150], [-74, -126]);
    sk.shape(pts, 5010, { fill: C.body });
    sk.line(quad([-20, -50], [20, -40], [52, -66], 6), 5011, { width: LW * 0.5, color: C.bodyShade });
  }

  private drawHead(sk: Sketch, t: number): void {
    const hx = 30 + this.lookX * 6;
    const hy = -190;
    sk.shape(ellipse(hx, hy, 60, 57, 24), 5020, { fill: C.body });
    // Curl of hair.
    sk.line([[hx - 4, hy - 54], [hx - 2, hy - 82], [hx + 16, hy - 92], [hx + 26, hy - 78], [hx + 14, hy - 68], [hx + 6, hy - 78]], 5021, { width: LW * 0.8 });

    let eyes = eyeOf(this.eyes);
    if (this.blink > 0.5 && eyes === 'dot' && (t + 0.6) % 3.1 < 0.1) eyes = 'closed';
    drawBlush(sk, hx + 22, hy + 24, 34, 14, this.blush, C.blush, 5030);
    drawEye(sk, eyes, hx + 4, hy - 8, 7, -1, 5032);
    drawEye(sk, eyes, hx + 40, hy - 8, 7, 1, 5033);
    drawBrows(sk, this.brows, hx + 22, hy - 30, 40, 13, 5034);

    // Flat duck bill; opens to talk.
    const open = this.bill > 0.5 || (this.talk > 0.5 && Math.floor(t * 7) % 2 === 0);
    const bx = hx + 54;
    const by = hy + 14;
    if (open) {
      sk.shape([[bx - 10, by + 2], [bx + 52, by + 2], [bx + 50, by + 24], [bx - 6, by + 18]], 5040, { fill: C.billDark, width: LW * 0.7, amp: 0.5 });
      sk.shape([[bx - 14, by - 14], [bx + 30, by - 18], [bx + 58, by - 8], [bx + 56, by + 2], [bx - 12, by + 4]], 5041, { fill: C.bill, width: LW * 0.8, amp: 0.6 });
      sk.shape([[bx - 10, by + 16], [bx + 48, by + 20], [bx + 46, by + 32], [bx - 6, by + 28]], 5042, { fill: C.bill, width: LW * 0.8, amp: 0.6 });
    } else {
      sk.shape([[bx - 14, by - 14], [bx + 30, by - 18], [bx + 60, by - 6], [bx + 58, by + 10], [bx + 26, by + 16], [bx - 12, by + 12]], 5041, { fill: C.bill, width: LW * 0.8, amp: 0.6 });
      sk.line([[bx - 6, by + 1], [bx + 30, by + 1], [bx + 54, by + 2]], 5043, { width: LW * 0.5 });
    }
    if (this.sweat > 0) drawSweat(sk, hx - 52, hy - 30 + this.sweat * 24, 12, 5050);
  }

  private drawFarWing(sk: Sketch, t: number): void {
    if (this.camera > 0.5) return;
    const lift = this.wing * (0.9 + 0.2 * Math.sin(t * 16));
    this.wingShape(sk, [52, -122], lift, 5060, true);
  }

  private drawNearWing(sk: Sketch, t: number): void {
    if (this.camera > 0.5) {
      // Wing tip wrapped around the camera.
      const cy = this.aim > 0.5 ? -178 : -112;
      sk.shape([[-6, -128], [40, -136], [86, cy - 4], [94, cy + 18], [60, cy + 26], [10, -92]], 5065, { fill: C.body, width: LW * 0.85 });
      return;
    }
    const lift = this.wing * (0.9 + 0.2 * Math.sin(t * 16 + 1));
    this.wingShape(sk, [-8, -118], lift, 5066, false);
  }

  private wingShape(sk: Sketch, base: Pt, lift: number, id: number, far: boolean): void {
    // Points back and down at rest, swings back and up when lifted.
    const a = 0.9 - lift * 1.9;
    const L = far ? 62 : 74;
    const dir: Pt = [-Math.cos(a), Math.sin(a)];
    const tip: Pt = [base[0] + dir[0] * L, base[1] + dir[1] * L];
    const nrm: Pt = [-dir[1], dir[0]];
    const pts: Pt[] = [
      [base[0] + nrm[0] * 20, base[1] + nrm[1] * 20],
      [(base[0] + tip[0]) / 2 + nrm[0] * 26, (base[1] + tip[1]) / 2 + nrm[1] * 26],
      tip,
      [(base[0] + tip[0]) / 2 - nrm[0] * 14, (base[1] + tip[1]) / 2 - nrm[1] * 14],
      [base[0] - nrm[0] * 18, base[1] - nrm[1] * 18],
    ];
    sk.shape(pts, id, { fill: far ? C.bodyShade : C.body, width: LW * 0.85 });
  }

  private drawCamera(sk: Sketch, t: number): void {
    const up = this.aim > 0.5;
    const x = up ? 72 : 70;
    const y = up ? -205 : -140;
    // Body, viewfinder bump, lens, flash window.
    sk.shape([[x + 8, y - 28], [x + 34, y - 28], [x + 38, y - 40], [x + 62, y - 40], [x + 66, y - 28], [x + 86, y - 28], [x + 86, y + 32], [x + 8, y + 32]], 5070, { fill: C.cam });
    sk.shape([[x + 86, y - 18], [x + 118, y - 20], [x + 118, y + 22], [x + 86, y + 20]], 5071, { fill: C.camDark, width: LW * 0.8 });
    sk.shape(ellipse(x + 120, y + 1, 9, 20, 10), 5072, { fill: C.lens, width: LW * 0.7, amp: 0.5 });
    sk.shape([[x + 14, y - 22], [x + 30, y - 22], [x + 30, y - 10], [x + 14, y - 10]], 5073, { fill: '#FFF6C7', width: LW * 0.55, amp: 0.4 });
    if (this.rec > 0.5 && Math.floor(t * 2) % 2 === 0) sk.blob(x + 70, y - 12, 7, 7, 5074, C.rec);
  }
}
