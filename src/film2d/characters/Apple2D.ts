// Táo Lém, 2D doodle version. Every acting channel is a number so scenes can keyframe it;
// expressions are indices into EYES / MOUTHS and are switched with 'step' keys.
import { Sketch, quad, type Pt } from '../doodle/Sketch';
import { COLORS, INK, LW } from '../doodle/style';

export const EYES = ['half', 'dot', 'shock', 'happy', 'closed', 'smug'] as const;
export const MOUTHS = ['flat', 'none', 'o', 'smirk', 'smile', 'wavy', 'bite'] as const;
export type Eye = (typeof EYES)[number];
export type Mouth = (typeof MOUTHS)[number];

const R = 205; // apple radius in local units
const LEG = 50; // leg length

/** Apple outline in local space: origin at the bottom of the apple, y down. */
function appleShape(n = 72): Pt[] {
  const cy = -R * 0.87;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const th = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const s = Math.sin(th);
    let x = R * 1.06 * Math.cos(th);
    let y = R * 0.92 * s;
    if (s > 0) x *= 1 - 0.13 * s * s;
    const d1 = (th + Math.PI / 2) / 0.3;
    const d2 = (th - Math.PI * 1.5) / 0.3;
    y += R * 0.2 * (Math.exp(-d1 * d1) + Math.exp(-d2 * d2));
    const d3 = (th - Math.PI / 2) / 0.22;
    y -= R * 0.05 * Math.exp(-d3 * d3);
    pts.push([x, y + cy]);
  }
  return pts;
}
const APPLE = appleShape();
const TOP_DIP_Y = APPLE[0][1];
const STEM_TIP_Y = TOP_DIP_Y - 58;
const FACE_Y = -R * 0.86;
const MOUTH_Y = FACE_Y + 44;

const ID = {
  body: 1, shine: 2, stem: 3, leaf: 4, vein: 5, armL: 6, armR: 7, legL: 8, legR: 9,
  eyeL: 10, eyeR: 11, lidL: 12, lidR: 13, mouth: 14, blushL: 15, blushR: 16,
  sweat: 17, puff: 18, spark: 19, dots: 20, speed: 24, dent: 28,
};

export class Apple2D {
  // Placement
  x = 0;
  /** Feet position (bottom of the apple when legs are hidden). */
  y = 0;
  scale = 0.3;
  tilt = 0;
  /** Rotation pivot: 0 feet, 1 stem tip (hanging), 2 mouth (hanging from balloons). */
  pivot = 0;
  sx = 1;
  sy = 1;
  visible = 1;
  /** Mirror horizontally (-1). */
  flip = 1;
  // Face
  eyes = 0;
  mouth = 0;
  lookX = 0;
  lookY = 0;
  blush = 1;
  blink = 1;
  /** 0 = no face (seen from behind, or an ordinary apple). */
  face = 1;
  // Body parts
  leaf = 0;
  flap = 0;
  stem = 0;
  armL = 0.25;
  armR = 0.25;
  /** Extra length of the right arm (noodle arm stretching up to grab a branch). */
  reachR = 0;
  arms = 1;
  legs = 0;
  run = 0;
  footL = 0;
  footR = 0;
  liftL = 0;
  liftR = 0;
  breath = 1;
  sway = 0;
  shake = 0;
  // Effects
  sweat = 0;
  sigh = 0;
  sparkle = 0;
  dots = 0;
  speed = 0;
  dent = 0;

  /** Distance from the feet (legs hidden) to the stem tip, in world units. */
  stemTipHeight(): number {
    return -STEM_TIP_Y * this.scale;
  }

  private feetMatrix(t: number): DOMMatrix {
    const lift = LEG * this.legs;
    const py = [0, -lift + STEM_TIP_Y, -lift + MOUTH_Y][Math.round(this.pivot)] ?? 0;
    const rot = this.tilt + this.sway * 0.2 * Math.sin(t * 2.4) + this.shake * 0.12 * Math.sin(t * 60);
    return new DOMMatrix()
      .translate(this.x, this.y)
      .scale(this.scale * this.flip, this.scale)
      .translate(0, py)
      .rotate((rot * 180) / Math.PI)
      .translate(0, -py);
  }

