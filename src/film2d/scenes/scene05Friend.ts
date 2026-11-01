import type { Scene2D } from '../cast';
import { cut, pan } from './helpers';

/** Scene 5 "Bạn tới giúp" (1:12 - 1:28): Bé Mây lands like a cushion and carries Táo up. */
export const scene05Friend: Scene2D = {
  id: 'scene05',
  title: 'Cảnh 5: Bạn tới giúp',
  start: 72,
  end: 88,
  build(k, { apple, cloud, cam, texts, sky }) {
    const X = k.get(apple, 'x');

    // 72-76: camera comes down from the sky with Bé Mây; its shadow covers Táo.
    cut(k, 72, cam, X, -950, 1.3);
    pan(k, 72, 74.5, cam, X + 60, -300, 1.4);
    k.set(72, apple, { tilt: 0, legs: 0, y: 0, leaf: -0.4 });
    k.face(72, apple, 'half', 'flat');
    k.set(72, cloud, { visible: 1, x: X + 60, y: -1150, eyes: 0, wave: 0, scale: 0.6, shadow: 0 });
    k.to(72, 75, cloud, { y: -560 }, 'outQuad');
    k.to(73, 75, cloud, { shadow: 1 }, 'linear');
    k.face(74.6, apple, 'dot', 'flat');
    k.set(74.6, apple, { lookY: -1, lookX: 0.4 });

    // 76-80 two-shot: Bé Mây lowers to the ground like a cushion and tilts, inviting.
    cut(k, 76, cam, X + 110, -230, 1.7);
    k.to(76, 77.2, cloud, { y: -62, x: X + 210, sx: 1.12, sy: 0.88, tilt: -0.12 }, 'inOutQuad');
    k.set(76.4, cloud, { eyes: 1 });
    texts.words.push({ t0: 76.6, t1: 78.0, text: 'khúc khích', x: X + 330, y: -230, size: 40, rot: 0 });
    k.set(77.2, apple, { lookY: 0 });
    k.face(77.6, apple, 'smug', 'flat');
    k.set(77.6, apple, { lookX: 1 });
    texts.captions.push({ t0: 78.4, t1: 79.6, text: '...Hử?' });

    // 80-84: legs pop, hop on, sink in. Phụp. A quiet beat.
    k.set(80, apple, { legs: 1, lookX: 0 });
    k.face(80, apple, 'half', 'flat');
    k.set(80.3, apple, { liftL: 14, liftR: 14 });
    k.to(80.3, 80.9, apple, { x: X + 210 }, 'linear');
    k.to(80.3, 80.6, apple, { y: -240 }, 'outQuad').to(80.6, 80.9, apple, { y: -95 }, 'inQuad');
    k.to(80.9, 81.0, cloud, { sy: 0.6, sx: 1.3, tilt: 0 }, 'outQuad');
    texts.words.push({ t0: 80.9, t1: 81.9, text: 'Phụp!', x: X + 380, y: -170, size: 60 });
    k.set(81.6, apple, { legs: 0, liftL: 0, liftR: 0 });
    k.to(82.0, 82.6, cloud, { sy: 0.8, sx: 1.12 });

    // 84-88: they rise. For exactly one second Táo is happy... then notices the camera.
    k.to(84, 88, cloud, { y: -900, sx: 1, sy: 1 }, 'inOutSine');
    k.to(84, 88, apple, { y: -925 }, 'inOutSine');
    k.to(84, 88, cloud, { shadow: 0 }, 'linear');
    pan(k, 84, 88, cam, X + 210, -980, 1.5);
    k.face(85, apple, 'happy', 'smile');
    k.set(85, apple, { sparkle: 1, blush: 1.5, leaf: 0.6, flap: 1 });
    k.face(86, apple, 'dot', 'none');
    k.set(86, apple, { sparkle: 0, flap: 0 });
    k.face(86.4, apple, 'half', 'flat');
    k.set(86.4, apple, { blush: 1, leaf: 0 });
    k.to(86, 88, sky, { dusk: 0.6 }, 'linear');
  },
};
