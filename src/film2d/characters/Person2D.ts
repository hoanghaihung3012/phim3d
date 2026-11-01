// Ba and Mẹ: ordinary humans drawn in the same doodle style as their kids (thick ink,
// flat pastel fills, dot eyes, blush). One class, two looks:
// - 'dad': tall and slim, kind ordinary face, short messy black hair with one tuft,
//   light green shirt with a chest pocket, beige trousers.
// - 'mom': shorter and cute, long brown hair with a blue bow, blue knee-length dress
//   with a white collar (her favourite colour is blue).
import { Sketch, box, ellipse, quad, type Pt } from '../doodle/Sketch';
import { INK, LW } from '../doodle/style';
import { FACE_EYES, FACE_MOUTHS, drawBlush, drawBrows, drawEye, drawMouth, drawSweat, eyeOf, mouthOf } from './face';

export type PersonKind = 'dad' | 'mom';

const SKIN = '#FFE4D0';
const SKIN_BLUSH = '#FF9DB0';

interface Look {
  hipY: number;
  shoulderY: number;
  shoulderW: number;
  headY: number;
  headRX: number;
  headRY: number;
  upperArm: number;
  foreArm: number;
  armW: number;
}

const LOOKS: Record<PersonKind, Look> = {
  dad: { hipY: -255, shoulderY: -432, shoulderW: 70, headY: -515, headRX: 64, headRY: 70, upperArm: 92, foreArm: 88, armW: 30 },
  mom: { hipY: -205, shoulderY: -338, shoulderW: 50, headY: -412, headRX: 61, headRY: 63, upperArm: 72, foreArm: 68, armW: 24 },
};

const COL = {
  shirt: '#CDEFC4',
  pants: '#EAD9B6',
  dadHair: '#4B4453',
  shoe: '#7A6658',
  dress: '#9EC9FF',
  dressShade: '#86B6F2',
  collar: '#FFFFFF',
  momHair: '#B57E55',
  bow: '#6FA8F5',
  momShoe: '#6FA8F5',
};

export class Person2D {
  readonly eyeSet = FACE_EYES;
  readonly mouthSet = FACE_MOUTHS;
  x = 0;
  /** Feet position. */
  y = 0;
  scale = 1;
  flip = 1;
  /** Lean of the whole body from the feet (radians). */
  tilt = 0;
  /** Extra head tilt (radians). */
  headTilt = 0;
  sx = 1;
  sy = 1;
  visible = 1;
  // Face
  eyes = 0;
  mouth = 0;
  lookX = 0;
  lookY = 0;
  blush = 1;
  blink = 1;
  brows = 0;
  talk = 0;
  /** Nose twitch before a sneeze (0..1). */
  itch = 0;
  // Arms: 0 hangs down, PI/2 sideways, PI up. Bend curls the forearm inwards.
  armL = 0.12;
  armR = 0.12;
  bendL = 0.2;
  bendR = 0.2;
  breath = 1;
  /** Strained trembling (holding a smile too long). */
  tremble = 0;
  // Effects
  sweat = 0;
  /** 0..1 sneeze spray lines. */
  spray = 0;

  constructor(readonly kind: PersonKind) {}

  private get look(): Look {
    return LOOKS[this.kind];
  }

  /** World point just above the head (speech bubbles point here). */
  headTop(): Pt {
    const L = this.look;
    return [this.x + this.lookX * 10 * this.scale, this.y + (L.headY - L.headRY - 30) * this.scale * this.sy];
  }

