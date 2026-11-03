// "Bập bênh" (vertical, for Reels): Táo sits on the seesaw and Vịt is stuck up high. Táo
// quietly scoots toward the middle and the seesaw balances. "Ngồi gần giữa thì nhẹ hơn."
// Vịt copies him, scoots to the middle too, and is flung into the sky. "Giờ cậu còn nhẹ hơn."
import type { Camera2D } from '../../film2d/Camera2D';
import type { Pt } from '../../film2d/doodle/Sketch';
import type { Keyer } from '../../film2d/Keyer';
import { PlaygroundSeesaw2D } from '../../film2d/props/PlaygroundSeesaw2D';
import { cut, face, say, shake } from '../anhGiaDinh/scenes/helpers';
import { SCALE, SEAT, type BapBenhScene } from './cast';

/** Screen offset (px) that puts a shot's subject in the middle of the Reels safe zone. */
const SUBJECT = { dx: 50, dy: 200 } as const;

function frame(k: Keyer, t: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  cut(k, t, cam, x + SUBJECT.dx / zoom, y + SUBJECT.dy / zoom, zoom);
}

const MAX = PlaygroundSeesaw2D.maxTilt();
const seat = (rot: number, u: number): Pt => PlaygroundSeesaw2D.seatAt(0, rot, u);

// Shots.
const WIDE = { x: 0, y: -300, zoom: 1.0 };
/** Close on Táo at his balanced seat near the middle. */
const TAO_CLOSE = { u: SEAT.taoMiddle, zoom: 1.9 };

