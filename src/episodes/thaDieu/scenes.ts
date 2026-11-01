// "Thả diều": Vịt can't get his big kite up (he keeps running downwind). Táo, sitting
// still: "Cậu chạy xuôi gió." Vịt runs the other way, the kite soars... and a gust lifts
// Vịt with it. Táo catches the trailing string without standing up. "Đợi gió đổi chiều."
import type { Keyer } from '../../film2d/Keyer';
import { cut, face, pan, say, shake } from '../anhGiaDinh/scenes/helpers';
import { SPOT, type KiteCast, type KiteScene } from './cast';

type Ease = Parameters<Keyer['to']>[4];

/** Moves Vịt and keeps the kite at an offset from him. */
function move(k: Keyer, c: KiteCast, t0: number, t1: number, x: number, y: number, kx: number, ky: number, ease: Ease = 'inOutSine') {
  k.to(t0, t1, c.vit, { x, y }, ease);
  k.to(t0, t1, c.kite, { x: x + kx, y: y + ky }, ease);
}

export const sceneKite: KiteScene = {
  id: 'kite',
  title: 'Thả diều',
  start: 0,
  end: 49.5,
  build(k, cast) {
    const { tao, vit, sau, kite, wind, cam, texts, cues, fx } = cast;
    const taoAnchor = { headTop: () => [tao.x, tao.y - tao.stemTipHeight() - 10] as [number, number] };

    // ---- Initial state -----------------------------------------------------------------
    k.set(0, tao, { x: SPOT.tao, y: 0, scale: 0.45, legs: 0, armL: 0.2, armR: 0.2, leaf: 0.2, flap: 0.6 });
    k.face(0, tao, 'half', 'flat');
    k.set(0, sau, { x: SPOT.sau, y: 0, scale: 1.3, flip: -1 });
    face(k, 0, sau, 'dot', 'smile');
    k.set(0, vit, { x: -1100, y: 0, scale: 0.95, hold: 1, run: 0, lookX: 0 });
    face(k, 0, vit, 'happy');
    k.set(0, kite, { x: -1040, y: -430, scale: 0.85, rot: 0.25, flutter: 0.4, sag: 10 });
    k.set(0, wind, { strength: 0.35, dir: 1 });

    // ---- 0 - 3: title on the sky ----------------------------------------------------------
    cut(k, 0, cam, 0, -1350, 1);
    texts.screen.push({ t0: 0.3, t1: 3.0, text: 'THẢ DIỀU', x: 0.5, y: 0.44, size: 150, bounce: true });
    texts.screen.push({ t0: 1.0, t1: 3.0, text: 'TÁO #10', x: 0.5, y: 0.62, size: 60 });
    cues.push({ id: 'sfx_chime', t: 0.3, volume: 0.45 });

    // ---- 3 - 9: Vịt shows off his kite ---------------------------------------------------
    cut(k, 3.0, cam, 250, -300, 1.35);
    k.set(3.0, vit, { run: 1 });
    move(k, cast, 3.0, 4.6, 0, 0, 60, -430, 'outQuad');
    cues.push({ id: 'sfx_steps', t: 3.0, duration: 1.5, volume: 0.45 });
    k.set(4.6, vit, { run: 0 });
    k.to(4.9, 5.1, vit, { hop: 30 }, 'outQuad').to(5.1, 5.3, vit, { hop: 0 }, 'inQuad');
    say(k, cast, vit, 'vit', 5.0, 7.2, 'Diều của tớ\nto nhất xóm!', { mouthOf: vit, dx: 280, dy: -40 });
    k.set(5.6, tao, { lookX: -1 });
    say(k, cast, taoAnchor, 'tao', 7.6, 8.6, 'Ờ.', { size: 54, dx: 40 });
    cues.push({ id: 'sfx_o', t: 7.65, volume: 0.8 });

    // ---- 9.3 - 12.6: attempt 1, running downwind. The kite just drags. --------------------
    face(k, 9.3, vit, 'dot');
    k.set(9.3, vit, { brows: 1, lookX: 1, run: 1 });
    k.set(9.3, kite, { rot: 1.45, scale: 0.75, x: -280, y: -45, flutter: 0.2 });
    move(k, cast, 9.4, 11.0, 420, 0, -280, -45, 'inOutQuad');
    for (let i = 0; i < 6; i++) k.set(9.5 + i * 0.25, kite, { rot: 1.45 + (i % 2 ? 0.12 : -0.1) });
    texts.words.push({ t0: 9.8, t1: 11.0, text: 'lạch cạch...', x: 0, y: -170, size: 44, rot: -0.04 });
    for (let i = 0; i < 6; i++) cues.push({ id: 'sfx_bop', t: 9.6 + i * 0.25, volume: 0.35, pitch: 0.7 + (i % 2) * 0.2 });
    pan(k, 9.4, 11.0, cam, 400, -300, 1.35);
    k.set(11.0, vit, { run: 0, brows: 0 });
    k.set(11.0, kite, { rot: 1.57, y: -30 });
    k.set(11.4, vit, { lookX: -1 });
    say(k, cast, vit, 'vit', 11.5, 12.6, 'Hửm?', { dx: -40 });
    k.to(11.5, 12.4, vit, { sweat: 1 }, 'linear');

    // ---- 12.8 - 17: attempt 2, faster. Trip. BỊCH! ------------------------------------------
    cut(k, 12.8, cam, 150, -300, 1.35);
    k.set(12.8, vit, { x: -330, sweat: 0, brows: 1, lookX: 1 });
    k.set(12.8, kite, { x: -610, y: -45, rot: 1.45 });
    say(k, cast, vit, 'vit', 12.9, 14.3, 'Lần này chạy\nthật nhanh!', { mouthOf: vit, dx: 40 });
    k.set(14.4, vit, { run: 1 });
    move(k, cast, 14.4, 15.6, 230, 0, -280, -45, 'inQuad');
    cues.push({ id: 'sfx_steps', t: 14.4, duration: 1.2, volume: 0.6 });
    texts.words.push({ t0: 14.6, t1: 15.5, text: 'VÚT!', x: 0, y: -280, size: 56 });
    pan(k, 14.4, 15.6, cam, 400, -300, 1.35);
    // Trip over a tuft: arc forward, land flat on his face.
    k.set(15.6, vit, { run: 0 });
    face(k, 15.6, vit, 'shock');
    k.to(15.6, 15.85, vit, { x: 300, hop: 70, tilt: 0.9 }, 'outQuad').to(15.85, 16.05, vit, { x: 330, hop: 0, tilt: 1.45 }, 'inQuad');
    cues.push({ id: 'sfx_fall_whistle', t: 15.6, duration: 0.45, volume: 0.5 });
    texts.words.push({ t0: 16.05, t1: 17.0, text: 'BỊCH!', x: 380, y: -280, size: 64 });
    cues.push({ id: 'sfx_splat', t: 16.05, volume: 0.9 });
    shake(k, 16.05, cam, 12, 0.3);
    face(k, 16.05, vit, 'squeeze');
    k.to(15.6, 16.2, kite, { x: 300, y: -170, rot: 0.25 }, 'outQuad');
    cues.push({ id: 'sfx_bop', t: 16.2, volume: 0.6, pitch: 0.9 });

    // ---- 17 - 22.6: Táo, not moving at all, explains the wind. ------------------------------
    cut(k, 17.0, cam, 540, -200, 2.0);
    k.set(17.0, wind, { strength: 0.5 });
    k.set(17.0, tao, { lookX: -1, lookY: 0.4 });
    say(k, cast, taoAnchor, 'tao', 17.4, 19.2, 'Cậu chạy xuôi gió.', { dx: 120, dy: -100 });
    say(k, cast, taoAnchor, 'tao', 19.4, 21.2, 'Chạy ngược lại xem.', { dx: 120, dy: -100 });
    k.set(21.4, vit, { brows: 0 });
    face(k, 21.4, vit, 'dot');
    k.set(21.4, vit, { tilt: 0 });
    k.set(21.4, kite, { x: 330, y: -400, rot: 0.1 });
    say(k, cast, vit, 'vit', 21.6, 22.6, 'Hả?', { dx: -80, size: 52 });

    // ---- 23 - 28.2: upwind! The kite soars. -------------------------------------------------
    cut(k, 23.0, cam, 150, -560, 0.72);
    k.set(23.0, wind, { strength: 0.45 });
    k.set(23.0, vit, { run: 1, lookX: -1 });
    face(k, 23.0, vit, 'dot');
    k.set(23.0, kite, { sag: 60, flutter: 1 });
    k.to(23.0, 24.6, vit, { x: -350 }, 'inOutQuad');
    k.to(23.0, 24.6, kite, { x: 0, y: -980, rot: -0.25, scale: 0.9 }, 'outQuad');
    cues.push({ id: 'sfx_steps', t: 23.0, duration: 1.5, volume: 0.5 });
    cues.push({ id: 'sfx_charge', t: 23.2, duration: 1.4, volume: 0.3 });
    k.set(24.6, vit, { run: 0, lookX: 0.6, wing: 1 });
    face(k, 24.6, vit, 'happy');
    k.set(24.6, tao, { lookX: -1, lookY: -1 });
    cues.push({ id: 'sfx_ting', t: 24.7, volume: 0.6 });
    say(k, cast, vit, 'vit', 24.8, 26.0, 'BAY RỒI!!', { mouthOf: vit, dx: -60, size: 56 });
    k.to(26.2, 26.4, vit, { hop: 34 }, 'outQuad').to(26.4, 26.6, vit, { hop: 0 }, 'inQuad');
    say(k, cast, vit, 'vit', 26.2, 28.0, 'Thấy chưa!\nCao nhất xóm!', { mouthOf: vit, dx: -60 });

    // ---- 28.2 - 35: the gust. Vịt goes up with his kite and drifts downwind. -----------------
    k.set(28.2, wind, { strength: 1 });
    texts.words.push({ t0: 28.2, t1: 29.4, text: 'VÙÙÙ!', x: -600, y: -700, size: 80, rot: -0.08 });
    cues.push({ id: 'sfx_haizz', t: 28.2, duration: 1.8, volume: 0.8 });
    k.to(28.2, 28.6, kite, { x: 150, y: -1200 }, 'outQuad');
    k.set(28.6, vit, { wing: 0, kick: 1 });
    face(k, 28.6, vit, 'shock');
    k.to(28.6, 30.0, vit, { y: -260 }, 'inOutSine');
    k.to(28.6, 30.0, kite, { x: 0, y: -900 - 260 }, 'inOutSine');
    cues.push({ id: 'sfx_charge', t: 28.7, duration: 1.3, volume: 0.35 });
    say(k, cast, vit, 'vit', 29.0, 30.8, 'Ơ... ơ... ƠƠƠ!', { mouthOf: vit, dx: -150, dy: -40 });
    // The rest of the string hangs below him, its end dragging on the grass.
    k.set(28.6, kite, { loose: 1, endX: -420, endY: -5 });
    move(k, cast, 30.0, 35.0, 820, -620, 350, -520, 'inOutSine');
    k.to(30.0, 35.0, kite, { endX: SPOT.tao + 40 }, 'inOutSine');
    pan(k, 30.0, 35.0, cam, 420, -520, 0.75);
    k.set(30.0, tao, { lookX: 0, lookY: -1 });
    k.set(33.0, tao, { lookX: 0.5 });

    // 35: bộp. Táo puts his hand on the string. Doesn't even stand up.
    k.set(35.0, tao, { armR: 1.35, lookY: 0, lookX: 0.2 });
    k.set(35.0, kite, { endX: SPOT.tao + 112, endY: -36 });
    texts.words.push({ t0: 35.0, t1: 35.9, text: 'bộp.', x: SPOT.tao + 190, y: -150, size: 46 });
    cues.push({ id: 'sfx_cop', t: 35.0, volume: 0.8 });
    k.to(35.0, 35.15, vit, { sy: 0.85, sx: 1.12 }, 'outQuad').to(35.15, 35.5, vit, { sy: 1, sx: 1 }, 'outBack');
    k.set(35.0, wind, { strength: 0.6 });

    // ---- 35.5 - 43.4: dialogue between the sky and the grass. ---------------------------------
    cut(k, 35.5, cam, 700, -420, 1.0);
    say(k, cast, vit, 'vit', 35.8, 37.8, 'Táo ơi!\nKéo tớ xuống với!', { mouthOf: vit, dx: -260, dy: 20 });
    face(k, 37.9, vit, 'dot');
    say(k, cast, taoAnchor, 'tao', 38.2, 40.0, 'Đợi gió đổi chiều.', { dx: -170, dy: -90 });
    say(k, cast, vit, 'vit', 40.3, 41.8, '...Bao giờ đổi?', { mouthOf: vit, dx: -240, dy: 20 });
    k.set(40.3, vit, { kick: 0, brows: 2 });
    cues.push({ id: 'sfx_crickets', t: 41.8, duration: 1.0, volume: 0.45 });
    say(k, cast, taoAnchor, 'tao', 42.4, 43.4, 'Mai.', { dx: -150, dy: -90, size: 54 });

    // ---- 43.4 - 49.5: final wide. Two kites: one yellow, one duck. ----------------------------
    cut(k, 43.4, cam, 520, -600, 0.72);
    k.set(43.4, vit, { kick: 1, brows: 0 });
    face(k, 43.4, vit, 'closed');
    k.set(43.4, sau, { lookX: 0, rear: 1 });
    say(k, cast, sau, 'none', 44.2, 46.0, '...', { dx: 70, dy: -80, size: 54 });
    cues.push({ id: 'sfx_bop', t: 44.2, volume: 0.35, pitch: 1.5 });
    k.to(46.8, 47.4, fx, { fade: 1 }, 'linear');
    texts.screen.push({ t0: 47.4, t1: 49.5, text: 'HẾT', x: 0.5, y: 0.47, size: 120, color: '#FBFAF6' });
    cues.push({ id: 'sfx_chime', t: 47.4, volume: 0.35 });
  },
};

export const SCENES: KiteScene[] = [sceneKite];
