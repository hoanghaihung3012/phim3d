// Draws one frame of "Ảnh gia đình": the living room, the cast, then the photo effects
// (flash, polaroid cards, Vịt's camera screen) and speech bubbles on top.
//
// Photos are real re-renders of the scene at the shutter time through Vịt's camera
// framing, so they always match what happened. They are made by evaluating the timeline
// at that moment, drawing offscreen, and evaluating back to the current time.
import { FILM } from '../../config/film';
import type { Timeline } from '../../core/Timeline';
import type { Camera2D } from '../../film2d/Camera2D';
import { DEFAULT_THEME, Sketch, box, type Pt, type SketchTheme } from '../../film2d/doodle/Sketch';
import { FONT_FAMILY, INK, LW } from '../../film2d/doodle/style';
import { PERFECT_PHOTO, PERFECT_T, PHOTO_TIMES, REC_START, type EpisodeCast } from './cast';

const PHOTO_W = 1280;
const PHOTO_H = 720;
const CAPTIONS = ['', 'TẤM 1', 'TẤM 2', 'TẤM 3', 'TẤM ĐẸP NHẤT'];

/** Room + characters for one camera matrix. */
function drawWorld(sk: Sketch, cast: EpisodeCast, t: number, camera: DOMMatrix): void {
  sk.setCamera(camera);
  cast.room.drawBack(sk, t);
  cast.me.draw(sk, t);
  cast.ba.draw(sk, t);
  sk.setCamera(camera);
  cast.room.drawSofa(sk);
  cast.nam.draw(sk, t);
  cast.tao.draw(sk, t);
  cast.sau.draw(sk, t);
  sk.setCamera(camera);
  cast.room.drawStool(sk);
  cast.vit.draw(sk, t);
}

export function createEpisodeDrawer(theme: SketchTheme = DEFAULT_THEME, DRAW_FPS = 12) {
  const photos = new Map<number, HTMLCanvasElement>();
  const lcdCanvas = document.createElement('canvas');
  lcdCanvas.width = PHOTO_W;
  lcdCanvas.height = PHOTO_H;
  let lcdKey = '';

  /** Renders the scene at film time tp through Vịt's camera into `cv`. */
  function snapshot(cast: EpisodeCast, tl: Timeline, tp: number, seed: number, cv: HTMLCanvasElement, view: Camera2D): void {
    const m = new DOMMatrix().scale(cv.width / FILM.width).multiply(view.matrix());
    tl.evaluate(tp);
    const sk = new Sketch(cv.getContext('2d')!);
    sk.theme = theme;
    sk.seed = seed;
    const c = sk.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = theme.paper;
    c.fillRect(0, 0, cv.width, cv.height);
    // The photo has no people's speech bubbles, but keeps everything else.
    drawWorld(sk, cast, tp, m);
  }

  function photo(cast: EpisodeCast, tl: Timeline, index: number): HTMLCanvasElement {
    let cv = photos.get(index);
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = PHOTO_W;
      cv.height = PHOTO_H;
      const tp = index === PERFECT_PHOTO ? PERFECT_T : PHOTO_TIMES[index];
      snapshot(cast, tl, tp, 0, cv, cast.photoCam);
      photos.set(index, cv);
    }
    return cv;
  }

  return function drawFrame(sk: Sketch, cast: EpisodeCast, t: number, tl: Timeline): void {
    sk.theme = theme;
    const { fx, room } = cast;
    // 1) Offscreen renders needed by this frame (they move the timeline, so restore after).
    const photoIndex = Math.round(fx.photo);
    const wantWall = room.photo > 0.5;
    const wantLcd = fx.lcd > 0.5;
    const scrubT = Math.round(fx.scrub * DRAW_FPS) / DRAW_FPS;
    let moved = false;
    let card: HTMLCanvasElement | null = null;
    if (photoIndex > 0) {
      moved ||= !photos.has(photoIndex);
      card = photo(cast, tl, photoIndex);
    }
    if (wantWall) {
      moved ||= !photos.has(PERFECT_PHOTO);
      room.photoImage = photo(cast, tl, PERFECT_PHOTO);
    }
    const { lcdCam } = cast;
    const key = `${scrubT}|${lcdCam.x}|${lcdCam.y}|${lcdCam.zoom}`;
    if (wantLcd && key !== lcdKey) {
      // snapshot() reads the camera matrix before it moves the timeline.
      snapshot(cast, tl, scrubT, Math.round(scrubT * DRAW_FPS) % 3, lcdCanvas, lcdCam);
      lcdKey = key;
      moved = true;
    }
    if (moved) tl.evaluate(t);

    // 2) The live scene.
    const c = sk.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = theme.paper;
    c.fillRect(0, 0, FILM.width, FILM.height);
    const jitter: [number, number] = [sk.jitter(999, 1), sk.jitter(999, 2)];
    const camera = cast.cam.matrix(1, jitter);
    drawWorld(sk, cast, t, camera);
    sk.setCamera(camera);
    cast.texts.drawWorld(sk, t);

    // 3) Overlays.
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (fx.rec > 0.5) drawRec(sk, t);
    if (card) drawPolaroid(sk, card, fx.photoTilt, fx.photoScale, CAPTIONS[photoIndex] ?? '');
    if (wantLcd) drawLcd(sk, lcdCanvas, scrubT, t);
    if (fx.flash > 0) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalAlpha = Math.min(1, fx.flash);
      c.fillStyle = '#FFFFFF';
      c.fillRect(0, 0, FILM.width, FILM.height);
      c.globalAlpha = 1;
    }
    cast.bubbles.draw(sk, t, camera);
    if (fx.fade > 0) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalAlpha = Math.min(1, fx.fade);
      c.fillStyle = '#1E2029';
      c.fillRect(0, 0, FILM.width, FILM.height);
      c.globalAlpha = 1;
    }
    cast.texts.dark = fx.fade > 0.5;
    cast.texts.drawScreen(sk, t);
  };
}

