// Nấm: a little mushroom in the same doodle style as Táo Lém (thick dark ink, flat pastel
// fills, dot eyes, blush). Lavender cap with white spots, a chubby cream stem with the face,
// noodle arms and stubby legs. The cap stays on the head; it acts by stretching when startled,
// pulling down when shy and drooping when sleepy.
import { Sketch, ellipse, quad, type Pt } from '../doodle/Sketch';
import { FONT_FAMILY, INK, LW } from '../doodle/style';

export const MUSH_EYES = ['dot', 'happy', 'closed', 'shock', 'half', 'wink'] as const;
export const MUSH_MOUTHS = ['smile', 'grin', 'o', 'flat', 'frown', 'wavy'] as const;

export const MUSH_COLORS = {
  cap: '#CDB4FF',
  capShade: '#B39AF0',
  spot: '#FFFFFF',
  stem: '#FFF4E2',
  stemShade: '#F3E0C4',
  gills: '#F3E0C4',
  blush: '#FF9DB0',
  drop: '#A9DBFF',
  spore: '#E9DDFF',
};

const STEM_BOTTOM = -40;
const STEM_TOP = -225;
const CAP_BASE = -205; // underside of the cap
const CAP_RX = 190;
const CAP_H = 165;
const FACE_Y = -102;
const SHOULDER_Y = -122;

const ID = {
  legL: 1101, legR: 1102, stem: 1103, armL: 1104, armR: 1105, cap: 1106, gills: 1107,
  spots: 1110, eyeL: 1120, eyeR: 1121, mouth: 1122, blushL: 1123, blushR: 1124, fx: 1130,
};

export class Mushroom2D {
  x = 0;
  /** Feet position. */
  y = 0;
  scale = 1;
  flip = 1;
  tilt = 0;
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
  // Cap acting
  capLift = 0; // px up; keep small: the cap never leaves the head
  capDown = 0; // px down over the eyes (shy)
  capTilt = 0; // radians (sleepy droop / cheeky)
  capSquash = 1; // < 1 flattens, > 1 stretches
  // Limbs: arm angle 0 hangs down, PI/2 sideways, PI straight up. Bend curls the forearm.
  armL = 0.25;
  armR = 0.25;
  bendL = 0;
  bendR = 0;
  run = 0;
  footL = 0;
  footR = 0;
  liftL = 0;
  liftR = 0;
  breath = 1;
  // Effects
  sweat = 0;
  sparkle = 0;
  question = 0;
  zzz = 0;
  /** 0..1 sneeze: a puff of spores. */
  spores = 0;
  heart = 0;

