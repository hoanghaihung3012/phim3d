// One frame of "Con vật cưng": sky, yard with a picket fence and the banner, the cast sorted
// back to front, Sâu's red cushion, words, bubbles, and the opening / closing iris.
import { FILM, REELS_SAFE } from '../../config/film';
import { box, ellipse, type Sketch } from '../../film2d/doodle/Sketch';
import { FONT_FAMILY, INK, LW } from '../../film2d/doodle/style';
import type { ConVatCungCast } from './cast';

export function drawConVatCungFrame(sk: Sketch, cast: ConVatCungCast, t: number): void {
  const c = sk.ctx;
  const { fx } = cast;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  const camera = cast.cam.matrix(1, [sk.jitter(999, 1), sk.jitter(999, 2)]);

  cast.meadow.drawSky(sk, FILM.width, FILM.height);
  sk.setCamera(camera);
  cast.meadow.draw(sk, t);
  drawFence(sk);
  drawBanner(sk);

  // Back to front by feet position.
  const { tao, vit, sau, ga, cho, meo } = cast;
  const layers: [number, () => void][] = [
    [vit.y, () => vit.draw(sk, t)],
    [ga.y, () => ga.draw(sk, t)],
    [cho.y, () => cho.draw(sk, t)],
    [meo.y, () => meo.draw(sk, t)],
    [tao.y + 1, () => tao.draw(sk, t)],
    [sau.y + (fx.carry > 0.5 ? 400 : 0), () => drawSauOnCushion(sk, cast, t)],
  ];
  layers.sort((a, b) => a[0] - b[0]);
  for (const [, draw] of layers) {
    sk.setCamera(camera);
    draw();
  }
  sk.setCamera(camera);
  if (fx.leaf > 0.5) drawLeaf(sk, fx.leafX, fx.leafY, t);
  cast.texts.drawWorld(sk, t);
  cast.bubbles.draw(sk, t, camera);
  drawIris(sk, fx.iris, fx.irisX, fx.irisY);
  cast.texts.drawScreen(sk, t);

  if (fx.guides > 0.5) drawSafeGuides(sk);
}

/** White picket fence along the back of the yard. */
function drawFence(sk: Sketch): void {
  const base = -14;
  const h = 170;
  for (let i = 0; i < 30; i++) {
    const x = -1650 + i * 115;
    sk.shape([[x - 30, base], [x - 30, base - h + 26], [x, base - h], [x + 30, base - h + 26], [x + 30, base]], 7900 + i, { fill: '#FFFFFF', width: LW * 0.75 });
  }
  for (const y of [base - 50, base - 120]) {
    sk.shape(box(-1700, y - 12, 1700, y + 12, 4), 7940 + (y === base - 50 ? 0 : 1), { fill: '#FFFFFF', width: LW * 0.7 });
  }
}

/** Hand-painted cloth banner hung on the fence: "KHOE THÚ CƯNG". */
function drawBanner(sk: Sketch): void {
  const c = sk.ctx;
  const x0 = -330;
  const x1 = 330;
  const y0 = -262;
  const y1 = -150;
  sk.line([[x0, y0], [x0 - 20, -134]], 7950, { width: LW * 0.5 });
  sk.line([[x1, y0], [x1 + 20, -134]], 7951, { width: LW * 0.5 });
  sk.shape([[x0, y0], [0, y0 + 14], [x1, y0], [x1 - 6, y1], [0, y1 + 14], [x0 + 6, y1]], 7952, { fill: '#FFE3EC', width: LW * 0.85 });
  c.save();
  c.translate(0, (y0 + y1) / 2 + 12);
  c.rotate(-0.02);
  c.font = `64px ${FONT_FAMILY}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillStyle = '#FF6B6B';
  c.fillText('KHOE THÚ CƯNG', 0, 0);
  c.restore();
  // Little paw prints on both ends.
  for (const s of [-1, 1]) {
    const px = s * 280;
    const py = (y0 + y1) / 2 + 10;
    sk.blob(px, py + 8, 12, 10, 7953 + s, INK);
    for (const [dx, dy] of [[-14, -10], [0, -16], [14, -10]] as const) sk.blob(px + dx, py + dy, 4, 4, 7956 + dx, INK);
  }
}

/** Sâu lying on a plump red cushion (the cushion moves with Sâu). */
function drawSauOnCushion(sk: Sketch, cast: ConVatCungCast, t: number): void {
  const { sau } = cast;
  if (sau.visible < 0.5) return;
  const x = sau.x - 20 * sau.flip;
  const y = sau.y;
  sk.shape(ellipse(x, y - 4, 120, 30, 28), 7960, { fill: '#FF8C82' });
  sk.line([[x - 90, y - 10], [x + 90, y - 10]], 7961, { width: LW * 0.4 });
  for (const s of [-1, 1]) {
    sk.blob(x + s * 122, y + 6, 10, 10, 7962 + s, '#FFD84D');
  }
  sau.draw(sk, t);
}

function drawLeaf(sk: Sketch, x: number, y: number, t: number): void {
  const c = sk.ctx;
  const m = c.getTransform();
  c.translate(x, y + 20 * Math.sin(t * 5));
  c.rotate(t * 3);
  c.scale(1.7, 1.7);
  sk.shape([[-26, 0], [0, -13], [26, 0], [0, 13]], 7970, { fill: '#9ADB8F', width: LW * 0.55, amp: 0.3 });
  sk.line([[-22, 0], [22, 0]], 7971, { width: LW * 0.3 });
  c.setTransform(m);
}

/** Dark frame with a round hole of radius `open` (0 closed .. 1 full frame). */
function drawIris(sk: Sketch, open: number, fx: number, fy: number): void {
  if (open >= 0.999) return;
  const c = sk.ctx;
  const cx = FILM.width * fx;
  const cy = FILM.height * fy;
  const r = Math.max(0, open) * Math.hypot(FILM.width, FILM.height);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = INK;
  c.beginPath();
  c.rect(0, 0, FILM.width, FILM.height);
  if (r > 1) c.arc(cx, cy, r, 0, Math.PI * 2, true);
  c.fill('evenodd');
  if (r > 1) {
    c.strokeStyle = '#FBFAF6';
    c.lineWidth = LW;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.stroke();
  }
}

/** Shades what the Reels UI covers, so framing can be checked in the preview. */
function drawSafeGuides(sk: Sketch): void {
  const c = sk.ctx;
  const { left, top, right, bottom } = REELS_SAFE;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = 'rgba(255, 0, 80, 0.18)';
  c.fillRect(0, 0, FILM.width, top);
  c.fillRect(0, FILM.height - bottom, FILM.width, bottom);
  c.fillRect(0, top, left, FILM.height - top - bottom);
  c.fillRect(FILM.width - right, top, right, FILM.height - top - bottom);
  c.strokeStyle = 'rgba(255, 0, 80, 0.8)';
  c.lineWidth = 3;
  c.strokeRect(left, top, FILM.width - left - right, FILM.height - top - bottom);
}
