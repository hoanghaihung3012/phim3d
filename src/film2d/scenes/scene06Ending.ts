import type { Scene2D } from '../cast';
import { Seesaw2D, PLANK_HALF } from '../props/Seesaw2D';
import { cut, pan, shake } from './helpers';

/** Scene 6 "Trên trời" + Kết (1:28 - end): sunset ride, the sparrow stinger, "Hết", "Ờ." */
export const scene06Ending: Scene2D = {
  id: 'scene06',
  title: 'Cảnh 6: Trên trời + Kết',
  start: 88,
  end: 100,
  build(k, { apple, cloud, sparrow, seesaw, cam, texts, sky, fx }) {
    // 88-92: wide sunset shot, gliding between the other clouds; leaf flutters.
    const x0 = k.get(cloud, 'x');
    cut(k, 88, cam, x0 - 40, -1000, 0.95);
    k.set(88, sky, { dusk: 1 });
    k.set(88, apple, { flap: 1 });
    k.to(88, 92, cloud, { x: x0 + 700 }, 'linear');
    k.to(88, 92, apple, { x: k.get(apple, 'x') + 700 }, 'linear');
    k.to(88, 92, sky, { drift: 900 }, 'linear');
    pan(k, 88, 92, cam, x0 + 640, -1000, 0.95);

    // 92-95 stinger, back on the ground: the sparrow lands on the high end of the plank,
    // bounces... the plank flips, pops off the rock, and lands on it. BÉP!
    const ROCK = 700;
    const tilt = Seesaw2D.restTilt();
    const leftDown = Seesaw2D.onRock(ROCK, -tilt);
    const rightDown = Seesaw2D.onRock(ROCK, tilt);
    const cx = Math.cos(tilt);
    const sn = Math.sin(tilt);
    const high = { x: ROCK + PLANK_HALF * cx - 13 * sn, y: leftDown.py - PLANK_HALF * sn - 13 * cx };
    const low = { x: ROCK + PLANK_HALF * cx + 13 * sn, y: rightDown.py + PLANK_HALF * sn - 13 * cx };

    cut(k, 92, cam, ROCK + 130, -230, 1.6);
    k.set(92, sky, { dusk: 0.6, drift: 0 });
    k.set(92, cloud, { visible: 0 });
    k.set(92, apple, { visible: 0 });
    k.set(92, seesaw, { rockVisible: 1, rockRoll: 0, plankVisible: 1, ...leftDown });
    k.set(92, sparrow, { visible: 1, perch: 0, x: ROCK + 650, y: -420, dir: -1, flap: 1, legs: 0, peck: 0, headTilt: 0, sx: 1, sy: 1 });
    k.to(92, 92.6, sparrow, { x: high.x, y: high.y }, 'outQuad');
    k.set(92.6, sparrow, { flap: 0, legs: 1 });
    // Nhún nhún.
    k.to(92.6, 92.75, sparrow, { sy: 0.8, sx: 1.12 }).to(92.75, 92.9, sparrow, { sy: 1, sx: 1 });
    k.to(92.9, 93.05, sparrow, { sy: 0.8, sx: 1.12 }).to(93.05, 93.2, sparrow, { sy: 1, sx: 1 });
    // ...and the tiny bird is somehow enough to flip it.
    k.to(93.2, 93.32, seesaw, { rot: rightDown.rot }, 'inQuad');
    k.to(93.2, 93.32, sparrow, { x: low.x, y: low.y }, 'inQuad');
    k.to(93.4, 93.75, seesaw, { px: ROCK + 120, py: -520, rot: tilt + Math.PI * 0.9 }, 'outQuad');
    const birdTop = -125 * sparrow.scale - 13 + low.y;
    k.to(93.75, 93.92, seesaw, { px: low.x, py: birdTop, rot: Math.PI }, 'inQuad');
    k.set(93.92, sparrow, { sy: 0.6, sx: 1.25, dizzy: 1 });
    shake(k, 93.92, cam, 10, 0.25);
    texts.words.push({ t0: 93.92, t1: 94.8, text: 'BÉP!', x: low.x, y: -300, size: 96 });
    texts.words.push({ t0: 94.3, t1: 95.4, text: 'chíp...', x: low.x + 160, y: -60, size: 36, rot: 0 });

    // 95+: fade to black, "Hết", and one last deadpan "Ờ."
    k.to(95, 95.8, fx, { fade: 1 }, 'linear');
    texts.screen.push(
      { t0: 96, t1: 100, text: 'Hết', x: 0.5, y: 0.42, size: 150, color: '#FBFAF6', bounce: true },
      { t0: 96.6, t1: 100, text: 'Táo Muốn Bay · phim vẽ tay bằng Three.js', x: 0.5, y: 0.6, size: 40, color: '#FBFAF6' },
    );
    texts.captions.push({ t0: 97.6, t1: 99.0, text: 'Ờ.' });
  },
};
