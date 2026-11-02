import type { Scene2D } from '../cast';
import { cut, shake } from './helpers';

/** Scene 2 "Thử lần 1: Nhảy" (0:14 - 0:30): snap off, fall, stare, legs, tiny jump, stare. */
export const scene02Jump: Scene2D = {
  id: 'scene02',
  title: 'Cảnh 2: Thử lần 1 - Nhảy',
  start: 14,
  end: 30,
  build(k, { apple, tree, cam, texts }) {
    const [ax, ay] = tree.anchor();

    // 14-17: close-up on the stem. Táo shakes, the stem twitches... snaps.
    cut(k, 14, cam, ax + 5, ay + 20, 4.2);
    k.face(14, apple, 'dot', 'flat'); // concentrating
    k.set(14, apple, { lookX: 0, lookY: -0.6, blush: 1, sway: 0 });
    k.set(14.4, apple, { shake: 1 });
    for (let i = 0; i < 8; i++) k.set(14.5 + i * 0.24, apple, { stem: i % 2 ? -6 : 8 });
    k.set(16.4, apple, { shake: 0, stem: 0, pivot: 0 });
    k.set(16.4, tree, { holding: 0 });
    texts.words.push({ t0: 16.4, t1: 17.2, text: 'RẮC!', x: ax + 40, y: ay - 30, size: 76 });

    // 17-19: medium wide. One beat in the air... then it drops straight down. CỘP.
    cut(k, 16.9, cam, ax, -260, 1.6);
    k.set(16.9, apple, { lookY: 0 });
    k.to(17.3, 17.52, apple, { y: 0 }, 'inQuad');
    k.set(17.52, apple, { sy: 0.9, sx: 1.06 }).set(17.7, apple, { sy: 1, sx: 1 });
    shake(k, 17.52, cam, 10, 0.25);
    texts.words.push({ t0: 17.52, t1: 18.6, text: 'CỘP.', x: ax, y: -190, size: 96 });

    // 19-21: close-up. Stares at the camera. Silence.
    cut(k, 19, cam, ax, -75, 3.6);
    k.set(19.5, apple, { dots: 1 }).set(19.8, apple, { dots: 2 }).set(20.1, apple, { dots: 3 }).set(21, apple, { dots: 0 });

    // 21-26: legs pop out (no animation), back up, run, jump about... this high. Land.
    cut(k, 21, cam, ax + 90, -200, 1.5);
    k.set(21, apple, { legs: 1 });
    k.set(21.4, apple, { run: 1 }).to(21.4, 22.0, apple, { x: ax - 90 }, 'linear').set(22.0, apple, { run: 0 });
    k.set(22.3, apple, { run: 1, speed: 1, tilt: 0.08 });
    k.to(22.3, 23.1, apple, { x: ax + 190 }, 'linear');
    texts.words.push({ t0: 22.3, t1: 23.1, text: 'tạch tạch tạch', x: ax + 40, y: -190, size: 44, rot: 0 });
    k.set(23.1, apple, { run: 0, speed: 0, tilt: 0, liftL: 14, liftR: 14, armL: 2.2, armR: 2.2 });
    k.to(23.1, 23.35, apple, { y: -70 }, 'outQuad').to(23.35, 23.6, apple, { y: 0 }, 'inQuad');
    texts.captions.push({ t0: 23.1, t1: 24.0, text: 'Hự!' });
    k.set(23.6, apple, { liftL: 0, liftR: 0, armL: 0.25, armR: 0.25, sy: 0.92, sx: 1.05 });
    k.set(23.75, apple, { sy: 1, sx: 1 });
    texts.words.push({ t0: 23.6, t1: 24.4, text: 'cộp.', x: ax + 190, y: -170, size: 48 });

    // 26-30: close-up again. Looks at us, expressionless, quietly fine with its 30 cm. Legs retract. "Ờ."
    cut(k, 26, cam, ax + 190, -120, 3.2);
    k.face(26.4, apple, 'dot', 'flat');
    k.set(26.4, apple, { lookX: 0 });
    k.set(27.2, apple, { legs: 0 });
    texts.captions.push({ t0: 27.6, t1: 28.8, text: 'Ờ.' });
    k.face(29, apple, 'dot', 'flat');
  },
};