  private matrix(t: number): DOMMatrix {
    const bob = this.run > 0.5 ? 10 * Math.abs(Math.sin(t * 20)) : 0;
    return new DOMMatrix()
      .translate(this.x, this.y - bob * this.scale)
      .scale(this.scale * this.flip, this.scale)
      .rotate((this.tilt * 180) / Math.PI);
  }

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    c.save();
    c.setTransform(sk.camera.multiply(this.matrix(t)));
    this.drawLegs(sk, t);
    const breath = Math.sin(t * 2.3) * this.breath;
    c.scale(this.sx * (1 - 0.01 * breath), this.sy * (1 + 0.015 * breath));
    this.drawArms(sk, t);
    this.drawStem(sk);
    this.drawFace(sk, t);
    this.drawCap(sk, t);
    this.drawFx(sk, t);
    c.restore();
  }

  private drawLegs(sk: Sketch, t: number): void {
    let fL = this.footL;
    let fR = this.footR;
    let uL = this.liftL;
    let uR = this.liftR;
    if (this.run > 0.5) {
      const w = t * 20;
      fL += 22 * Math.sin(w);
      fR -= 22 * Math.sin(w);
      uL += Math.max(0, 18 * Math.cos(w));
      uR += Math.max(0, -18 * Math.cos(w));
    }
    for (const [side, dx, up, id] of [[-1, fL, uL, ID.legL], [1, fR, uR, ID.legR]] as const) {
      const hip: Pt = [side * 36, STEM_BOTTOM - 20];
      const foot: Pt = [side * 40 + dx, -up - 4];
      sk.tube(quad(hip, [(hip[0] + foot[0]) / 2, (hip[1] + foot[1]) / 2], foot, 5), id, 34, MUSH_COLORS.stem);
    }
  }

  private stemShape(): Pt[] {
    // Barrel: wider and rounder at the bottom.
    const pts: Pt[] = [];
    const n = 28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const s = Math.sin(a); // + = bottom
      const w = s > 0 ? 92 : 78 + 14 * (1 + s);
      const yMid = (STEM_TOP + STEM_BOTTOM) / 2;
      const h = (STEM_BOTTOM - STEM_TOP) / 2;
      pts.push([Math.cos(a) * w, yMid + s * h * (s > 0 ? 1 : 1.05)]);
    }
    return pts;
  }

  private drawStem(sk: Sketch): void {
    const c = sk.ctx;
    const body = sk.wobble(this.stemShape(), ID.stem, 1.4);
    c.save();
    sk.trace(body, true);
    c.fillStyle = MUSH_COLORS.stemShade;
    c.fill();
    c.clip();
    c.translate(-16, -10);
    sk.trace(body, true);
    c.fillStyle = MUSH_COLORS.stem;
    c.fill();
    c.restore();
    sk.trace(body, true);
    c.lineWidth = sk.px(LW);
    c.strokeStyle = INK;
    c.lineJoin = 'round';
    c.stroke();
  }

  private drawArms(sk: Sketch, t: number): void {
    for (const [side, ang, bend, id] of [[-1, this.armL, this.bendL, ID.armL], [1, this.armR, this.bendR, ID.armR]] as const) {
      const sh: Pt = [side * 80, SHOULDER_Y];
      const a = ang + 0.04 * Math.sin(t * 1.9 + side);
      const len = 80;
      const elbow: Pt = [sh[0] + side * Math.sin(a) * len * 0.55, sh[1] + Math.cos(a) * len * 0.55];
      const a2 = a + bend;
      const hand: Pt = [elbow[0] + side * Math.sin(a2) * len * 0.5, elbow[1] + Math.cos(a2) * len * 0.5];
      sk.tube([[side * 60, sh[1]], sh, elbow, hand], id, 22, MUSH_COLORS.stem, 0.9);
    }
  }

  private drawCap(sk: Sketch, t: number): void {
    const c = sk.ctx;
    const base = CAP_BASE - Math.min(this.capLift, 8) + this.capDown;
    c.save();
    c.translate(0, base);
    c.rotate(this.capTilt + (this.run > 0.5 ? Math.sin(t * 20) * 0.04 : 0));
    c.scale(1 / Math.sqrt(this.capSquash), this.capSquash);

    // Dome outline: half-ellipse on top, gently curved underside.
    const dome: Pt[] = [];
    const n = 30;
    for (let i = 0; i <= n; i++) {
      const a = Math.PI + (i / n) * Math.PI; // left -> top -> right
      const r = 1 + 0.04 * Math.sin(a * 3);
      dome.push([Math.cos(a) * CAP_RX * r, Math.sin(a) * CAP_H * r]);
    }
    const under = quad([CAP_RX - 4, 4], [0, 46], [-CAP_RX + 4, 4], 10);
    const capPts = sk.wobble([...dome, ...under.slice(1, -1)], ID.cap, 1.6);

    // Gills peeking out underneath.
    sk.shape(quad([-CAP_RX + 30, 10], [0, 56], [CAP_RX - 30, 10], 9), ID.gills, { fill: MUSH_COLORS.gills, width: LW * 0.7, amp: 0.8 });

    c.save();
    sk.trace(capPts, true);
    c.fillStyle = MUSH_COLORS.capShade;
    c.fill();
    c.clip();
    c.translate(-20, -18);
    sk.trace(capPts, true);
    c.fillStyle = MUSH_COLORS.cap;
    c.fill();
    c.restore();

    // White spots (clipped to the cap).
    c.save();
    sk.trace(capPts, true);
    c.clip();
    const spots: [number, number, number][] = [[-110, -60, 30], [-20, -120, 26], [70, -70, 34], [140, -20, 18], [-150, -8, 16], [10, -40, 14]];
    spots.forEach(([x, y, r], i) => sk.shape(ellipse(x, y, r, r * 0.85, 14), ID.spots + i, { fill: MUSH_COLORS.spot, width: LW * 0.55, amp: 0.7 }));
    c.restore();

    sk.trace(capPts, true);
    c.lineWidth = sk.px(LW);
    c.strokeStyle = INK;
    c.lineJoin = 'round';
    c.stroke();
    // Little shine.
    sk.line(quad([-140, -50], [-130, -100], [-90, -128], 6), ID.cap + 50, { width: LW * 1.1, color: '#FFFFFF' });
    c.restore();
  }

  private drawFace(sk: Sketch, t: number): void {
    const c = sk.ctx;
    let eyes = MUSH_EYES[Math.round(this.eyes)] ?? 'dot';
    const mouth = MUSH_MOUTHS[Math.round(this.mouth)] ?? 'smile';
    if (this.blink > 0.5 && (eyes === 'dot' || eyes === 'half') && (t + 0.7) % 3.9 < 0.12) eyes = 'closed';

    const lx = this.lookX * 12;
    const ly = this.lookY * 7;
    const ey = FACE_Y + ly;
    const thin = LW * 0.7;

    if (this.blush > 0) {
      c.globalAlpha = Math.min(1, 0.7 * this.blush);
      sk.blob(-52 + lx * 0.5, ey + 30, 18 * Math.min(1.3, this.blush), 10, ID.blushL, MUSH_COLORS.blush);
      sk.blob(52 + lx * 0.5, ey + 30, 18 * Math.min(1.3, this.blush), 10, ID.blushR, MUSH_COLORS.blush);
      c.globalAlpha = 1;
    }
    for (const [s, id] of [[-1, ID.eyeL], [1, ID.eyeR]] as const) {
      const x = s * 32 + lx;
      const kind = eyes === 'wink' ? (s < 0 ? 'happy' : 'dot') : eyes;
      switch (kind) {
        case 'dot':
          sk.blob(x, ey, 9, 13, id, INK);
          break;
        case 'shock':
          sk.blob(x, ey - 2, 5, 6, id, INK);
          sk.shape(ellipse(x, ey - 2, 15, 17, 14), id + 60, { width: LW * 0.5, amp: 0.5 });
          break;
        case 'half':
          sk.line([[x - 13, ey], [x, ey - 1], [x + 13, ey]], id, { width: thin });
          sk.blob(x, ey + 5, 8, 6, id + 60, INK);
          break;
        case 'happy':
          sk.line(quad([x - 13, ey + 5], [x, ey - 12], [x + 13, ey + 5], 6), id, { width: thin });
          break;
        case 'closed':
          sk.line(quad([x - 13, ey], [x, ey + 7], [x + 13, ey], 6), id, { width: thin });
          break;
      }
    }
    const mx = lx * 0.6;
    const my = FACE_Y + 34 + ly;
    const mw = LW * 0.6;
    switch (mouth) {
      case 'smile':
        sk.line(quad([mx - 13, my - 2], [mx, my + 10], [mx + 13, my - 2], 6), ID.mouth, { width: mw });
        break;
      case 'grin':
        sk.shape(quad([mx - 20, my - 4], [mx, my + 24], [mx + 20, my - 4], 8), ID.mouth, { fill: '#E46A6A', width: mw, amp: 0.5 });
        break;
      case 'o':
        sk.shape(ellipse(mx, my + 4, 8, 10, 12), ID.mouth, { fill: '#E46A6A', width: mw, amp: 0.4 });
        break;
      case 'flat':
        sk.line([[mx - 10, my + 2], [mx + 10, my + 2]], ID.mouth, { width: mw });
        break;
      case 'frown':
        sk.line(quad([mx - 12, my + 7], [mx, my - 4], [mx + 12, my + 7], 6), ID.mouth, { width: mw });
        break;
      case 'wavy':
        sk.line([[mx - 14, my + 3], [mx - 7, my - 2], [mx, my + 3], [mx + 7, my - 2], [mx + 14, my + 3]], ID.mouth, { width: mw, amp: 0.4 });
        break;
    }
  }

  private drawFx(sk: Sketch, t: number): void {
    const c = sk.ctx;
    const capTop = CAP_BASE - CAP_H - this.capLift + this.capDown;
    if (this.sweat > 0) {
      const x = 105;
      const y = FACE_Y - 30 + this.sweat * 40;
      sk.shape([[x, y - 22], [x + 11, y + 4], [x + 6, y + 13], [x - 6, y + 13], [x - 11, y + 4]], ID.fx, { fill: MUSH_COLORS.drop, width: LW * 0.6 });
    }
    if (this.spores > 0 && this.spores < 1) {
      const k = this.spores;
      c.globalAlpha = Math.min(1, (1 - k) * 2);
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i - 4) * 0.32;
        const r = 40 + k * (150 + (i % 3) * 30);
        sk.shape(ellipse(Math.cos(a) * r, capTop + 30 + Math.sin(a) * r, 9 + (i % 3) * 3, 9 + (i % 3) * 3, 10), ID.fx + 10 + i, {
          fill: MUSH_COLORS.spore,
          width: LW * 0.45,
          amp: 0.4,
        });
      }
      c.globalAlpha = 1;
    }
    if (this.sparkle > 0) {
      const spots: Pt[] = [[-230, capTop + 40], [225, capTop + 70], [170, capTop - 30]];
      spots.forEach(([x, y], i) => {
        const s = 15 * this.sparkle * (0.7 + 0.3 * Math.abs(Math.sin(t * 5 + i)));
        c.fillStyle = '#FFD86B';
        c.strokeStyle = INK;
        c.lineWidth = sk.px(LW * 0.45);
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
    const word = (text: string, x: number, y: number, size: number, rot = 0) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.font = `${size}px ${FONT_FAMILY}`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = INK;
      c.fillText(text, 0, 0);
      c.restore();
    };
    if (this.question > 0) word('?', 200, capTop + 10 + Math.sin(t * 6) * 4, 80 * this.question, 0.2);
    if (this.zzz > 0) for (let i = 0; i < Math.min(3, Math.floor(this.zzz)); i++) word('z', 170 + i * 34, capTop + 20 - i * 38, 38 + i * 12, 0.15);
    if (this.heart > 0) {
      const x = -200;
      const y = capTop + 20 - (t % 1) * 20;
      const s = 1.2 * this.heart;
      sk.shape(
        [[x, y + 18 * s], [x - 24 * s, y - 2 * s], [x - 22 * s, y - 18 * s], [x - 8 * s, y - 22 * s], [x, y - 10 * s], [x + 8 * s, y - 22 * s], [x + 22 * s, y - 18 * s], [x + 24 * s, y - 2 * s]],
        ID.fx + 30,
        { fill: '#FF8FA3', width: LW * 0.6, amp: 0.6 },
      );
    }
  }
}