  private matrix(t: number): DOMMatrix {
    const shiver = this.tremble * 0.006 * Math.sin(t * 47);
    return new DOMMatrix()
      .translate(this.x, this.y)
      .scale(this.scale * this.flip, this.scale)
      .rotate(((this.tilt + shiver) * 180) / Math.PI);
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    const L = this.look;
    c.save();
    c.setTransform(sk.camera.multiply(this.matrix(t)));
    this.drawLegs(sk);
    const breath = Math.sin(t * 2.1) * this.breath;
    c.scale(this.sx, this.sy * (1 + 0.008 * breath));
    if (this.kind === 'mom') this.drawMomHairBack(sk, t);
    this.drawArm(sk, -1, this.armL, this.bendL, t);
    this.drawArm(sk, 1, this.armR, this.bendR, t);
    if (this.kind === 'dad') this.drawShirt(sk);
    else this.drawDress(sk);
    // Neck + head pivot on the neck.
    sk.tube([[0, L.shoulderY + 6], [0, L.headY + L.headRY - 8]], 4000, L.armW + 6, SKIN, 0.5);
    c.translate(0, L.headY + L.headRY);
    c.rotate(this.headTilt + this.tremble * 0.01 * Math.sin(t * 53));
    c.translate(0, -(L.headY + L.headRY));
    this.drawHead(sk, t);
    c.restore();
  }

  private drawLegs(sk: Sketch): void {
    const L = this.look;
    const dad = this.kind === 'dad';
    for (const s of [-1, 1]) {
      const hip: Pt = [s * (dad ? 28 : 20), dad ? L.hipY + 10 : -118];
      const foot: Pt = [s * (dad ? 30 : 22), -12];
      sk.tube(quad(hip, [(hip[0] + foot[0]) / 2, (hip[1] + foot[1]) / 2], foot, 5), 4001 + s, dad ? 44 : 26, dad ? COL.pants : SKIN);
      sk.shape(ellipse(foot[0] + s * 8, -10, dad ? 32 : 22, dad ? 14 : 11, 12), 4005 + s, { fill: dad ? COL.shoe : COL.momShoe, width: LW * 0.8 });
    }
  }

  private drawArm(sk: Sketch, s: number, ang: number, bend: number, t: number): void {
    const L = this.look;
    const sway = 0.03 * Math.sin(t * 1.6 + s);
    const a = ang + sway;
    const sh: Pt = [s * (L.shoulderW - 4), L.shoulderY + 14];
    const el: Pt = [sh[0] + s * Math.sin(a) * L.upperArm, sh[1] + Math.cos(a) * L.upperArm];
    const b = a + bend * 1.2;
    const hand: Pt = [el[0] + s * Math.sin(b) * L.foreArm * Math.cos(bend * 0.3) - s * bend * 20, el[1] + Math.cos(b) * L.foreArm];
    const sleeve = this.kind === 'dad' ? COL.shirt : SKIN;
    sk.tube([sh, el], 4010 + s, L.armW, sleeve, 0.8);
    sk.tube([el, hand], 4012 + s, L.armW * 0.9, SKIN, 0.8);
    if (this.kind === 'dad') {
      // Short sleeve cuff line.
      sk.tube([sh, [(sh[0] + el[0]) / 2, (sh[1] + el[1]) / 2]], 4014 + s, L.armW + 4, COL.shirt, 0.8);
    } else {
      // Puff sleeve.
      sk.shape(ellipse(sh[0] + s * 4, sh[1] + 4, 24, 20, 12), 4014 + s, { fill: COL.dress, width: LW * 0.8 });
    }
    sk.shape(ellipse(hand[0], hand[1], L.armW * 0.62, L.armW * 0.62, 10), 4016 + s, { fill: SKIN, width: LW * 0.7, amp: 0.6 });
  }

  private drawShirt(sk: Sketch): void {
    const L = this.look;
    const w = L.shoulderW;
    const top = L.shoulderY;
    const hip = L.hipY;
    const body: Pt[] = [
      [-w * 0.5, top - 4], [0, top - 2], [w * 0.5, top - 4], [w, top + 10], [w * 0.98, top + 60],
      [w * 0.9, hip + 40], [w * 0.88, hip], [0, hip + 4], [-w * 0.88, hip], [-w * 0.9, hip + 40],
      [-w * 0.98, top + 60], [-w, top + 10],
    ];
    sk.shape(body, 4020, { fill: COL.shirt });
    // Trousers top band (shirt tucked in).
    sk.shape([[-w * 0.88, hip - 2], [w * 0.88, hip - 2], [w * 0.86, hip + 26], [-w * 0.86, hip + 26]], 4021, { fill: COL.pants, width: LW * 0.8 });
    // Collar V, buttons, chest pocket.
    sk.line([[-26, top - 2], [0, top + 30], [26, top - 2]], 4022, { width: LW * 0.7 });
    for (let i = 0; i < 4; i++) sk.blob(0, top + 52 + i * 34, 4.5, 4.5, 4023 + i, INK);
    sk.shape(box(-52, top + 44, -20, top + 80, 4), 4028, { fill: COL.shirt, width: LW * 0.6, amp: 0.8 });
  }

