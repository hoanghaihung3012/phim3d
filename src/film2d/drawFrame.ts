import { FILM } from '../config/film';
import type { Cast2D } from './cast';
import type { Sketch } from './doodle/Sketch';
import { COLORS, PAPER } from './doodle/style';

/** Draws one complete frame of the 2D film for (already stepped) time t. */
export function drawFrame(sk: Sketch, cast: Cast2D, t: number): void {
  const c = sk.ctx;
  const { cam, sky } = cast;
  const jitter: [number, number] = [sk.jitter(999, 1), sk.jitter(999, 2)];

  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.fillStyle = PAPER;
  c.fillRect(0, 0, FILM.width, FILM.height);
  if (sky.dusk > 0) {
    const g = c.createLinearGradient(0, 0, 0, FILM.height);
    g.addColorStop(0, COLORS.dusk[0]);
    g.addColorStop(1, COLORS.dusk[1]);
    c.globalAlpha = Math.min(1, sky.dusk);
    c.fillStyle = g;
    c.fillRect(0, 0, FILM.width, FILM.height);
    c.globalAlpha = 1;
  }

  sk.setCamera(cam.matrix(0.12, jitter));
  sky.drawFar(sk, t);
  sk.setCamera(cam.matrix(0.5, jitter));
  sky.drawMid(sk, t);

  sk.setCamera(cam.matrix(1, jitter));
  cast.ground.draw(sk);
  cast.tree.draw(sk, t);
  cast.seesaw.draw(sk);
  cast.cloud.draw(sk, t);
  cast.apple.draw(sk, t);
  cast.balloons.draw(sk, t);
  cast.sparrow.draw(sk, t);
  cast.texts.drawWorld(sk, t);

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
