import { FILM } from '../config/film';

/** 2D camera: looks at (x, y) in world units; zoom 1 shows 1920x1080 world units. */
export class Camera2D {
  x = 0;
  y = -400;
  zoom = 1;
  rot = 0;
  /** Screen shake amplitude in px. */
  shake = 0;

  /**
   * World -> canvas matrix. `parallax` < 1 makes far layers move (and zoom) less.
   * `jitter` is a per-drawing random pair for shake.
   */
  matrix(parallax = 1, jitter: [number, number] = [0, 0]): DOMMatrix {
    const zoom = 1 + (this.zoom - 1) * parallax;
    return new DOMMatrix()
      .translate(FILM.width / 2 + jitter[0] * this.shake, FILM.height / 2 + jitter[1] * this.shake)
      .rotate((this.rot * 180) / Math.PI)
      .scale(zoom)
      .translate(-this.x * parallax, -this.y * parallax);
  }
}
