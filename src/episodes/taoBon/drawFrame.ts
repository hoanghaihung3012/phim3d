// One frame of "Táo bón": room (or yard, or a shock burst), bed, cast, props, words, bubbles.
import { FILM, REELS_SAFE } from '../../config/film';
import type { Pt, Sketch } from '../../film2d/doodle/Sketch';
import { LW } from '../../film2d/doodle/style';
import { drawPorridge, drawSpoon } from '../../film2d/props/Bedroom2D';
import { spoonTargets, type TaoBonCast } from './cast';

const BURST_TONES: [string, string][] = [
  ['#FFE99A', '#FFF6CF'],
  ['#FFB8C8', '#FFE1E8'],
  ['#BFE3FF', '#E6F4FF'],
];

export function drawTaoBonFrame(sk: Sketch, cast: TaoBonCast, t: number): void {
  const c = sk.ctx;
  const { fx, room } = cast;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  const camera = cast.cam.matrix(1, [sk.jitter(999, 1), sk.jitter(999, 2)]);
  const burst = fx.burst > 0.5;

  if (burst) drawBurst(sk, t, fx.burstTone);
  else if (fx.place > 0.5) cast.meadow.drawSky(sk, FILM.width, FILM.height);
  else room.drawWall(sk, FILM.width, FILM.height);

  sk.setCamera(camera);
  if (!burst && fx.place > 0.5) cast.meadow.draw(sk, t);
  if (!burst && fx.place < 0.5) {
    room.drawBack(sk);
    if (fx.dropped > 0.5) drawBasketOnFloor(sk);
  }
  // Vịt in bed: under the blanket.
  if (fx.place < 0.5) {
    cast.vit.draw(sk, t);
    if (fx.sick > 0.5 && cast.vit.visible > 0.5) drawSickProps(sk, cast, fx.thermo > 0.5);
    if (!burst) room.drawBlanket(sk, t);
  }
  sk.setCamera(camera);
  cast.sau.draw(sk, t);
  cast.ga.draw(sk, t);
  cast.cho.draw(sk, t);
  cast.meo.draw(sk, t);
  sk.setCamera(camera);
  if (fx.bowl > 0.5) {
    const [bx, by] = cast.tao.handWorld(-1, t);
    drawPorridge(sk, bx, by + 30, 0.9, t, fx.steam);
  }
  cast.tao.draw(sk, t);
  sk.setCamera(camera);
  if (fx.spoon > 0.5) {
    const from = cast.tao.handWorld(1, t);
    const to = spoonTargets(cast)[Math.round(fx.target)] ?? from;
    drawSpoon(sk, from, to, fx.reach, fx.full > 0.5);
  }
  drawHearts(sk, cast, t);
  sk.setCamera(camera);
  cast.texts.drawWorld(sk, t);
  cast.bubbles.draw(sk, t, camera);
  cast.texts.drawScreen(sk, t);

  if (fx.guides > 0.5) drawSafeGuides(sk);
}

/** Comic shock backdrop: slowly turning stripes from the middle of the safe zone. */
function drawBurst(sk: Sketch, t: number, tone: number): void {
  const c = sk.ctx;
  const [a, b] = BURST_TONES[Math.round(tone)] ?? BURST_TONES[0];
  const cx = FILM.width * 0.47;
  const cy = FILM.height * 0.42;
  c.fillStyle = b;
  c.fillRect(0, 0, FILM.width, FILM.height);
  const n = 18;
  const r = Math.hypot(FILM.width, FILM.height);
  // Stepped rotation (on twos, like the drawings).
  const rot = Math.floor(t * 12) / 12 * 0.25;
  c.fillStyle = a;
  for (let i = 0; i < n; i++) {
    const a0 = rot + (i / n) * Math.PI * 2;
    const a1 = a0 + (Math.PI / n) * 0.9;
    c.beginPath();
    c.moveTo(cx, cy);
    c.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
    c.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
    c.closePath();
    c.fill();
  }
}

/** Ice pack on Vịt's head and a thermometer sticking out of his bill. */
function drawSickProps(sk: Sketch, cast: TaoBonCast, thermo: boolean): void {
  const { vit } = cast;
  const s = vit.scale;
  const x = vit.x;
  const y = vit.y - vit.hop * s;
  const top = y - 176 * s;
  sk.shape(
    [[x - 66 * s, top + 4 * s], [x - 60 * s, top - 22 * s], [x + 60 * s, top - 22 * s], [x + 66 * s, top + 4 * s], [x + 50 * s, top + 16 * s], [x - 50 * s, top + 16 * s]],
    7160,
    { fill: '#BFE3FF', width: LW * 0.8 },
  );
  sk.line([[x - 40 * s, top - 6 * s], [x + 40 * s, top - 6 * s]], 7161, { width: LW * 0.4 });
  if (!thermo) return;
  const a: Pt = [x + 30 * s, y - 84 * s];
  const b: Pt = [x + 120 * s, y - 112 * s];
  sk.tube([a, b], 7162, 12 * s, '#FFFFFF', 0.3);
  sk.blob(b[0], b[1], 8 * s, 8 * s, 7163, '#FF6B6B');
}

/** Gà's dropped fruit basket by the door. */
function drawBasketOnFloor(sk: Sketch): void {
  const x = 330;
  const y = -4;
  sk.blob(x - 60, y - 20, 22, 22, 7170, '#FF8C82');
  sk.blob(x + 70, y - 18, 20, 20, 7171, '#FFE16B');
  sk.shape([[x - 50, y - 50], [x + 46, y - 60], [x + 50, y - 6], [x - 44, y]], 7172, { fill: '#E9C49A', width: LW * 0.85 });
}

function drawHearts(sk: Sketch, cast: TaoBonCast, t: number): void {
  const c = sk.ctx;
  for (const [i, h] of cast.hearts.entries()) {
    const k = t - h.t0;
    if (k < 0 || k > 1.4) continue;
    const s = 26 * (k < 0.15 ? k / 0.15 : 1);
    const x = h.x + 14 * Math.sin(k * 5 + i);
    const y = h.y - k * 160;
    c.globalAlpha = k > 1.0 ? 1 - (k - 1.0) / 0.4 : 1;
    const pts: Pt[] = [];
    for (let j = 0; j < 24; j++) {
      const a = (j / 24) * Math.PI * 2;
      // Heart curve.
      const hx = 16 * Math.sin(a) ** 3;
      const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
      pts.push([x + (hx / 16) * s, y + (hy / 16) * s]);
    }
    sk.shape(pts, 7180 + (i % 10), { fill: '#FF8FA3', width: LW * 0.6, amp: 0.4 });
    c.globalAlpha = 1;
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

