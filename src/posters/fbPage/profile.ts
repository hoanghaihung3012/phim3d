// Profile picture: Táo close up, deadpan, with Sâu sitting on his head next to the stem.
// Facebook shows it as a circle, so everything important stays inside PROFILE.safeR.
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import type { Sketch } from '../../film2d/doodle/Sketch';
import { ellipse, scallop } from '../../film2d/doodle/Sketch';
import { LW } from '../../film2d/doodle/style';
import { PROFILE } from './sizes';

const C = { sky: '#CFEBFF', ground: '#CDEDB2', hill: '#BFE6A8', cloud: '#FFFFFF' };

export function drawProfile(sk: Sketch): void {
  const c = sk.ctx;
  const { width: W, height: H } = PROFILE;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = sk.paint(C.sky);
  c.fillRect(0, 0, W, H);

  sk.setCamera(new DOMMatrix());
  // Two small clouds high up, a hill and the lawn Táo sits on.
  sk.shape(scallop(150, 150, 70, 30, 5, 0.18, 40), 101, { fill: C.cloud, width: LW * 0.8 });
  sk.shape(scallop(590, 210, 56, 24, 5, 0.18, 40), 102, { fill: C.cloud, width: LW * 0.8 });
  sk.shape(ellipse(560, 610, 420, 120, 40), 103, { fill: C.hill });
  sk.shape([[-40, 570], [200, 555], [420, 566], [760, 558], [760, 800], [-40, 800]], 104, { fill: C.ground, amp: 1.2 });

  const tao = new Apple2D();
  Object.assign(tao, { x: 360, y: 600, scale: 1.08, legs: 0, armL: 0.15, armR: 0.15, lookX: 0.15, blink: 0 });
  tao.eyes = 0; // half-lidded
  tao.mouth = 0; // flat
  tao.draw(sk, 0);

  // Sâu rides on top of Táo, just left of the stem, looking happy.
  const sau = new Caterpillar2D();
  const top = 600 - tao.stemTipHeight() + 58 * tao.scale; // the dip at the top of the apple
  Object.assign(sau, { x: 300, y: top + 6, scale: 1.05, flip: -1, blink: 0 });
  sau.eyes = 1; // happy
  sau.draw(sk, 0);
}
