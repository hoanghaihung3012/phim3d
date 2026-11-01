// One frame of "Trốn tìm": sky, meadow, tree, apples, characters, words, bubbles.
import { FILM, REELS_SAFE } from '../../config/film';
import type { Sketch } from '../../film2d/doodle/Sketch';
import { APPLES, type TronTimCast } from './cast';

export function drawTronTimFrame(sk: Sketch, cast: TronTimCast, t: number): void {
  const c = sk.ctx;
  const { cam } = cast;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  cast.meadow.drawSky(sk, FILM.width, FILM.height);

  const camera = cam.matrix(1, [sk.jitter(999, 1), sk.jitter(999, 2)]);
  sk.setCamera(camera);
  cast.meadow.draw(sk, t);
  cast.bush.draw(sk, t);
  cast.tree.draw(sk, t);
  // Apples behind Vịt, then Táo and the cast, then the apples that land in front of him.
  cast.apples.forEach((a, i) => !APPLES[i].front && a.draw(sk, t));
  cast.tao.draw(sk, t);
  cast.sau.draw(sk, t);
  cast.vit.draw(sk, t);
  cast.apples.forEach((a, i) => APPLES[i].front && a.draw(sk, t));
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
