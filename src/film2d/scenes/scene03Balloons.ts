import type { Scene2D } from '../cast';
import { cut, pan } from './helpers';

/** Scene 3 "Thử lần 2: Bóng bay" (0:30 - 0:52): balloons, Sẻ Bông, three pops, "Ồ." */
export const scene03Balloons: Scene2D = {
  id: 'scene03',
  title: 'Cảnh 3: Thử lần 2 - Bóng bay',
  start: 30,
  end: 52,
  build(k, { apple, balloons, sparrow, cam, texts }) {
    const X = 380; // where Táo landed in scene 2
    const HIGH = -1100;

    // 30-35: balloons drift in; Táo bites the string.
    cut(k, 30, cam, X + 60, -260, 1.6);
    k.set(0, balloons, { visible: 0, held: 0, x: 1400, y: -170, scale: 0.55 });
    k.set(30, balloons, { visible: 1 });
    k.to(30, 32.6, balloons, { x: X + 160, y: -120 }, 'outQuad');
    k.set(30.6, apple, { lookX: 1 });
    k.face(32.0, apple, 'dot', 'flat');
    k.to(32.6, 33.3, balloons, { x: X + 3, y: -40 }, 'inOutQuad');
    k.set(33.4, balloons, { held: 1 });
    k.face(33.4, apple, 'happy', 'bite'); // enjoying the ride
    k.set(33.4, apple, { lookX: 0 });

    // 35-42: floats up, swinging like a pendulum, eyes closed, leaf flapping happily.
    k.set(35, apple, { pivot: 2, sway: 1, flap: 1 });
    k.to(35, 42, apple, { y: HIGH }, 'inOutSine');
    pan(k, 35, 42, cam, X + 40, HIGH - 150, 1.3);

    // 42-46: Sẻ Bông arrives, perches on the top balloon, looks at it, looks at Táo.
    cut(k, 42, cam, X + 40, HIGH - 160, 1.8);
    k.set(0, sparrow, { visible: 0, x: 1200, y: HIGH - 420, dir: -1, flap: 1, legs: 0, perch: 0, scale: 0.55 });
    k.set(42, sparrow, { visible: 1 });
    k.to(42, 43.0, sparrow, { x: X + 6, y: HIGH - 238 }, 'outQuad');
    k.set(43.0, sparrow, { perch: 2, flap: 0, legs: 1 });
    k.set(43.3, sparrow, { headTilt: 0.4 }).set(43.9, sparrow, { headTilt: -0.35 }).set(44.5, sparrow, { headTilt: 0.4 });
    texts.words.push({ t0: 43.4, t1: 44.6, text: 'Chíp?', x: X + 110, y: HIGH - 330, size: 52 });
    k.face(43.3, apple, 'smug', 'bite');
    k.set(43.3, apple, { lookX: 1, lookY: -1, flap: 0, sway: 0.3 });
    // A very slow "no" head shake.
    k.to(44.0, 44.6, apple, { tilt: -0.1 }).to(44.6, 45.2, apple, { tilt: 0.1 }).to(45.2, 45.7, apple, { tilt: 0 });

    // 46-48: peck. PỐP! pốp. póp. (domino, getting smaller)
    k.to(45.8, 45.95, sparrow, { peck: 0.7 }, 'inQuad').to(45.95, 46.2, sparrow, { peck: 0 });
    balloons.popAt = [46.3, 46.0, 46.6];
    texts.words.push(
      { t0: 46.0, t1: 46.8, text: 'PỐP!', x: X + 20, y: HIGH - 230, size: 90 },
      { t0: 46.3, t1: 47.0, text: 'pốp.', x: X - 110, y: HIGH - 160, size: 58 },
      { t0: 46.6, t1: 47.3, text: 'póp.', x: X + 150, y: HIGH - 150, size: 38 },
    );
    // Strings are gone: the bird keeps "perching" on thin air where its balloon was.
    k.set(46.8, balloons, { held: 0, x: X, y: HIGH - 40 });

    // 48-52: wide. One beat floating in mid-air. "Ồ." A small smile. Then straight down.
    cut(k, 48, cam, X + 20, HIGH - 50, 1.25);
    k.face(46.8, apple, 'dot', 'flat');
    k.set(46.8, apple, { lookX: 0, lookY: 0, sway: 0, tilt: 0 });
    k.face(48.6, apple, 'dot', 'o');
    texts.captions.push({ t0: 48.6, t1: 49.6, text: 'Ồ.' });
    // Even this is kind of fun.
    k.face(49.4, apple, 'happy', 'smile');
    k.set(50, apple, { pivot: 0 });
    k.to(50, 50.5, apple, { y: 0 }, 'inQuad');
    texts.words.push({ t0: 50.55, t1: 51.6, text: 'CỘP.', x: X + 20, y: HIGH + 330, size: 80 });
    // The bird only now remembers it should be flapping.
    k.set(51.0, sparrow, { perch: 0, x: X + 6, y: HIGH - 238, flap: 1, legs: 0 });
    k.to(51.2, 52, sparrow, { x: X + 700, y: HIGH - 600 }, 'inQuad');
    k.set(52, sparrow, { visible: 0 });
  },
};