export const sceneBapBenh: BapBenhScene = {
  id: 'bap-benh',
  title: 'Bập bênh',
  start: 0,
  end: 33.0,
  build(k, cast) {
    const { tao, vit, sau, seesaw, cam, texts, cues, fx } = cast;
    const taoHead = { headTop: (): Pt => [tao.x, tao.y - tao.stemTipHeight() - 10] };

    // ---- Initial state ------------------------------------------------------------------------
    // Vịt alone on the left end, which rests on the grass. Táo walks in from the right.
    k.set(0, seesaw, { x: 0, rot: -MAX });
    k.set(0, fx, { vitRide: 1, vitU: SEAT.vit, taoRide: 0, taoU: SEAT.tao, sauRide: 0, sauU: SEAT.sau });
    k.set(0, vit, { scale: SCALE.vit, lookX: 0.6 });
    face(k, 0, vit, 'happy');
    k.set(0, tao, { x: 820, y: 0, scale: SCALE.tao, legs: 1, run: 1, lookX: -0.5, leaf: 0.2, flap: 0.5 });
    k.face(0, tao, 'half', 'flat');
    k.set(0, sau, { x: 620, y: 0, scale: SCALE.sau, flip: -1 });
    face(k, 0, sau, 'dot', 'smile');

    // ---- 0 - 3.2: hook + invitation. -----------------------------------------------------------
    frame(k, 0, cam, WIDE.x, WIDE.y, WIDE.zoom);
    texts.screen.push({ t0: 0.0, t1: 3.2, text: 'ĐỪNG CHƠI BẬP BÊNH', x: 0.46, y: 0.19, size: 60, bounce: true });
    texts.screen.push({ t0: 0.4, t1: 3.2, text: 'VỚI TÁO', x: 0.46, y: 0.245, size: 60 });
    cues.push({ id: 'sfx_chime', t: 0.05, volume: 0.4 });
    say(k, cast, vit, 'vit', 0.2, 2.5, 'Táo ơi!\nChơi bập bênh đi!', { mouthOf: vit, dx: 170, dy: -130 });
    k.to(0.2, 2.3, tao, { x: 430 }, 'outQuad');
    cues.push({ id: 'sfx_steps', t: 0.2, duration: 2.0, volume: 0.35 });
    k.set(2.3, tao, { run: 0 });
    say(k, cast, taoHead, 'tao', 2.55, 3.3, 'Ờ.', { dx: 30, size: 58 });

    // ---- 3.3 - 4.6: Táo hops on. The plank slams down and Vịt shoots up. VÚT! ------------------
    const highR = seat(-MAX, SEAT.tao);
    k.to(3.3, 3.5, tao, { x: (430 + highR[0]) / 2, y: highR[1] - 120, sy: 1.08, sx: 0.94 }, 'outQuad');
    k.to(3.5, 3.65, tao, { x: highR[0], y: highR[1], sy: 1, sx: 1 }, 'inQuad');
    k.set(3.65, tao, { legs: 0 });
    k.set(3.65, fx, { taoRide: 1 });
    k.to(3.65, 3.82, seesaw, { rot: MAX }, 'inQuad');
    k.to(3.82, 3.9, tao, { sy: 0.86, sx: 1.1 }, 'outQuad').to(3.9, 4.15, tao, { sy: 1, sx: 1 }, 'outBack');
    cues.push({ id: 'sfx_cop', t: 3.82, volume: 0.9 });
    shake(k, 3.82, cam, 12, 0.25);
    texts.words.push({ t0: 3.82, t1: 4.4, text: 'CỘP!', x: 250, y: 60, size: 64, rot: 0.12 });
    face(k, 3.82, vit, 'shock', 'o');
    k.to(3.82, 4.12, vit, { hop: 300 }, 'outQuad').to(4.12, 4.45, vit, { hop: 0 }, 'inQuad');
    k.to(4.45, 4.52, vit, { sy: 0.86, sx: 1.1 }, 'outQuad').to(4.52, 4.75, vit, { sy: 1, sx: 1 }, 'outBack');
    cues.push({ id: 'sfx_boing', t: 3.84, volume: 0.6 });
    texts.words.push({ t0: 3.85, t1: 4.5, text: 'VÚT!', x: -250, y: -820, size: 72, rot: -0.12 });

    // ---- 4.6 - 8.0: stuck up high, kicking. "Hự! Hự! Cậu nặng quá!" -------------------------------
    face(k, 4.6, vit, 'squeeze', 'frown');
    k.set(4.6, vit, { kick: 1, brows: 2, wing: 1, lookX: 0.6 });
    for (let i = 0; i < 6; i++) {
      const t = 4.6 + i * 0.32;
      k.to(t, t + 0.12, vit, { hop: 26 }, 'outQuad').to(t + 0.12, t + 0.28, vit, { hop: 0 }, 'inQuad');
      cues.push({ id: 'sfx_bop', t: t + 0.28, volume: 0.25, pitch: 0.6 });
    }
    say(k, cast, vit, 'vit', 4.6, 7.9, 'Hự! Hự!\nCậu nặng quá!', { mouthOf: vit, dx: 180, dy: -120 });
    k.set(6.6, vit, { kick: 0, wing: 0 });
    face(k, 6.6, vit, 'dot', 'frown');
    // Táo below, unbothered. A little sigh.
    k.to(7.3, 7.9, tao, { sigh: 1 }, 'linear');
    k.set(7.9, tao, { sigh: 0 });
    cues.push({ id: 'sfx_haizz', t: 7.3, volume: 0.35 });

    // ---- 8.0 - 13.6: Sâu comes to help. Climbs up the plank to Vịt. Nothing moves. ----------------
    face(k, 8.0, vit, 'happy', 'grin');
    k.set(8.0, vit, { lookX: 1, brows: 0 });
    say(k, cast, vit, 'vit', 8.0, 10.4, 'Sâu ơi!\nLên giúp tớ với!', { mouthOf: vit, dx: 180, dy: -120 });
    k.set(8.4, sau, { rear: 1, perk: 1 });
    cues.push({ id: 'sfx_bop', t: 8.4, volume: 0.3, pitch: 1.6 });
    k.set(9.0, sau, { rear: 0, perk: 0, wiggle: 1 });
    k.to(9.0, 10.0, sau, { x: seat(MAX, 0.99)[0], y: seat(MAX, 0.99)[1] }, 'linear');
    k.set(10.0, fx, { sauRide: 1, sauU: 0.99 });
    k.to(10.0, 12.3, fx, { sauU: SEAT.sau }, 'inOutQuad');
    cues.push({ id: 'sfx_scrub', t: 9.0, duration: 3.2, volume: 0.2 });
    k.set(12.3, sau, { wiggle: 0, flip: 1, lookX: 0.3 });
    face(k, 12.3, sau, 'dot', 'smile');
    face(k, 12.3, vit, 'dot', 'flat');
    k.set(12.3, vit, { lookX: -0.4 });
    say(k, cast, sau, 'none', 12.5, 13.6, '...', { dx: 110, dy: -40, size: 54 });
    cues.push({ id: 'sfx_crickets', t: 12.5, duration: 1.0, volume: 0.4 });

    // ---- 13.6 - 15.8: "Vẫn không được!" -----------------------------------------------------------
    face(k, 13.6, vit, 'squeeze', 'wavy');
    k.set(13.6, vit, { brows: 2 });
    k.to(13.6, 14.6, vit, { sweat: 1 }, 'linear');
    say(k, cast, vit, 'vit', 13.6, 15.7, 'Vẫn không được!', { mouthOf: vit, dx: 180, dy: -110 });

    // ---- 15.8 - 18.4: Táo scoots toward the middle. The plank comes level. "Ơ? Ơ? Ơ?" -----------
    k.set(15.8, vit, { sweat: 0, brows: 0 });
    face(k, 15.8, vit, 'shock', 'o');
    k.set(15.8, tao, { lookX: 0 });
    const steps: [number, number, number][] = [
      [15.9, 0.78, MAX * 0.62],
      [16.6, 0.62, MAX * 0.28],
      [17.3, SEAT.taoMiddle, 0],
    ];
    steps.forEach(([t, u, rot], i) => {
      k.to(t, t + 0.25, fx, { taoU: u }, 'outQuad');
      k.to(t, t + 0.25, tao, { sy: 0.92, sx: 1.05 }, 'outQuad').to(t + 0.25, t + 0.45, tao, { sy: 1, sx: 1 }, 'outBack');
      k.to(t + 0.05, t + 0.5, seesaw, { rot }, 'inOutQuad');
      texts.words.push({ t0: t, t1: t + 0.55, text: 'xịch.', x: seat(rot, u)[0] + 120, y: seat(rot, u)[1] - 40, size: 46 });
      cues.push({ id: 'sfx_bop', t, volume: 0.3, pitch: 0.9 + i * 0.1 });
    });
    say(k, cast, vit, 'vit', 16.0, 18.3, 'Ơ? Ơ? Ơ?', { mouthOf: vit, dx: 160, dy: -110 });

    // ---- 18.4 - 21.0: balanced. Gentle up and down. "Hay quá! Sao cậu làm được vậy?" -------------
    face(k, 18.4, vit, 'happy', 'grin');
    k.set(18.4, vit, { wing: 1 });
    for (let i = 0; i < 2; i++) {
      const t = 18.4 + i * 1.2;
      k.to(t, t + 0.6, seesaw, { rot: -0.08 }, 'inOutSine').to(t + 0.6, t + 1.2, seesaw, { rot: 0.0 }, 'inOutSine');
    }
    cues.push({ id: 'sfx_ting', t: 18.45, volume: 0.45 });
    say(k, cast, vit, 'vit', 18.5, 21.0, 'Hay quá! Sao cậu\nlàm được vậy?', { mouthOf: vit, dx: 200, dy: -130 });
    k.set(20.8, vit, { wing: 0 });

    // ---- 21.1 - 23.4: close on Táo. The clever line. ---------------------------------------------
    const taoMid = seat(0, TAO_CLOSE.u);
    frame(k, 21.1, cam, taoMid[0], taoMid[1] - 60, TAO_CLOSE.zoom);
    k.set(21.1, tao, { lookX: -0.4, lookY: -0.2 });
    say(k, cast, taoHead, 'tao', 21.25, 23.4, 'Ngồi gần giữa\nthì nhẹ hơn.', { dx: -40, size: 58 });

    // ---- 23.5 - 25.6: Vịt copies him. ------------------------------------------------------------
    frame(k, 23.5, cam, WIDE.x, WIDE.y, WIDE.zoom);
    face(k, 23.5, vit, 'happy', 'grin');
    k.set(23.5, vit, { lookX: 0.8, brows: 1 });
    k.to(23.5, 23.7, vit, { hop: 40 }, 'outQuad').to(23.7, 23.9, vit, { hop: 0 }, 'inQuad');
    cues.push({ id: 'sfx_ting', t: 23.55, volume: 0.4, pitch: 1.3 });
    say(k, cast, vit, 'vit', 23.5, 25.6, 'À! Vậy tớ cũng\nngồi gần giữa!', { mouthOf: vit, dx: 200, dy: -130 });
    k.set(23.5, tao, { lookX: -0.6, lookY: 0 });
    // Two little scoots; the plank starts to tip toward Táo.
    k.to(24.7, 24.95, fx, { vitU: (SEAT.vit + SEAT.vitMiddle) / 2 }, 'outQuad');
    k.to(25.2, 25.45, fx, { vitU: SEAT.vitMiddle }, 'outQuad');
    cues.push({ id: 'sfx_bop', t: 24.7, volume: 0.3, pitch: 1.0 });
    cues.push({ id: 'sfx_bop', t: 25.2, volume: 0.3, pitch: 1.1 });

    // ---- 25.6 - 27.7: SNAP. The plank slams and Vịt and Sâu fly off into the sky. -----------------
    k.to(25.55, 25.68, seesaw, { rot: MAX }, 'inQuad');
    cues.push({ id: 'sfx_cop', t: 25.68, volume: 1 });
    shake(k, 25.68, cam, 14, 0.3);
    texts.words.push({ t0: 25.68, t1: 26.3, text: 'CỘP!', x: 250, y: 60, size: 68, rot: 0.12 });
    const vitFrom = seat(MAX, SEAT.vitMiddle);
    const sauFrom = seat(MAX, SEAT.sau);
    k.set(25.7, fx, { vitRide: 0, sauRide: 0 });
    k.set(25.7, vit, { x: vitFrom[0], y: vitFrom[1], tilt: 0, kick: 1, wing: 1 });
    face(k, 25.7, vit, 'shock', 'o');
    k.set(25.7, sau, { x: sauFrom[0], y: sauFrom[1], rear: 1, perk: 1 });
    face(k, 25.7, sau, 'shock', 'o');
    k.to(25.7, 26.5, vit, { x: -260, y: -2300 }, 'outQuad');
    k.to(25.7, 26.3, sau, { x: -60, y: -1700 }, 'outQuad');
    cues.push({ id: 'sfx_boing', t: 25.7, volume: 0.7, pitch: 0.8 });
    cues.push({ id: 'sfx_fall_whistle', t: 25.75, duration: 0.8, volume: 0.35, pitch: 1.6 });
    texts.words.push({ t0: 25.72, t1: 26.5, text: 'VÚT!', x: -300, y: -760, size: 80, rot: -0.12 });
    say(k, cast, null, 'vit', 25.75, 28.1, 'Á á á á á!', { screen: [0.42, 0.2], size: 54 });
    k.set(26.4, tao, { lookY: -1, lookX: -0.2 });

    // ---- 28.1 - 30.6: close on Táo, looking up. Punchline. ---------------------------------------
    const taoLow = seat(MAX, TAO_CLOSE.u);
    frame(k, 28.1, cam, taoLow[0], taoLow[1] - 60, TAO_CLOSE.zoom);
    say(k, cast, taoHead, 'tao', 28.3, 30.6, 'Giờ cậu còn\nnhẹ hơn.', { dx: -40, size: 60 });
    cues.push({ id: 'sfx_crickets', t: 30, duration: 0.7, volume: 0.3 });

    // ---- 30.7 - 33: stinger. Sâu drops back down onto Táo's head. Title. -----------------------
    frame(k, 30.7, cam, WIDE.x, WIDE.y, WIDE.zoom);
    const head = (): Pt => [taoLow[0], taoLow[1] - tao.stemTipHeight() + 18];
    k.set(30.7, sau, { x: head()[0], y: -1700, rear: 0, perk: 0, flip: -1 });
    face(k, 30.7, sau, 'dot', 'o');
    k.to(30.7, 31, sau, { y: head()[1] }, 'inQuad');
    k.to(31, 31.08, tao, { sy: 0.9, sx: 1.06 }, 'outQuad').to(31.08, 31.3, tao, { sy: 1, sx: 1 }, 'outBack');
    cues.push({ id: 'sfx_bop', t: 31, volume: 0.45, pitch: 1.4 });
    texts.words.push({ t0: 31, t1: 31.6, text: 'bộp.', x: head()[0] + 150, y: head()[1] - 40, size: 48 });
    face(k, 31.1, sau, 'happy', 'smile');
    k.set(31.1, tao, { lookY: -0.5, lookX: 0 });
    say(k, cast, sau, 'none', 31.2, 33, '...', { dx: -70, dy: -80, size: 54 });
    texts.screen.push({ t0: 30.8, t1: 33, text: 'TÁO Ờ · BẬP BÊNH', x: 0.46, y: 0.19, size: 62 });
    cues.push({ id: 'sfx_chime', t: 30.85, volume: 0.3 });
  },
};

export const SCENES: BapBenhScene[] = [sceneBapBenh];
