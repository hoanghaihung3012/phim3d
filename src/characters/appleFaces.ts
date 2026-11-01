import * as THREE from 'three';

/**
 * Táo Lém's faces, drawn as thick black marker strokes on a transparent
 * canvas. The canvas is mapped onto a patch of the apple's surface, so it
 * looks like someone drew a face on a real apple with a marker.
 */
export const APPLE_FACES = ['bored', 'side_eye', 'shock', 'smug', 'happy', 'bite'] as const;
export type AppleFace = (typeof APPLE_FACES)[number];

/** Index helper for keyframes: tl.key(apple, 'face', [[4, FACE.shock, 'step']]) */
export const FACE = Object.fromEntries(APPLE_FACES.map((f, i) => [f, i])) as Record<AppleFace, number>;

const W = 512;
const H = 384;
const INK = '#1d1420';

export function createFaceTextures(): THREE.CanvasTexture[] {
  return APPLE_FACES.map((face) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const g = canvas.getContext('2d')!;
    g.strokeStyle = INK;
    g.fillStyle = INK;
    g.lineWidth = 16;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    DRAW[face](g);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  });
}

// Eye centres (canvas px). The patch spans ~90° of the apple, centre = front.
const LX = 190;
const RX = 322;
const EY = 170;
const MY = 255;

function line(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}

/** Half-closed eye: a lid line over the lower half of a pupil. */
function sleepyEye(g: CanvasRenderingContext2D, x: number, lookX = 0) {
  g.save();
  g.beginPath();
  g.rect(x - 40, EY - 2, 80, 40);
  g.clip();
  g.beginPath();
  g.arc(x + lookX, EY + 4, 20, 0, Math.PI * 2);
  g.fill();
  g.restore();
  line(g, x - 34, EY - 2, x + 34, EY - 2);
}

const DRAW: Record<AppleFace, (g: CanvasRenderingContext2D) => void> = {
  bored(g) {
    sleepyEye(g, LX);
    sleepyEye(g, RX);
    line(g, 226, MY, 286, MY);
  },
  side_eye(g) {
    sleepyEye(g, LX, 16);
    sleepyEye(g, RX, 16);
    // Slightly slanted flat mouth.
    line(g, 228, MY + 4, 286, MY - 4);
  },
  shock(g) {
    for (const x of [LX, RX]) {
      g.lineWidth = 12;
      g.beginPath();
      g.arc(x, EY, 40, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(x, EY, 9, 0, Math.PI * 2);
      g.fill();
    }
    g.lineWidth = 12;
    g.beginPath();
    g.ellipse(256, MY + 16, 12, 16, 0, 0, Math.PI * 2);
    g.stroke();
  },
  smug(g) {
    sleepyEye(g, LX, 6);
    sleepyEye(g, RX, 6);
    // Flat mouth with one corner hooked up.
    g.beginPath();
    g.moveTo(222, MY);
    g.lineTo(272, MY);
    g.quadraticCurveTo(292, MY - 2, 298, MY - 22);
    g.stroke();
  },
  happy(g) {
    for (const x of [LX, RX]) {
      g.beginPath();
      g.arc(x, EY + 14, 26, Math.PI * 1.1, Math.PI * 1.9);
      g.stroke();
    }
    g.beginPath();
    g.arc(256, MY - 14, 30, Math.PI * 0.15, Math.PI * 0.85);
    g.stroke();
  },
  bite(g) {
    sleepyEye(g, LX);
    sleepyEye(g, RX);
    // Clenched mouth: a short line with a tiny knot of string in it.
    line(g, 232, MY, 280, MY);
    g.beginPath();
    g.arc(256, MY, 8, 0, Math.PI * 2);
    g.fill();
  },
};