function dim(sk: Sketch, alpha: number): void {
  const c = sk.ctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = alpha;
  c.fillStyle = '#2B2D3A';
  c.fillRect(0, 0, FILM.width, FILM.height);
  c.globalAlpha = 1;
}

function rect(x0: number, y0: number, x1: number, y1: number): Pt[] {
  return [[x0, y0], [(x0 + x1) / 2, y0], [x1, y0], [x1, (y0 + y1) / 2], [x1, y1], [(x0 + x1) / 2, y1], [x0, y1], [x0, (y0 + y1) / 2]];
}

/** Sharp-cornered closed path (no smoothing), for photo edges. */
function boxPath(c: CanvasRenderingContext2D, pts: Pt[]): void {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
}

function text(c: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color = INK): void {
  c.font = `${size}px ${FONT_FAMILY}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillStyle = color;
  c.fillText(s, x, y);
}

function drawPolaroid(sk: Sketch, img: HTMLCanvasElement, tilt: number, scale: number, caption: string): void {
  const c = sk.ctx;
  dim(sk, 0.55);
  const pw = 1100;
  const ph = (pw * PHOTO_H) / PHOTO_W;
  const side = 34;
  const bottom = 120;
  c.save();
  c.translate(FILM.width / 2, FILM.height / 2 - 20);
  c.rotate(tilt);
  c.scale(scale, scale);
  const x0 = -pw / 2 - side;
  const y0 = -(ph + side + bottom) / 2;
  const card = rect(x0, y0, pw / 2 + side, y0 + side + ph + bottom);
  // Soft shadow, then the white card with a wobbly ink edge.
  c.globalAlpha = 0.25;
  boxPath(c, card.map(([x, y]) => [x + 18, y + 22] as Pt));
  c.fillStyle = '#000';
  c.fill();
  c.globalAlpha = 1;
  sk.shape(box(card[0][0], card[0][1], card[4][0], card[4][1], 8), 8800, { fill: '#FFFFFF', amp: 1 });
  c.drawImage(img, -pw / 2, y0 + side, pw, ph);
  boxPath(c, rect(-pw / 2, y0 + side, pw / 2, y0 + side + ph));
  c.lineWidth = LW * 0.6 * sk.theme.lineScale;
  c.strokeStyle = sk.ink;
  c.stroke();
  text(c, caption, 0, y0 + side + ph + bottom / 2 + 4, 62);
  c.restore();
}

function drawLcd(sk: Sketch, img: HTMLCanvasElement, scrubT: number, t: number): void {
  const c = sk.ctx;
  dim(sk, 0.6);
  const sw = 1240;
  const sh = (sw * PHOTO_H) / PHOTO_W;
  const cx = FILM.width / 2;
  const cy = FILM.height / 2 + 30;
  c.save();
  c.translate(cx, cy);
  // Back of the camera: a rounded grey body with two buttons.
  sk.shape(box(-sw / 2 - 70, -sh / 2 - 60, sw / 2 + 150, sh / 2 + 60, 60), 8900, { fill: '#6B7086', amp: 1.2 });
  for (let i = 0; i < 2; i++) sk.shape(ringPts(sw / 2 + 85, -60 + i * 120, 30), 8901 + i, { fill: '#9BA0B4', width: LW * 0.8 });
  c.drawImage(img, -sw / 2, -sh / 2, sw, sh);
  boxPath(c, rect(-sw / 2, -sh / 2, sw / 2, sh / 2));
  c.lineWidth = LW * 0.8 * sk.theme.lineScale;
  c.strokeStyle = sk.ink;
  c.stroke();
  // Playback UI drawn on the screen.
  const secs = Math.max(0, scrubT - REC_START);
  c.globalAlpha = 0.85;
  text(c, `▶ 00:0${secs.toFixed(1)}`, -sw / 2 + 150, -sh / 2 + 50, 40, '#FFFFFF');
  c.globalAlpha = 1;
  const bar = -sw / 2 + 60;
  const k = Math.min(1, secs / 4.5);
  c.fillStyle = 'rgba(255,255,255,0.55)';
  c.fillRect(bar, sh / 2 - 50, sw - 120, 10);
  c.fillStyle = '#FF5A5A';
  c.fillRect(bar, sh / 2 - 50, (sw - 120) * k, 10);
  if (Math.floor(t * 4) % 2 === 0) text(c, 'VIDEO', sw / 2 - 110, -sh / 2 + 50, 36, '#FFFFFF');
  c.restore();
}

function drawRec(sk: Sketch, t: number): void {
  const c = sk.ctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  // Viewfinder corners + blinking REC.
  const m = 60;
  const L = 90;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [FILM.width - m, m, -1, 1], [m, FILM.height - m, 1, -1], [FILM.width - m, FILM.height - m, -1, -1]] as const) {
    sk.line([[x, y + sy * L], [x, y], [x + sx * L, y]], 8950 + x + y, { width: LW * 0.9, color: '#FFFFFF' });
    sk.line([[x, y + sy * L], [x, y], [x + sx * L, y]], 8960 + x + y, { width: LW * 0.45 });
  }
  if (Math.floor(t * 2) % 2 === 0) sk.blob(m + 70, m + 70, 16, 16, 8970, '#FF5A5A');
  c.font = `46px ${FONT_FAMILY}`;
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.lineWidth = 10;
  c.strokeStyle = '#FFFFFF';
  c.strokeText('REC', m + 100, m + 72);
  c.fillStyle = INK;
  c.fillText('REC', m + 100, m + 72);
}

function ringPts(x: number, y: number, r: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 12; i++) pts.push([x + Math.cos((i / 12) * Math.PI * 2) * r, y + Math.sin((i / 12) * Math.PI * 2) * r]);
  return pts;
}