  private drawDress(sk: Sketch): void {
    const L = this.look;
    const w = L.shoulderW;
    const top = L.shoulderY;
    const hem = -112;
    const dress: Pt[] = [
      [-w * 0.5, top - 4], [0, top - 2], [w * 0.5, top - 4], [w, top + 8], [w * 0.92, top + 60],
      [w * 0.86, top + 92], [w * 1.25, hem - 60], [w * 1.85, hem], [w * 0.9, hem + 8], [0, hem + 4],
      [-w * 0.9, hem + 8], [-w * 1.85, hem], [-w * 1.25, hem - 60], [-w * 0.86, top + 92], [-w * 0.92, top + 60], [-w, top + 8],
    ];
    sk.shape(dress, 4030, { fill: COL.dress });
    // Two fold lines on the skirt, waist line.
    sk.line(quad([-w * 0.86, top + 92], [0, top + 100], [w * 0.86, top + 92], 6), 4031, { width: LW * 0.55 });
    sk.line([[-28, hem - 70], [-40, hem - 10]], 4032, { width: LW * 0.5 });
    sk.line([[30, hem - 75], [44, hem - 14]], 4033, { width: LW * 0.5 });
    // White round collar.
    for (const s of [-1, 1]) {
      sk.shape(quad([0, top + 2], [s * 40, top - 4], [s * 6, top + 30], 7).concat([[0, top + 22]]), 4034 + s, { fill: COL.collar, width: LW * 0.7, amp: 0.7 });
    }
  }

  private drawMomHairBack(sk: Sketch, t: number): void {
    const L = this.look;
    const swing = 4 * Math.sin(t * 1.8);
    const hy = L.headY;
    const hair: Pt[] = [
      [-L.headRX * 1.08, hy - 20], [-L.headRX * 0.9, hy - L.headRY * 0.9], [0, hy - L.headRY * 1.12], [L.headRX * 0.9, hy - L.headRY * 0.9],
      [L.headRX * 1.08, hy - 20], [L.headRX * 1.2 + swing, hy + 60], [L.headRX * 1.25 + swing, hy + 120], [L.headRX * 0.9 + swing, hy + 150],
      [0, hy + 120], [-L.headRX * 0.9 + swing, hy + 150], [-L.headRX * 1.25 + swing, hy + 120], [-L.headRX * 1.2 + swing, hy + 60],
    ];
    sk.shape(hair, 4040, { fill: COL.momHair });
  }

