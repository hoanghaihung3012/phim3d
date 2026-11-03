// One frame of "Bập bênh": sky, meadow, seesaw, riders, words, bubbles.
import { FILM, REELS_SAFE } from '../../config/film';
import type { Sketch } from '../../film2d/doodle/Sketch';
import type { BapBenhCast } from './cast';

/** How much a rider leans with the plank (1 = fully). */
const LEAN = 0.6;

/** Puts riders on the plank before drawing (their keyed x / y are ignored while riding). */
function seatRiders(cast: BapBenhCast): void {
  const { fx, seesaw } = cast;
  const riders = [
    [cast.tao, fx.taoRide, fx.taoU],
    [cast.vit, fx.vitRide, fx.vitU],
    [cast.sau, fx.sauRide, fx.sauU],
  ] as const;
  for (const [who, ride, u] of riders) {
    if (ride < 0.5) continue;
    [who.x, who.y] = seesaw.seat(u);
    if ('tilt' in who) who.tilt = seesaw.rot * LEAN;
  }
}

export function drawBapBenhFrame(sk: Sketch, cast: BapBenhCast, t: number): void {
  const c = sk.ctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  cast.meadow.drawSky(sk, FILM.width, FILM.height);
  seatRiders(cast);

  const camera = cast.cam.matrix(1, [sk.jitter(999, 1), sk.jitter(999, 2)]);
  sk.setCamera(camera);
  cast.meadow.draw(sk, t);
  cast.seesaw.draw(sk);
  cast.vit.draw(sk, t);
  cast.tao.draw(sk, t);
  cast.sau.draw(sk, t);
  sk.setCamera(camera);
  cast.texts.drawWorld(sk, t);
  cast.bubbles.draw(sk, t, camera);
  cast.texts.drawScreen(sk, t);

  if (cast.fx.guides > 0.5) drawSafeGuides(sk);
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