  private bodyMatrix(t: number): DOMMatrix {
    const bob = this.run > 0.5 ? 8 * Math.abs(Math.sin(t * 22)) : 0;
    const breath = Math.sin(t * 2.2) * this.breath;
    return this.feetMatrix(t)
      .translate(0, -LEG * this.legs - bob)
      .scale(this.sx * (1 - 0.01 * breath), this.sy * (1 + 0.018 * breath));
  }

  /** World position of the mouth (balloon strings attach here). */
  mouthWorld(t: number): Pt {
    const p = this.bodyMatrix(t).transformPoint(new DOMPoint(this.lookX * 10, MOUTH_Y));
    return [p.x, p.y];
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    c.save();
    sk.ctx.setTransform(sk.camera.multiply(this.feetMatrix(t)));
    if (this.legs > 0.5) this.drawLegs(sk, t);
    sk.ctx.setTransform(sk.camera.multiply(this.bodyMatrix(t)));
    if (this.arms > 0.5) this.drawArms(sk, t);
    this.drawStem(sk);
    this.drawBody(sk);
    this.drawLeaf(sk, t);
    if (this.face > 0.5) this.drawFace(sk, t);
    this.drawFx(sk, t);
    c.restore();
  }

  private drawLegs(sk: Sketch, t: number): void {
    let fL = this.footL;
    let fR = this.footR;
    let uL = this.liftL;
    let uR = this.liftR;
    if (this.run > 0.5) {
      const w = t * 22;
      fL += 26 * Math.sin(w);
      fR -= 26 * Math.sin(w);
      uL += Math.max(0, 18 * Math.cos(w));
      uR += Math.max(0, -18 * Math.cos(w));
    }
    const legs: [number, number, number, number][] = [
      [-1, fL, uL, ID.legL],
      [1, fR, uR, ID.legR],
    ];
    for (const [side, dx, up, id] of legs) {
      const hip: Pt = [side * 52 * this.sx, -LEG - 26];
      const foot: Pt = [side * 54 + dx, -up - 4];
      sk.tube(quad(hip, [(hip[0] + foot[0]) / 2, (hip[1] + foot[1]) / 2], foot, 5), id, 40, COLORS.apple);
    }
  }

  private drawArms(sk: Sketch, t: number): void {
    const arms: [number, number, number, number][] = [
      [-1, this.armL + 0.05 * Math.sin(t * 1.7), ID.armL, 82],
      [1, this.armR + 0.05 * Math.sin(t * 1.7 + 1), ID.armR, 82 + this.reachR],
    ];
    for (const [side, ang, id, len] of arms) {
      const sh: Pt = [side * R * 0.88, -R * 0.62];
      const hand: Pt = [sh[0] + side * Math.sin(ang) * len, sh[1] + Math.cos(ang) * len];
      const mid: Pt = [(sh[0] + hand[0]) / 2 + side * 10, (sh[1] + hand[1]) / 2 + 6];
      sk.tube(quad(sh, mid, hand, 6), id, 22, COLORS.apple, 1);
    }
  }

  private drawStem(sk: Sketch): void {
    const base: Pt = [0, TOP_DIP_Y + 30];
    const tip: Pt = [12 + this.stem, STEM_TIP_Y];
    sk.tube(quad(base, [-8, TOP_DIP_Y - 20], tip, 6), ID.stem, 15, COLORS.stem, 0.8);
  }

  private drawLeaf(sk: Sketch, t: number): void {
    const at: Pt = [4 + this.stem * 0.5, TOP_DIP_Y - 28];
    const a = 0.45 + this.leaf + this.flap * 0.35 * Math.sin(t * 14);
    const dir: Pt = [Math.cos(a), -Math.sin(a)];
    const nrm: Pt = [-dir[1], dir[0]];
    const L = 92;
    const W = 30;
    const tip: Pt = [at[0] + dir[0] * L, at[1] + dir[1] * L];
    const side = (s: number): Pt[] =>
      quad(at, [at[0] + dir[0] * L * 0.5 + nrm[0] * W * s, at[1] + dir[1] * L * 0.5 + nrm[1] * W * s], tip, 9);
    const pts = [...side(1), ...side(-1).reverse().slice(1, -1)];
    sk.shape(pts, ID.leaf, { fill: COLORS.leaf, width: LW * 0.85, amp: 1 });
    sk.line(
      quad(at, [at[0] + dir[0] * L * 0.4 + nrm[0] * 4, at[1] + dir[1] * L * 0.4 + nrm[1] * 4], [at[0] + dir[0] * L * 0.7, at[1] + dir[1] * L * 0.7], 5),
      ID.vein,
      { width: LW * 0.5 },
    );
  }

