// Shared doodle face parts for the Táo family cast (Ba, Mẹ, Vịt, Sâu): dot eyes, simple
// mouths, eyebrows and blush, in the same ink as Táo and Nấm.
import { Sketch, quad, type Pt } from '../doodle/Sketch';
import { INK, LW } from '../doodle/style';

export const FACE_EYES = ['dot', 'happy', 'closed', 'shock', 'half', 'squeeze', 'side'] as const;
export const FACE_MOUTHS = ['smile', 'grin', 'o', 'flat', 'frown', 'wavy', 'sneeze', 'none'] as const;
export type FaceEye = (typeof FACE_EYES)[number];
export type FaceMouth = (typeof FACE_MOUTHS)[number];

/** Anything that has keyable eyes / mouth indices into FACE_EYES / FACE_MOUTHS. */
export interface HasFace {
  eyes: number;
  mouth: number;
}

export function eyeOf(v: number): FaceEye {
  return FACE_EYES[Math.round(v)] ?? 'dot';
}

export function mouthOf(v: number, talk: number, t: number): FaceMouth {
  const m = FACE_MOUTHS[Math.round(v)] ?? 'smile';
  // Chatty mouths flap open and shut a few times per second.
  if (talk > 0.5 && Math.floor(t * 7) % 2 === 0) return m === 'grin' ? 'o' : 'grin';
  return m;
}

/** One eye centered at (x, y); `s` is the side (-1 left, 1 right), `r` the dot size. */
export function drawEye(sk: Sketch, kind: FaceEye, x: number, y: number, r: number, s: number, id: number): void {
  const thin = LW * 0.7;
  switch (kind) {
    case 'dot':
      sk.blob(x, y, r * 0.8, r * 1.15, id, INK);
      break;
    case 'side':
      sk.blob(x + r * 0.5, y, r * 0.75, r * 1.1, id, INK);
      break;
    case 'shock':
      sk.shape(ring(x, y, r * 1.5), id, { fill: '#FFFFFF', width: thin, amp: 0.5 });
      sk.blob(x, y, r * 0.45, r * 0.55, id + 50, INK);
      break;
    case 'happy':
      sk.line(quad([x - r * 1.3, y + r * 0.5], [x, y - r * 1.3], [x + r * 1.3, y + r * 0.5], 6), id, { width: thin, amp: 0.7 });
      break;
    case 'closed':
      sk.line(quad([x - r * 1.3, y], [x, y + r * 0.8], [x + r * 1.3, y], 6), id, { width: thin, amp: 0.7 });
      break;
    case 'half': {
      const c = sk.ctx;
      c.save();
      c.beginPath();
      c.rect(x - r * 2, y, r * 4, r * 3);
      c.clip();
      sk.blob(x, y + r * 0.2, r * 0.8, r * 1.1, id, INK);
      c.restore();
      sk.line([[x - r * 1.4, y], [x, y - r * 0.1], [x + r * 1.4, y]], id + 50, { width: thin, amp: 0.6 });
      break;
    }
    case 'squeeze':
      // ">  <": eyes squeezed shut (sneeze, strain).
      sk.line([[x - s * r * 1.2, y - r], [x + s * r * 0.9, y], [x - s * r * 1.2, y + r]], id, { width: thin, amp: 0.6 });
      break;
  }
}

export function drawMouth(sk: Sketch, kind: FaceMouth, x: number, y: number, w: number, id: number): void {
  const mw = LW * 0.6;
  switch (kind) {
    case 'smile':
      sk.line(quad([x - w, y - w * 0.25], [x, y + w * 0.75], [x + w, y - w * 0.25], 7), id, { width: mw, amp: 0.5 });
      break;
    case 'grin': {
      const pts: Pt[] = [...quad([x - w * 1.1, y - w * 0.3], [x, y - w * 0.1], [x + w * 1.1, y - w * 0.3], 5), ...quad([x + w * 1.1, y - w * 0.3], [x, y + w * 1.6], [x - w * 1.1, y - w * 0.3], 7).slice(1, -1)];
      sk.shape(pts, id, { fill: '#E2707A', width: mw, amp: 0.5 });
      break;
    }
    case 'o':
      sk.shape(ring(x, y + w * 0.2, w * 0.45, w * 0.6), id, { fill: '#E2707A', width: mw, amp: 0.4 });
      break;
    case 'sneeze':
      sk.shape(ring(x, y + w * 0.4, w * 0.9, w * 1.0), id, { fill: '#E2707A', width: mw, amp: 0.6 });
      break;
    case 'flat':
      sk.line([[x - w * 0.7, y], [x, y + 1], [x + w * 0.7, y]], id, { width: mw, amp: 0.5 });
      break;
    case 'frown':
      sk.line(quad([x - w * 0.8, y + w * 0.4], [x, y - w * 0.5], [x + w * 0.8, y + w * 0.4], 6), id, { width: mw, amp: 0.5 });
      break;
    case 'wavy':
      sk.line([[x - w, y + 2], [x - w * 0.5, y - 4], [x, y + 2], [x + w * 0.5, y - 4], [x + w, y + 2]], id, { width: mw, amp: 0.4 });
      break;
    case 'none':
      break;
  }
}

/** Eyebrows: 1 angry (slanted in), 2 worried (slanted out, raised). */
export function drawBrows(sk: Sketch, kind: number, x: number, y: number, gap: number, w: number, id: number): void {
  const k = Math.round(kind);
  if (k === 0) return;
  for (const s of [-1, 1]) {
    const inner: Pt = [x + s * gap * 0.55, y + (k === 1 ? w * 0.35 : -w * 0.3)];
    const outer: Pt = [x + s * (gap * 0.55 + w), y + (k === 1 ? -w * 0.3 : w * 0.2)];
    sk.line([inner, outer], id + (s > 0 ? 1 : 0), { width: LW * 0.75, amp: 0.6 });
  }
}

export function drawBlush(sk: Sketch, x: number, y: number, gap: number, rx: number, amount: number, color: string, id: number): void {
  if (amount <= 0) return;
  const c = sk.ctx;
  c.globalAlpha = Math.min(1, 0.55 * amount);
  sk.blob(x - gap, y, rx, rx * 0.55, id, color);
  sk.blob(x + gap, y, rx, rx * 0.55, id + 1, color);
  c.globalAlpha = 1;
}

export function drawSweat(sk: Sketch, x: number, y: number, size: number, id: number): void {
  const s = size;
  const drop: Pt[] = [[x, y - s * 1.6], [x + s * 0.55, y - s * 0.5], [x + s * 0.8, y + s * 0.4], [x + s * 0.35, y + s], [x - s * 0.35, y + s], [x - s * 0.8, y + s * 0.4], [x - s * 0.55, y - s * 0.5]];
  sk.shape(drop, id, { fill: '#A9DBFF', width: LW * 0.6, amp: 0.5 });
}

export function ring(x: number, y: number, rx: number, ry = rx, n = 14): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]);
  }
  return pts;
}
