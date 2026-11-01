// Cover photo: the whole family on the meadow under the title "CHUYỆN NHÀ TÁO".
// Everybody waves and smiles; Táo, in the middle, just says "Ờ.".
// Layout rules (see sizes.ts): faces and title inside the mobile slice, bottom-left corner
// left empty for the profile picture.
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Mushroom2D } from '../../film2d/characters/Mushroom2D';
import { Person2D } from '../../film2d/characters/Person2D';
import type { Sketch } from '../../film2d/doodle/Sketch';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { COVER } from './sizes';
import { drawTitle } from './title';

/** World -> cover pixels: ground line at y = GROUND_Y on screen. */
const GROUND_Y = 560;
const ZOOM = 0.58;
/** World x of the group's center (the group sits right of the title). */
const CAMERA_X = 0;

export const COVER_LAYOUT = {
  me: -240,
  ba: 0,
  nam: 240,
  tao: 500,
  vit: 775,
} as const;

export function drawCover(sk: Sketch): void {
  const c = sk.ctx;
  const { width: W } = COVER;
  c.setTransform(1, 0, 0, 1, 0, 0);
  const meadow = new Meadow2D();
  meadow.drawSky(sk, W, COVER.height);

  const camera = new DOMMatrix().translate(W / 2, GROUND_Y).scale(ZOOM).translate(-CAMERA_X, 0);
  sk.setCamera(camera);
  meadow.draw(sk, 0);

  const L = COVER_LAYOUT;
  const ba = new Person2D('dad');
  Object.assign(ba, { x: L.ba, scale: 1.0, armR: 0.15, armL: 0.15, blink: 0 });
  const me = new Person2D('mom');
  Object.assign(me, { x: L.me, scale: 1.0, armL: 2.6, bendL: 0.4, armR: 0.15, blink: 0 });
  me.eyes = 1; // happy
  ba.mouth = 1; // grin

  const nam = new Mushroom2D();
  Object.assign(nam, { x: L.nam, scale: 0.7, armL: 2.4, armR: 0.3, blink: 0 });
  nam.eyes = 1; // happy
  nam.mouth = 1; // grin

  const tao = new Apple2D();
  Object.assign(tao, { x: L.tao, scale: 0.62, legs: 1, armL: 0.2, armR: 0.2, lookX: -0.2, blink: 0 });

  // Sâu rides on Táo's head, like on the profile picture.
  const sau = new Caterpillar2D();

  const vit = new Duckling2D();
  Object.assign(vit, { x: L.vit, scale: 1.0, round: 1, wing: 1, blink: 0, flip: -1 });
  vit.eyes = 1;
  vit.mouth = 1;

  const taoTop = -tao.stemTipHeight() + 58 * tao.scale - 50 * tao.legs * tao.scale;
  Object.assign(sau, { x: L.tao - 55, y: taoTop + 6, scale: 0.9, flip: -1, blink: 0 });
  sau.eyes = 1;

  for (const who of [ba, me, nam, tao, sau, vit]) {
    sk.setCamera(camera);
    who.draw(sk, 0);
  }

  const bubbles = new Bubbles();
  bubbles.add({ t0: -1, t1: 1, text: 'Ờ.', at: () => [L.tao + 150, taoTop + 60], dx: 50, dy: -95, size: 50 });
  bubbles.draw(sk, 0, camera);

  c.setTransform(1, 0, 0, 1, 0, 0);
  drawTitle(sk, 565, 122, 0.92);
}