  private drawBody(sk: Sketch): void {
    const c = sk.ctx;
    const body = sk.wobble(APPLE, ID.body, 1.6);

    // Flat fill with a soft crescent of shade on the lower right.
    c.save();
    sk.trace(body, true);
    c.fillStyle = sk.paint(COLORS.appleShade);
    c.fill();
    c.clip();
    c.translate(-26, -22);
    c.scale(0.985, 0.985);
    sk.trace(body, true);
    c.fillStyle = sk.paint(COLORS.apple);
    c.fill();
    c.restore();

    sk.line(quad([-R * 0.72, -R * 1.05], [-R * 0.72, -R * 1.38], [-R * 0.42, -R * 1.5], 6), ID.shine, {
      width: LW * 1.1,
      color: '#FFFFFF',
    });

    // Outline with a small gap on the upper left, like a pen lifted off the paper.
    sk.trace([...body.slice(64), ...body.slice(0, 62)], false);
    c.lineWidth = sk.lw(LW);
    c.strokeStyle = sk.ink;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.stroke();
  }

  private drawFace(sk: Sketch, t: number): void {
    const c = sk.ctx;
    let eyes: Eye = EYES[Math.round(this.eyes)] ?? 'half';
    const mouth: Mouth = MOUTHS[Math.round(this.mouth)] ?? 'flat';
    if (this.blink > 0.5 && (eyes === 'half' || eyes === 'dot') && t % 3.4 < 0.12) eyes = 'closed';

    const ex = R * 0.31;
    const lx = this.lookX * 16;
    const ly = this.lookY * 8 + FACE_Y;
    const thin = LW * 0.75;

    if (this.blush > 0) {
      c.globalAlpha = Math.min(1, 0.55 * this.blush);
      for (const [s, id] of [[-1, ID.blushL], [1, ID.blushR]] as const) {
        sk.blob(s * R * 0.52 + lx * 0.4, FACE_Y + 46, 28 * Math.min(1.25, this.blush), 15, id, COLORS.appleBlush);
      }
      c.globalAlpha = 1;
    }

    for (const [s, id, lid] of [[-1, ID.eyeL, ID.lidL], [1, ID.eyeR, ID.lidR]] as const) {
      const x = s * ex + lx;
      const y = ly;
      switch (eyes) {
        case 'dot':
          sk.blob(x, y, 12, 19, id, INK);
          break;
        case 'shock':
          sk.blob(x, y - 4, 7, 9, id, INK);
          break;
        case 'half':
        case 'smug': {
          const slant = eyes === 'smug' ? s * -7 : 0;
          c.save();
          c.beginPath();
          c.moveTo(x - 30, y - 1 - slant);
          c.lineTo(x + 30, y - 1 + slant);
          c.lineTo(x + 30, y + 40);
          c.lineTo(x - 30, y + 40);
          c.closePath();
          c.clip();
          sk.blob(x, y + 3, 12, 17, id, INK);
          c.restore();
          sk.line([[x - 21, y - 1 - slant * 0.7], [x, y - 2], [x + 21, y - 1 + slant * 0.7]], lid, { width: thin, amp: 0.8 });
          break;
        }
        case 'happy':
          sk.line(quad([x - 18, y + 8], [x, y - 18], [x + 18, y + 8], 6), id, { width: thin, amp: 0.8 });
          break;
        case 'closed':
          sk.line(quad([x - 18, y], [x, y + 10], [x + 18, y], 6), id, { width: thin, amp: 0.8 });
          break;
      }
    }

    const mx = lx * 0.6;
    const my = MOUTH_Y;
    const mw = LW * 0.6;
    switch (mouth) {
      case 'flat':
        sk.line([[mx - 13, my], [mx, my + 1], [mx + 13, my]], ID.mouth, { width: mw, amp: 0.6 });
        break;
      case 'o':
        sk.shape(ellipseSmall(mx, my + 2, 7, 9), ID.mouth, { width: mw, amp: 0.4 });
        break;
      case 'smirk':
        sk.line(quad([mx - 14, my + 2], [mx + 6, my + 6], [mx + 17, my - 9], 6), ID.mouth, { width: mw, amp: 0.6 });
        break;
      case 'smile':
        sk.line(
          [...quad([mx - 15, my - 3], [mx - 7, my + 10], [mx, my], 5), ...quad([mx, my], [mx + 7, my + 10], [mx + 15, my - 3], 5).slice(1)],
          ID.mouth,
          { width: mw, amp: 0.5 },
        );
        break;
      case 'wavy':
        sk.line([[mx - 16, my + 3], [mx - 8, my - 3], [mx, my + 3], [mx + 8, my - 3], [mx + 16, my + 3]], ID.mouth, { width: mw, amp: 0.5 });
        break;
      case 'bite':
        // Lips pressed on the balloon string.
        sk.shape(ellipseSmall(mx, my, 11, 6), ID.mouth, { fill: COLORS.appleShade, width: mw, amp: 0.4 });
        break;
      case 'none':
        break;
    }

    if (this.dent > 0.5) {
      // Square imprint of the plank on the right cheek.
      const x = R * 0.5;
      const y = FACE_Y + 10;
      sk.shape([[x - 34, y - 30], [x + 34, y - 30], [x + 34, y + 30], [x - 34, y + 30]], ID.dent, {
        fill: COLORS.appleShade,
        width: LW * 0.55,
        amp: 1,
      });
    }
  }

