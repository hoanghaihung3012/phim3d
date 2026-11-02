// "Táo Lém" as a flat 2D doodle: thick dark rounded outline, flat fill, dot eyes, blush.
// The whole character is drawn procedurally from a Pose each frame, so every expression
// is just numbers (easy to keyframe later from the film timeline).
import { Sketch, quad, type Pt } from './sketch';

export type EyeKind = 'dot' | 'half' | 'shock' | 'happy' | 'closed' | 'smug';
export type MouthKind = 'none' | 'flat' | 'o' | 'smirk' | 'smile' | 'wavy';

export interface Pose {
  /** Body lift above the ground in px (jumps, falls). */
  lift: number;
  /** Squash & stretch around the bottom of the apple. */
  sx: number;
  sy: number;
  /** Lean in radians, pivoting on the feet. */
  tilt: number;
  eyes: EyeKind;
  /** Pupil offset, -1..1. */
  lookX: number;
  lookY: number;
  mouth: MouthKind;
  /** Leaf angle offset in radians: + perks up, - droops. */
  leaf: number;
  /** Stem twitch in px. */
  stem: number;
  /** Arm angles in radians: 0 hangs down, PI/2 sideways, PI straight up. */
  armL: number;
  armR: number;
  /** Foot x offsets (px) and foot lifts (px) for walking/running. */
  footL: number;
  footR: number;
  liftL: number;
  liftR: number;
  blush: number;
  fx: {
    sweat?: number; // 0..1 slide progress
    sigh?: number; // 0..1 puff progress
    sparkle?: number; // 0..1 intensity
    dots?: number; // number of "..." dots shown (0-3)
    speed?: number; // motion lines 0..1
  };
}

export function restPose(): Pose {
  return {
    lift: 0, sx: 1, sy: 1, tilt: 0,
    eyes: 'dot', lookX: 0, lookY: 0, mouth: 'flat',
    leaf: 0, stem: 0, armL: 0.25, armR: 0.25,
    footL: 0, footR: 0, liftL: 0, liftR: 0,
    blush: 1, fx: {},
  };
}

export interface Palette {
  label: string;
  fill: string;
  shade: string;
  blush: string;
  shine: string | null;
  stem: string;
  leaf: string;
}

export const PALETTES: Record<string, Palette> = {
  red: { label: 'Táo đỏ', fill: '#FF8C82', shade: '#F26B66', blush: '#FF5577', shine: '#FFFFFF', stem: '#9C6B45', leaf: '#9ADB8F' },
  green: { label: 'Táo xanh', fill: '#CDEFA4', shade: '#ADDC82', blush: '#FF9DB0', shine: '#FFFFFF', stem: '#9C6B45', leaf: '#7FCB7A' },
  ink: { label: 'Nét trắng', fill: '#FFFFFF', shade: '#E6E7F2', blush: '#FFB3C1', shine: null, stem: '#FFFFFF', leaf: '#FFFFFF' },
};

/** Texture size; the ground line and body size are in these pixels. */
export const CANVAS_SIZE = 1024;
export const GROUND = 800;
const R = 205; // apple radius
const LEG = 50; // visible leg length
const INK = '#3A3F4E';
const LW = 11;

// Stroke ids (keep stable so each stroke boils independently).
const ID = {
  body: 1, shine: 2, stem: 3, leaf: 4, vein: 5, armL: 6, armR: 7, legL: 8, legR: 9,
  eyeL: 10, eyeR: 11, lidL: 12, lidR: 13, mouth: 14, blushL: 15, blushR: 16,
  sweat: 17, puff: 18, spark: 19, dots: 20, speed: 21, shadow: 22,
};

