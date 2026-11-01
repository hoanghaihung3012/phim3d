// One frame of "Thả diều": sky, meadow, kite, characters, wind, words and bubbles.
import { FILM } from '../../config/film';
import type { Sketch } from '../../film2d/doodle/Sketch';
import type { KiteCast } from './cast';

export function drawKiteFrame(sk: Sketch, cast: KiteCast, t: number): void {
  const c = sk.ctx;
  const { cam, kite, vit } = cast;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  cast.meadow.drawSky(sk, FILM.width, FILM.height);

  const camera = cam.matrix(1, [sk.jitter(999, 1), sk.jitter(999, 2)]);
  sk.setCamera(camera);
  cast.meadow.draw(sk, t);
  kite.holder = () => vit.handWorld(t);
  kite.draw(sk, t);
  sk.setCamera(camera);
  cast.sau.draw(sk, t);
  cast.tao.draw(sk, t);
  cast.vit.draw(sk, t);
  sk.setCamera(camera);
  cast.wind.draw(sk, t, cam.x, cam.y, FILM.width / 2 / cam.zoom, FILM.height / cam.zoom);
  cast.texts.drawWorld(sk, t);

  cast.bubbles.draw(sk, t, camera);
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (cast.fx.fade > 0) {
    c.globalAlpha = Math.min(1, cast.fx.fade);
    c.fillStyle = '#1E2029';
    c.fillRect(0, 0, FILM.width, FILM.height);
    c.globalAlpha = 1;
  }
  cast.texts.dark = cast.fx.fade > 0.5;
  cast.texts.drawScreen(sk, t);
}
