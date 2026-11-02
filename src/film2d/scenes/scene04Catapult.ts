import type { Scene2D } from '../cast';
import { Seesaw2D, PLANK_HALF } from '../props/Seesaw2D';
import { cut, shake } from './helpers';

/** Scene 4 "Thử lần 3: Máy phóng" (0:52 - 1:12): build a seesaw, nobody to help, BÉP. */
export const scene04Catapult: Scene2D = {
  id: 'scene04',
  title: 'Cảnh 4: Thử lần 3 - Máy phóng',
  start: 52,
  end: 72,
  build(k, { apple, seesaw, cam, texts }) {
    const ROCK = 700;
    const tilt = Seesaw2D.restTilt();
    const leftDown = Seesaw2D.onRock(ROCK, -tilt);
    const rightDown = Seesaw2D.onRock(ROCK, tilt);
    // Plank end positions (top surface) for the two rest poses.
    const cx = Math.cos(tilt);
    const sn = Math.sin(tilt);
    const lowEnd = { x: ROCK - PLANK_HALF * cx + 13 * -sn, y: leftDown.py + PLANK_HALF * sn - 13 * cx };
    const highEnd = { x: ROCK + PLANK_HALF * cx - 13 * sn, y: leftDown.py - PLANK_HALF * sn - 13 * cx };

    k.set(0, seesaw, { rockX: 520, rockVisible: 0, rockRoll: 0, plankVisible: 0, px: 380, py: -13, rot: 0 });

    // 52-54 montage shot A: push the rock into place.
    cut(k, 52, cam, 620, -170, 1.6);
    k.set(52, apple, { x: 420, y: 0, legs: 1, run: 1, tilt: 0.18, armL: 1.5, armR: 1.5, eyes: 0, mouth: 0, lookX: 0, lookY: 0 });
    k.set(52, seesaw, { rockVisible: 1 });
    k.to(52.2, 53.7, seesaw, { rockX: ROCK, rockRoll: 2.5 }, 'linear');
    k.to(52.2, 53.7, apple, { x: ROCK - 120 }, 'linear');
    texts.words.push({ t0: 52.4, t1: 53.4, text: 'cộc cộc', x: ROCK - 60, y: -220, size: 44, rot: 0 });

    // 54-56 shot B: drag the plank onto the rock.
    cut(k, 54, cam, 560, -170, 1.5);
    k.set(54, apple, { x: 160, tilt: -0.15, armL: 0.25, armR: 2.0 });
    k.set(54, seesaw, { plankVisible: 1, px: 420, py: -13, rot: 0 });
    k.to(54.2, 55.3, apple, { x: 300 }, 'linear');
    k.to(54.2, 55.3, seesaw, { px: 560 }, 'linear');
    k.set(55.4, seesaw, leftDown);
    k.set(55.4, apple, { run: 0, tilt: 0, armL: 0.25, armR: 0.25 });
    texts.words.push({ t0: 55.4, t1: 56.0, text: 'cạch.', x: ROCK - 80, y: -170, size: 44 });

    // 56-58 shot C: stands on the low end. Smug.
    cut(k, 56, cam, lowEnd.x + 60, -230, 2.0);
    k.set(56, apple, { x: lowEnd.x + 10, y: lowEnd.y });
    k.face(56, apple, 'smug', 'smirk');
    k.set(56, apple, { blush: 1.3 });

    // 58-62 wide, static: needs someone to drop on the other end. Left. Right. Nobody.
    cut(k, 58, cam, ROCK, -260, 1.25);
    k.face(58, apple, 'dot', 'flat');
    k.set(58, apple, { blush: 1, lookX: 1, lookY: -1 });
    k.set(59.3, apple, { lookX: -1, lookY: 0 }).set(60.1, apple, { lookX: 1 }).set(60.9, apple, { lookX: 0 });
    texts.words.push({ t0: 58.6, t1: 61.6, text: 'dế... dế...', x: ROCK + 520, y: -60, size: 40, rot: 0 });

    // 62-67: idea! Jump to the high end himself... ride it down, step off... the plank
    // pops off the rock, spins, and lands on his head. BÉP!
    k.face(62.0, apple, 'dot', 'none');
    texts.words.push({ t0: 62.0, t1: 62.6, text: '!', x: lowEnd.x + 10, y: lowEnd.y - 190, size: 80 });
    k.set(62.6, apple, { liftL: 14, liftR: 14, armL: 2.2, armR: 2.2 });
    k.to(62.6, 63.2, apple, { x: highEnd.x }, 'linear');
    k.to(62.6, 62.95, apple, { y: highEnd.y - 220 }, 'outQuad').to(62.95, 63.2, apple, { y: highEnd.y }, 'inQuad');
    k.to(63.2, 63.32, seesaw, { rot: rightDown.rot }, 'inQuad');
    k.to(63.2, 63.32, apple, { y: lowEnd.y }, 'inQuad');
    k.set(63.32, apple, { liftL: 0, liftR: 0, armL: 0.25, armR: 0.25 });
    texts.words.push({ t0: 63.32, t1: 63.9, text: 'cạch...', x: ROCK - 230, y: -260, size: 48 });
    k.face(63.6, apple, 'dot', 'flat');
    // Step off onto the grass.
    k.to(63.9, 64.2, apple, { x: highEnd.x + 80, y: 0 }, 'linear');

    const headY = -(205 * 1.79 + 50) * apple.scale - 13;
    k.to(64.3, 64.75, seesaw, { px: ROCK + 160, py: -560, rot: tilt + Math.PI * 0.9 }, 'outQuad');
    k.to(64.75, 64.95, seesaw, { px: highEnd.x + 80, py: headY, rot: Math.PI }, 'inQuad');
    k.set(64.6, apple, { lookY: -1 });
    k.set(64.95, apple, { sy: 0.78, sx: 1.12, dent: 1, eyes: 4 });
    shake(k, 64.95, cam, 14, 0.3);
    texts.words.push({ t0: 64.95, t1: 66.0, text: 'BÉP!', x: highEnd.x + 80, y: -260, size: 110 });
    // Plank slides off; Táo tips over.
    k.to(65.5, 65.85, seesaw, { px: highEnd.x + 700, py: -13 }, 'inQuad');
    k.set(65.5, apple, { sy: 1, sx: 1 });
    k.to(65.6, 65.9, apple, { tilt: -Math.PI / 2 }, 'inQuad');

    // 67-72 close-up: lying on its side, square dent on the cheek. Stares. Sighs.
    const lieX = highEnd.x + 80 - 70;
    cut(k, 67, cam, lieX, -80, 2.8);
    k.face(67, apple, 'dot', 'flat');
    k.set(67, apple, { lookY: 0, leaf: -1.2 });
    texts.words.push({ t0: 67.6, t1: 69.4, text: '♪ wah wah wah', x: lieX + 40, y: -230, size: 46, rot: 0 });
    // A small sigh. Not sad, just a sigh.
    k.face(70, apple, 'closed', 'none');
    k.set(70, apple, { sigh: 0.001, leaf: -1.2 }).to(70, 71.4, apple, { sigh: 0.999 }, 'linear').set(71.4, apple, { sigh: 0 });
    texts.captions.push({ t0: 70.0, t1: 71.6, text: 'Haizz.' });
    k.face(71.6, apple, 'dot', 'flat');
  },
};