  private drawHead(sk: Sketch, t: number): void {
    const L = this.look;
    const hx = 0;
    const hy = L.headY;
    const dad = this.kind === 'dad';
    if (dad) {
      for (const s of [-1, 1]) sk.shape(ellipse(s * L.headRX * 0.98, hy + 4, 14, 18, 10), 4050 + s, { fill: SKIN, width: LW * 0.75, amp: 0.6 });
    }
    sk.shape(ellipse(hx, hy, L.headRX, L.headRY, 26), 4053, { fill: SKIN });

    // Face (follows the look direction a little).
    const fx = this.lookX * 12;
    const fy = hy + this.lookY * 6 + (dad ? 6 : 10);
    let eyes = eyeOf(this.eyes);
    if (this.blink > 0.5 && (eyes === 'dot' || eyes === 'side') && (t + (dad ? 1.1 : 0)) % 3.7 < 0.1) eyes = 'closed';
    const gap = dad ? 25 : 23;
    drawBlush(sk, fx, fy + 26, gap + 14, 15, this.blush, SKIN_BLUSH, 4060);
    for (const s of [-1, 1]) drawEye(sk, eyes, fx + s * gap, fy - 4, dad ? 7 : 7.5, s, 4062 + s);
    drawBrows(sk, this.brows, fx, fy - 26, gap * 2, 16, 4066);
    // Nose: a tiny hook; twitches before the sneeze.
    const ni = this.itch * Math.sin(t * 40) * 4;
    sk.line(quad([fx - 3 + ni, fy + 6], [fx + 7 + ni, fy + 14], [fx - 2 + ni, fy + 18], 4), 4068, { width: LW * 0.55, amp: 0.4 });
    drawMouth(sk, mouthOf(this.mouth, this.talk, t), fx, fy + 32, dad ? 13 : 11, 4069);

    if (dad) this.drawDadHair(sk, hy);
    else this.drawMomHairFront(sk, hy);

    if (this.sweat > 0) drawSweat(sk, L.headRX * 0.95, hy - L.headRY * 0.6 + this.sweat * 30, 14, 4080);
    if (this.spray > 0 && this.spray < 1) {
      const c = sk.ctx;
      c.globalAlpha = Math.min(1, (1 - this.spray) * 2);
      for (let i = 0; i < 5; i++) {
        const a = -0.6 + i * 0.3;
        const r0 = 40 + this.spray * 40;
        const r1 = r0 + 40;
        sk.line([[fx + Math.sin(a) * r0, fy + 34 + Math.cos(a) * r0 * 0.4], [fx + Math.sin(a) * r1, fy + 34 + Math.cos(a) * r1 * 0.6]], 4082 + i, { width: LW * 0.55 });
      }
      c.globalAlpha = 1;
    }
  }

  private drawDadHair(sk: Sketch, hy: number): void {
    const L = this.look;
    const rx = L.headRX;
    const ry = L.headRY;
    // Short messy cap of hair with a few zig-zag bangs.
    const hair: Pt[] = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * (1.08 + (i / 12) * 0.84);
      hair.push([Math.cos(a) * rx * 1.07, hy + Math.sin(a) * ry * 1.07]);
    }
    hair.push([rx * 0.78, hy - ry * 0.35], [rx * 0.45, hy - ry * 0.55], [rx * 0.25, hy - ry * 0.38], [0, hy - ry * 0.6], [-rx * 0.3, hy - ry * 0.42], [-rx * 0.55, hy - ry * 0.58], [-rx * 0.85, hy - ry * 0.3]);
    sk.shape(hair, 4090, { fill: COL.dadHair });
    // The one tuft that never lies down.
    sk.tube(quad([8, hy - ry * 1.02], [10, hy - ry * 1.45], [34, hy - ry * 1.52], 6), 4091, 9, COL.dadHair, 0.8);
  }

  private drawMomHairFront(sk: Sketch, hy: number): void {
    const L = this.look;
    const rx = L.headRX;
    const ry = L.headRY;
    // Side-swept bangs.
    const bangs: Pt[] = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * (1.02 + (i / 12) * 0.96);
      bangs.push([Math.cos(a) * rx * 1.08, hy + Math.sin(a) * ry * 1.08]);
    }
    bangs.push([rx * 0.95, hy - ry * 0.1], [rx * 0.55, hy - ry * 0.42], [rx * 0.1, hy - ry * 0.5], [-rx * 0.3, hy - ry * 0.3], [-rx * 0.62, hy - ry * 0.52], [-rx * 0.98, hy]);
    sk.shape(bangs, 4095, { fill: COL.momHair });
    // Blue bow on the right side.
    const bx = rx * 0.72;
    const by = hy - ry * 0.85;
    sk.shape([[bx, by], [bx - 30, by - 22], [bx - 32, by + 16]], 4096, { fill: COL.bow, width: LW * 0.75, amp: 0.7 });
    sk.shape([[bx, by], [bx + 30, by - 24], [bx + 32, by + 14]], 4097, { fill: COL.bow, width: LW * 0.75, amp: 0.7 });
    sk.shape(ellipse(bx, by - 2, 9, 9, 8), 4098, { fill: COL.bow, width: LW * 0.7, amp: 0.4 });
  }
}