/** Apple outline in local space: origin at the bottom of the apple, y down. */
function appleShape(n = 72): Pt[] {
  const cy = -R * 0.87;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const th = -Math.PI / 2 + (i / n) * Math.PI * 2; // start at the top dimple
    const s = Math.sin(th);
    let x = R * 1.06 * Math.cos(th);
    let y = R * 0.92 * s;
    if (s > 0) x *= 1 - 0.13 * s * s; // narrower bottom
    const dTop = (th + Math.PI / 2) / 0.3;
    const dTop2 = (th - Math.PI * 1.5) / 0.3; // same dimple, other end of the range
    y += R * 0.2 * (Math.exp(-dTop * dTop) + Math.exp(-dTop2 * dTop2));
    const dBot = (th - Math.PI / 2) / 0.22;
    y -= R * 0.05 * Math.exp(-dBot * dBot);
    pts.push([x, y + cy]);
  }
  return pts;
}
const APPLE = appleShape();
const TOP_DIP_Y = APPLE[0][1];
const FACE_Y = -R * 0.86;

export class AppleDoodle {
  readonly canvas: HTMLCanvasElement;
  private sk: Sketch;
  palette: Palette = PALETTES.red;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = CANVAS_SIZE;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.sk = new Sketch(ctx, INK, LW);
  }

  draw(p: Pose, boilSeed: number): void {
    const sk = this.sk;
    const c = sk.ctx;
    sk.seed = boilSeed;
    c.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const cx = CANVAS_SIZE / 2;

    this.drawShadow(cx, p.lift);

    c.save();
    c.translate(cx, GROUND - p.lift);
    c.rotate(p.tilt);
    this.drawLegs(p);
    c.translate(0, -LEG);
    c.scale(p.sx, p.sy);
    this.drawArms(p);
    this.drawStem(p);
    this.drawBody();
    this.drawLeaf(p);
    this.drawFace(p);
    this.drawFx(p);
    c.restore();
  }

  private drawShadow(cx: number, lift: number): void {
    const c = this.sk.ctx;
    const k = Math.max(0.35, 1 - lift / 500);
    c.fillStyle = `rgba(58, 63, 78, ${0.1 * k})`;
    c.beginPath();
    c.ellipse(cx, GROUND + 4, R * 0.95 * k, 16 * k, 0, 0, Math.PI * 2);
    c.fill();
  }

  private drawLegs(p: Pose): void {
    const sk = this.sk;
    const legs: [number, number, number, number][] = [
      [-1, p.footL, p.liftL, ID.legL],
      [1, p.footR, p.liftR, ID.legR],
    ];
    for (const [side, dx, up, id] of legs) {
      const hip: Pt = [side * 52 * p.sx, -LEG - 26];
      const foot: Pt = [side * 54 + dx, -up - 4];
      sk.tube(quad(hip, [(hip[0] + foot[0]) / 2, (hip[1] + foot[1]) / 2], foot, 5), id, 40, this.palette.fill, 1);
    }
  }

  private drawArms(p: Pose): void {
    const sk = this.sk;
    const arms: [number, number, number][] = [
      [-1, p.armL, ID.armL],
      [1, p.armR, ID.armR],
    ];
    for (const [side, ang, id] of arms) {
      const sh: Pt = [side * R * 0.88, -R * 0.62];
      const len = 82;
      const hand: Pt = [sh[0] + side * Math.sin(ang) * len, sh[1] + Math.cos(ang) * len];
      // Bend the noodle slightly outward so it never looks like a stick.
      const mid: Pt = [(sh[0] + hand[0]) / 2 + side * 10, (sh[1] + hand[1]) / 2 + 6];
      sk.tube(quad(sh, mid, hand, 6), id, 22, this.palette.fill, 1.2);
    }
  }

  private drawStem(p: Pose): void {
    const sk = this.sk;
    const base: Pt = [0, TOP_DIP_Y + 30];
    const tip: Pt = [12 + p.stem, TOP_DIP_Y - 58];
    sk.tube(quad(base, [-8, TOP_DIP_Y - 20], tip, 6), ID.stem, 15, this.palette.stem, 1);
  }

  private drawLeaf(p: Pose): void {
    const sk = this.sk;
    const c = sk.ctx;
    const at: Pt = [4 + p.stem * 0.5, TOP_DIP_Y - 28];
    const a = 0.45 + p.leaf;
    const dir: Pt = [Math.cos(a), -Math.sin(a)];
    const nrm: Pt = [-dir[1], dir[0]];
    const L = 92;
    const W = 30;
    const tip: Pt = [at[0] + dir[0] * L, at[1] + dir[1] * L];
    const side = (s: number): Pt[] =>
      quad(at, [at[0] + dir[0] * L * 0.5 + nrm[0] * W * s, at[1] + dir[1] * L * 0.5 + nrm[1] * W * s], tip, 9);
    const top = side(1);
    const bot = side(-1).reverse();
    const pts = sk.wobble([...top, ...bot.slice(1, -1)], ID.leaf, 1.4);
    sk.trace(pts, true);
    c.fillStyle = this.palette.leaf;
    c.fill();
    c.lineWidth = LW * 0.85;
    c.strokeStyle = INK;
    c.lineJoin = 'round';
    c.stroke();
    sk.line(quad(at, [at[0] + dir[0] * L * 0.4 + nrm[0] * 4, at[1] + dir[1] * L * 0.4 + nrm[1] * 4], [at[0] + dir[0] * L * 0.7, at[1] + dir[1] * L * 0.7], 5), ID.vein, { width: LW * 0.5 });
  }

  private drawBody(): void {
    const sk = this.sk;
    const c = sk.ctx;
    const pal = this.palette;
    const body = sk.wobble(APPLE, ID.body, 2.6);

    // Flat fill with a soft crescent of shade on the lower right (like a felt-tip second pass).
    c.save();
    sk.trace(body, true);
    c.fillStyle = pal.shade;
    c.fill();
    c.clip();
    c.translate(-26, -22);
    c.scale(0.985, 0.985);
    sk.trace(body, true);
    c.fillStyle = pal.fill;
    c.fill();
    c.restore();

    if (pal.shine) {
      sk.line(quad([-R * 0.72, -R * 1.05], [-R * 0.72, -R * 1.38], [-R * 0.42, -R * 1.5], 6), ID.shine, {
        width: 12, color: pal.shine,
      });
    }

    // Outline with a tiny gap on the upper left, like a pen lifted off the paper.
    const open = [...body.slice(64), ...body.slice(0, 62)];
    sk.trace(open, false);
    c.lineWidth = LW;
    c.strokeStyle = INK;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.stroke();
  }

  private drawFace(p: Pose): void {
    const sk = this.sk;
    const c = sk.ctx;
    const ex = R * 0.31;
    const lx = p.lookX * 16;
    const ly = p.lookY * 8 + FACE_Y;

    // Blush first so the eyes sit on top.
    if (p.blush > 0) {
      c.globalAlpha = Math.min(1, 0.55 * p.blush);
      for (const [s, id] of [[-1, ID.blushL], [1, ID.blushR]] as const) {
        sk.blob(s * R * 0.52 + lx * 0.4, FACE_Y + 46, 28 * Math.min(1.25, p.blush), 15, id, this.palette.blush, 1);
      }
      c.globalAlpha = 1;
    }

    for (const [s, id, lid] of [[-1, ID.eyeL, ID.lidL], [1, ID.eyeR, ID.lidR]] as const) {
      const x = s * ex + lx;
      const y = ly;
      switch (p.eyes) {
        case 'dot':
          sk.blob(x, y, 12, 19, id, INK);
          break;
        case 'shock':
          sk.blob(x, y - 4, 7, 9, id, INK);
          break;
        case 'half':
        case 'smug': {
          // Deadpan: the dot is cut by a flat (or slanted, for smug) lid line.
          const slant = p.eyes === 'smug' ? s * -7 : 0;
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
          sk.line([[x - 21, y - 1 - slant * 0.7], [x, y - 2], [x + 21, y - 1 + slant * 0.7]], lid, { width: LW * 0.7, amp: 1 });
          break;
        }
        case 'happy':
          sk.line(quad([x - 18, y + 8], [x, y - 18], [x + 18, y + 8], 6), id, { width: LW * 0.75, amp: 1 });
          break;
        case 'closed':
          sk.line(quad([x - 18, y], [x, y + 10], [x + 18, y], 6), id, { width: LW * 0.75, amp: 1 });
          break;
      }
    }

    const mx = lx * 0.6;
    const my = FACE_Y + 44;
    const mw = LW * 0.6;
    switch (p.mouth) {
      case 'flat':
        sk.line([[mx - 13, my], [mx, my + 1], [mx + 13, my]], ID.mouth, { width: mw, amp: 0.8 });
        break;
      case 'o':
        c.lineWidth = mw;
        c.strokeStyle = INK;
        c.beginPath();
        c.ellipse(mx, my + 2, 7, 9, 0, 0, Math.PI * 2);
        c.stroke();
        break;
      case 'smirk':
        sk.line(quad([mx - 14, my + 2], [mx + 6, my + 6], [mx + 17, my - 9], 6), ID.mouth, { width: mw, amp: 0.8 });
        break;
      case 'smile':
        sk.line(
          [...quad([mx - 15, my - 3], [mx - 7, my + 10], [mx, my], 5), ...quad([mx, my], [mx + 7, my + 10], [mx + 15, my - 3], 5).slice(1)],
          ID.mouth, { width: mw, amp: 0.6 },
        );
        break;
      case 'wavy':
        sk.line([[mx - 16, my + 3], [mx - 8, my - 3], [mx, my + 3], [mx + 8, my - 3], [mx + 16, my + 3]], ID.mouth, { width: mw, amp: 0.6 });
        break;
      case 'none':
        break;
    }
  }

  private drawFx(p: Pose): void {
    const sk = this.sk;
    const c = sk.ctx;
    const fx = p.fx;

    if (fx.sweat) {
      const x = R * 0.78;
      const y = -R * 1.45 + fx.sweat * 40;
      const drop: Pt[] = [
        [x, y - 26], [x + 9, y - 8], [x + 13, y + 6], [x + 6, y + 16], [x - 6, y + 16], [x - 13, y + 6], [x - 9, y - 8],
      ];
      sk.trace(sk.wobble(drop, ID.sweat, 0.8), true);
      c.fillStyle = '#A9DBFF';
      c.fill();
      c.lineWidth = LW * 0.6;
      c.strokeStyle = INK;
      c.stroke();
    }

    if (fx.sigh) {
      const k = fx.sigh;
      c.globalAlpha = Math.min(1, (1 - k) * 2.5);
      for (let i = 0; i < 3; i++) {
        const r = 10 + i * 7 + k * 10;
        const x = -R * 1.2 - i * 34 - k * 70;
        const y = FACE_Y + 40 - i * 10 - k * 20;
        c.lineWidth = LW * 0.55;
        c.strokeStyle = INK;
        c.beginPath();
        c.arc(x + sk.jitter(ID.puff + i) * 1.5, y, r, 0, Math.PI * 2);
        c.stroke();
      }
      c.fillStyle = INK;
      c.font = '44px Itim, "Comic Sans MS", system-ui, sans-serif';
      c.textAlign = 'right';
      c.fillText('haizz', -R * 1.15 - k * 90, FACE_Y - 40 - k * 30);
      c.globalAlpha = 1;
    }

    if (fx.sparkle) {
      const spots: Pt[] = [[-R * 1.15, -R * 1.5], [R * 1.2, -R * 1.25], [R * 0.95, -R * 1.9]];
      spots.forEach(([x, y], i) => {
        const s = (14 + 6 * sk.jitter(ID.spark + i)) * fx.sparkle!;
        if (s <= 1) return;
        c.fillStyle = '#FFD86B';
        c.strokeStyle = INK;
        c.lineWidth = LW * 0.45;
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

    if (fx.dots) {
      for (let i = 0; i < Math.min(3, fx.dots); i++) {
        sk.blob(R * 0.55 + i * 34, -R * 2.05, 8, 8, ID.dots + i, INK);
      }
    }

    if (fx.speed) {
      c.globalAlpha = fx.speed;
      for (let i = 0; i < 3; i++) {
        const y = -R * (0.5 + i * 0.4);
        const x = -R * 1.25 - (i % 2) * 30;
        sk.line([[x, y], [x - 50, y], [x - 90, y]], ID.speed + i, { width: LW * 0.6, amp: 2 });
      }
      c.globalAlpha = 1;
    }
  }
}