  private drawFx(sk: Sketch, t: number): void {
    const c = sk.ctx;

    if (this.sweat > 0) {
      const x = R * 0.78;
      const y = -R * 1.45 + this.sweat * 40;
      const drop: Pt[] = [[x, y - 26], [x + 9, y - 8], [x + 13, y + 6], [x + 6, y + 16], [x - 6, y + 16], [x - 13, y + 6], [x - 9, y - 8]];
      sk.shape(drop, ID.sweat, { fill: COLORS.sweat, width: LW * 0.6, amp: 0.6 });
    }

    if (this.sigh > 0 && this.sigh < 1) {
      const k = this.sigh;
      c.globalAlpha = Math.min(1, (1 - k) * 2.5);
      for (let i = 0; i < 3; i++) {
        const r = 10 + i * 7 + k * 10;
        const x = -R * 1.2 - i * 34 - k * 70;
        const y = FACE_Y + 40 - i * 10 - k * 20;
        sk.shape(ellipseSmall(x, y, r, r), ID.puff + i, { width: LW * 0.55, amp: 0.8 });
      }
      c.globalAlpha = 1;
    }

    if (this.sparkle > 0) {
      const spots: Pt[] = [[-R * 1.15, -R * 1.5], [R * 1.2, -R * 1.25], [R * 0.95, -R * 1.9]];
      spots.forEach(([x, y], i) => {
        const s = (14 + 6 * sk.jitter(ID.spark + i)) * this.sparkle * (0.7 + 0.3 * Math.abs(Math.sin(t * 5 + i)));
        if (s <= 1) return;
        c.fillStyle = sk.paint(COLORS.spark);
        c.strokeStyle = sk.ink;
        c.lineWidth = sk.lw(LW * 0.45);
        c.beginPath();
        c.moveTo(x, y - s * 1.6);
        c.quadraticCurveTo(x, y, x + s, y);
        c.quadraticCurveTo(x, y, x, y + s * 1.6);
        c.quadraticCurveTo(x, y, x - s, y);
        c.quadraticCurveTo(x, y, x, y - s * 1.6);
        c.fill();
        c.stroke();
      });
    }

    if (this.dots > 0) {
      for (let i = 0; i < Math.min(3, Math.floor(this.dots)); i++) {
        sk.blob(R * 0.55 + i * 34, -R * 2.05, 8, 8, ID.dots + i, INK);
      }
    }

    if (this.speed > 0) {
      c.globalAlpha = Math.min(1, this.speed);
      for (let i = 0; i < 3; i++) {
        const y = -R * (0.5 + i * 0.4);
        const x = -R * 1.25 - (i % 2) * 30;
        sk.line([[x, y], [x - 50, y], [x - 90, y]], ID.speed + i, { width: LW * 0.6, amp: 1.5 });
      }
      c.globalAlpha = 1;
    }
  }
}

function ellipseSmall(x: number, y: number, rx: number, ry: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]);
  }
  return pts;
}
