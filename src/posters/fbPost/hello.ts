// First page post "Hello mọi người": Táo waves at the reader with his usual flat face.
// Nấm (behind, beaming) cheers him on: "CƯỜI LÊN NÀO TÁO!" and Táo answers, deadpan,
// "EM ĐANG CƯỜI MÀ." Sâu rides on his head ("..."), Vịt waves from the right.
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Mushroom2D } from '../../film2d/characters/Mushroom2D';
import type { Sketch } from '../../film2d/doodle/Sketch';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { drawTitle } from '../fbPage/title';
import { POST } from './sizes';

/** World -> post pixels: ground line at y = GROUND_Y on screen. */
const GROUND_Y = 1075;
const ZOOM = 0.84;

const LAYOUT = { nam: -395, tao: 25, vit: 410 } as const;

export function drawHello(sk: Sketch): void {
  const c = sk.ctx;
  const { width: W, height: H } = POST;
  c.setTransform(1, 0, 0, 1, 0, 0);
  const meadow = new Meadow2D();
  meadow.drawSky(sk, W, H);

  const camera = new DOMMatrix().translate(W / 2, GROUND_Y).scale(ZOOM);
  sk.setCamera(camera);
  meadow.draw(sk, 0);

  const nam = new Mushroom2D();
  Object.assign(nam, { x: LAYOUT.nam, scale: 1.12, armL: 0.3, armR: 1.95, bendR: 0.5, lookX: 0.4, blink: 0 });
  nam.eyes = 1; // happy
  nam.mouth = 1; // grin

  const tao = new Apple2D();
  Object.assign(tao, { x: LAYOUT.tao, scale: 1.0, legs: 1, armL: 0.2, armR: 2.2, lookX: 0, blink: 0 });
  tao.eyes = 0; // half-lidded
  tao.mouth = 0; // flat

  const sau = new Caterpillar2D();
  const taoTop = -tao.stemTipHeight() + 58 * tao.scale - 50 * tao.legs * tao.scale;
  Object.assign(sau, { x: LAYOUT.tao - 90, y: taoTop + 8, scale: 1.4, flip: -1, blink: 0 });
  sau.eyes = 1; // happy

  const vit = new Duckling2D();
  Object.assign(vit, { x: LAYOUT.vit, scale: 1.55, round: 1, wing: 1, blink: 0, flip: -1 });
  vit.eyes = 1;
  vit.mouth = 1;

  for (const who of [nam, tao, sau, vit]) {
    sk.setCamera(camera);
    who.draw(sk, 0);
  }

  const bubbles = new Bubbles();
  bubbles.bounds = POST;
  bubbles.add({ t0: -1, t1: 1, text: 'CƯỜI LÊN\nNÀO TÁO!', at: () => [LAYOUT.nam + 40, -560], dx: -20, dy: -190, size: 50 });
  bubbles.add({ t0: -1, t1: 1, text: 'EM ĐANG\nCƯỜI MÀ.', at: () => [LAYOUT.tao + 190, -330], dx: 135, dy: -195, size: 50 });
  bubbles.add({ t0: -1, t1: 1, text: '...', at: () => [LAYOUT.tao - 120, taoTop - 40], dx: -60, dy: -70, size: 36 });
  bubbles.draw(sk, 0, camera);

  c.setTransform(1, 0, 0, 1, 0, 0);
  drawHeadline(sk, W / 2, 150);
  drawTitle(sk, W - 170, H - 120, 0.42);
}

/** Big hand-lettered "HELLO MỌI NGƯỜI!" across the sky, same lettering as the page title. */
function drawHeadline(sk: Sketch, x: number, y: number): void {
  const c = sk.ctx;
  const lines: [string, number, string, number][] = [
    ['HELLO', 0, '#FF6B6B', -0.04],
    ['MỌI NGƯỜI!', 118, sk.ink, 0.02],
  ];
  for (const [text, dy, fill, rot] of lines) {
    const size = 120;
    c.save();
    c.translate(x, y + dy);
    c.rotate(rot);
    c.font = `${size}px Itim, "Comic Sans MS", system-ui, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    c.strokeStyle = sk.ink;
    c.lineWidth = size * 0.26;
    c.strokeText(text, 0, 0);
    c.strokeStyle = '#FFFFFF';
    c.lineWidth = size * 0.13;
    c.strokeText(text, 0, 0);
    c.fillStyle = fill;
    c.fillText(text, 0, 0);
    c.restore();
  }
}
