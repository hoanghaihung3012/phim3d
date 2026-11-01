// "Trốn tìm" (vertical, for Reels): Táo hides among the apples of a tree. Vịt can't tell
// which apple is Táo, so he shakes the tree. Every apple falls on him, except one, hanging
// by a little noodle arm. "Sao cậu không rơi?" "Tớ có tay."
import { rand } from '../../film2d/doodle/Sketch';
import type { Keyer } from '../../film2d/Keyer';
import type { Camera2D } from '../../film2d/Camera2D';
import { cut, face, pan, say, shake } from '../anhGiaDinh/scenes/helpers';
import { APPLES, APPLE_SCALE, SPOT, TAO_SLOT, type TronTimScene } from './cast';

/**
 * Screen point (px) where the subject of a shot is placed: the middle of the Reels safe
 * zone (REELS_SAFE), which sits a bit left of and above the frame center.
 */
const SUBJECT = { dx: 50, dy: 200 } as const;

/** Hard cut that puts world point (x, y) in the middle of the safe zone. */
function frame(k: Keyer, t: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  cut(k, t, cam, x + SUBJECT.dx / zoom, y + SUBJECT.dy / zoom, zoom);
}

/** Camera move that ends with world point (x, y) in the middle of the safe zone. */
function moveTo(k: Keyer, t0: number, t1: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  pan(k, t0, t1, cam, x + SUBJECT.dx / zoom, y + SUBJECT.dy / zoom, zoom);
}

// Shots.
const HOOK = { x: 60, y: -760, zoom: 1.3 };
const WIDE = { x: 40, y: -560, zoom: 0.8 };
const LOW = { x: -150, y: -230, zoom: 1.45 };
/** Táo hanging above, Vịt under the pile below. */
const BOTH = { x: -40, y: -400, zoom: 1.0 };

/** Voice timings (s) inside the picked takes, measured with ffmpeg silencedetect. */
const UI_AT = [0, 0.84, 1.72];

export const sceneTronTim: TronTimScene = {
  id: 'tron-tim',
  title: 'Trốn tìm',
  start: 0,
  end: 25.4,
  build(k, cast) {
    const { tao, apples, vit, sau, tree, bush, cam, texts, cues } = cast;
    // Táo talks from under the branch, so his bubble sits below him and points at his bottom.
    const taoBelow = { headTop: () => [tao.x, tao.y] as [number, number] };

    // ---- Initial state ----------------------------------------------------------------------
    // Táo hangs among the apples with his back to us: no face, no arms, no breathing.
    k.set(0, tao, { x: TAO_SLOT.x, y: TAO_SLOT.y, scale: APPLE_SCALE, face: 0, arms: 0, breath: 0, sway: 0.25, pivot: 1, leaf: 0.1 });
    k.face(0, tao, 'half', 'flat');
    apples.forEach((a, i) => {
      const [x, y] = APPLES[i].slot;
      k.set(0, a, { x, y, scale: APPLE_SCALE, face: 0, arms: 0, breath: 0, sway: 0.25, pivot: 1, leaf: 0.1 + rand(i) * 0.4, flip: i % 2 ? -1 : 1 });
    });
    k.set(0, vit, { x: SPOT.vitTrunk, y: 0, scale: 0.95, lookX: 0.6 });
    face(k, 0, vit, 'closed');
    k.set(0, sau, { x: SPOT.sau, y: 0, scale: 1.25, flip: -1 });
    face(k, 0, sau, 'dot', 'smile');

    // ---- 0 - 2.6: hook. Close on the canopy: one of these apples is Táo. ------------------------
    frame(k, 0, cam, HOOK.x, HOOK.y, HOOK.zoom);
    texts.screen.push({ t0: 0.0, t1: 2.6, text: 'TÁO ĐANG TRỐN TRÊN CÂY', x: 0.46, y: 0.19, size: 56, bounce: true });
    texts.screen.push({ t0: 0.5, t1: 2.6, text: 'BẠN TÌM RA KHÔNG?', x: 0.46, y: 0.24, size: 52 });
    cues.push({ id: 'sfx_chime', t: 0.05, volume: 0.4 });
    say(k, cast, null, 'vit', 0.1, 2.55, 'Tám... chín... mười!', { screen: [0.45, 0.6], size: 50 });
    // Táo peeks over his shoulder for a blink, then turns back.
    k.set(1.45, tao, { face: 1 }).set(1.8, tao, { face: 0 });
    cues.push({ id: 'sfx_bop', t: 1.45, volume: 0.3, pitch: 1.8 });

    // ---- 2.6 - 7: Vịt turns round and starts looking. -------------------------------------------
    frame(k, 2.6, cam, LOW.x, LOW.y, LOW.zoom);
    face(k, 2.6, vit, 'happy');
    k.set(2.6, vit, { lookX: 0 });
    k.to(2.65, 2.85, vit, { hop: 34 }, 'outQuad').to(2.85, 3.05, vit, { hop: 0 }, 'inQuad');
    say(k, cast, vit, 'vit', 2.7, 4.0, 'Tớ đi tìm đây!', { mouthOf: vit, dx: 40 });
    // Run to the bush and look behind it.
    face(k, 4.0, vit, 'dot');
    k.set(4.0, vit, { run: 1, lookX: -1 });
    k.to(4.0, 4.8, vit, { x: SPOT.bush + 175 }, 'inOutQuad');
    cues.push({ id: 'sfx_steps', t: 4.0, duration: 0.8, volume: 0.45 });
    k.set(4.8, vit, { run: 0, tilt: -0.25 });
    k.set(4.85, bush, { rustle: 1 }).set(5.4, bush, { rustle: 0 });
    cues.push({ id: 'sfx_scrub', t: 4.85, duration: 0.5, volume: 0.35 });
    k.set(5.45, vit, { tilt: 0, brows: 1 });
    say(k, cast, vit, 'vit', 5.05, 7.0, 'Hừm. Không có.', { mouthOf: vit, dx: 60 });

    // ---- 7 - 10: Sâu looks up at the tree. Vịt follows the look. ---------------------------------
    k.set(7.0, sau, { rear: 1, perk: 1, lookX: -0.5 });
    say(k, cast, sau, 'none', 7.05, 8.0, '...', { dx: 30, dy: -80, size: 54 });
    cues.push({ id: 'sfx_bop', t: 7.05, volume: 0.35, pitch: 1.5 });
    k.set(7.3, vit, { lookX: 1, brows: 0 });
    face(k, 7.85, vit, 'shock');
    k.set(8.1, vit, { lookX: 0.3 });
    k.to(8.1, 8.3, vit, { hop: 30 }, 'outQuad').to(8.3, 8.5, vit, { hop: 0 }, 'inQuad');
    face(k, 8.1, vit, 'happy');
    say(k, cast, vit, 'vit', 8.1, 9.9, 'A ha! Trên cây!', { mouthOf: vit, dx: 60 });
    cues.push({ id: 'sfx_ting', t: 8.1, volume: 0.5 });
    moveTo(k, 8.6, 9.9, cam, WIDE.x, WIDE.y, WIDE.zoom);

    // ---- 10 - 12.4: which apple is it? ------------------------------------------------------------
    face(k, 10.0, vit, 'dot');
    k.set(10.0, vit, { brows: 2 });
    k.to(10.2, 11.4, vit, { sweat: 1 }, 'linear');
    texts.words.push({ t0: 10.3, t1: 12.3, text: '?', x: -320, y: -1070, size: 90, rot: -0.1 });
    texts.words.push({ t0: 10.7, t1: 12.3, text: '?', x: 360, y: -1040, size: 70, rot: 0.12 });
    texts.words.push({ t0: 11.1, t1: 12.3, text: '?', x: 20, y: -1190, size: 80, rot: 0.04 });
    say(k, cast, vit, 'vit', 10.3, 12.3, 'Ơ...\nquả nào nhỉ?', { mouthOf: vit, dx: 120 });
    // Walk back to the trunk.
    k.set(11.6, vit, { run: 1, lookX: 1 });
    k.to(11.6, 12.3, vit, { x: SPOT.vitTrunk }, 'inOutQuad');
    k.set(12.3, vit, { run: 0, sweat: 0, brows: 0 });

    // ---- 12.4 - 14.7: the plan. -----------------------------------------------------------------
    frame(k, 12.4, cam, SPOT.vitTrunk + 30, -230, 1.35);
    face(k, 12.4, vit, 'happy');
    k.set(12.4, vit, { lookX: 0.4, brows: 1 });
    say(k, cast, vit, 'vit', 12.45, 14.6, 'Rung cây\nlà biết ngay!', { mouthOf: vit, dx: -40 });
    cues.push({ id: 'sfx_ting', t: 12.45, volume: 0.35, pitch: 1.3 });

    // ---- 14.7 - 16.2: RUNG RUNG. ------------------------------------------------------------------
    frame(k, 14.7, cam, WIDE.x, WIDE.y, WIDE.zoom);
    face(k, 14.7, vit, 'squeeze');
    k.set(14.7, vit, { lookX: 1, wing: 1, x: SPOT.vitTrunk + 8 });
    k.set(14.7, tree, { shake: 1 });
    for (const a of [tao, ...apples]) k.set(14.7, a, { shake: 1 });
    for (let i = 0; i < 9; i++) {
      k.set(14.7 + i * 0.16, vit, { sx: i % 2 ? 1.08 : 0.94, sy: i % 2 ? 0.93 : 1.06 });
      cues.push({ id: 'sfx_bop', t: 14.7 + i * 0.16, volume: 0.3, pitch: 0.55 + (i % 2) * 0.15 });
    }
    texts.words.push({ t0: 14.75, t1: 15.5, text: 'RUNG!', x: -300, y: -1060, size: 76, rot: -0.12 });
    texts.words.push({ t0: 15.3, t1: 16.2, text: 'RUNG!', x: 330, y: -1000, size: 76, rot: 0.1 });
    k.set(14.7, cam, { shake: 9 });

    // ---- 16.2 - 18.4: everything falls. Except Táo, who grabs the branch. -------------------------
    k.set(16.2, cam, { shake: 0 });
    k.set(16.2, tree, { shake: 0 });
    k.set(16.2, vit, { sx: 1, sy: 1, wing: 0, lookX: 0 });
    face(k, 16.2, vit, 'dot');
    for (const a of [tao, ...apples]) k.set(16.2, a, { shake: 0, sway: 0 });
    // Táo: his stem lets go too, he drops a little and a noodle arm catches the branch. bộp.
    k.set(16.2, tao, { arms: 1, armR: 3.1, armL: 0.5, reachR: 330 });
    k.to(16.2, 16.32, tao, { y: TAO_SLOT.y + 45, sy: 1.06, sx: 0.95 }, 'outQuad').to(16.32, 16.6, tao, { sy: 1, sx: 1 }, 'outBack');
    texts.words.push({ t0: 16.25, t1: 16.9, text: 'bộp.', x: TAO_SLOT.x + 130, y: -950, size: 50 });
    // Fall order and timing: 0-2 bonk Vịt's head in time with "Ui! Ui da! Ui!".
    const headTop = (): [number, number] => [SPOT.vitTrunk, -175];
    const bonkT = UI_AT.map((d) => 16.45 + d);
    const others = [3, 4, 5, 6, 7, 8, 9];
    const fallT: number[] = [];
    bonkT.forEach((t, n) => (fallT[n] = t - 0.32));
    others.forEach((i, n) => (fallT[i] = 16.25 + n * 0.24 + rand(i + 50) * 0.1));
    apples.forEach((a, i) => {
      const t0 = fallT[i];
      const [px, py] = APPLES[i].pile;
      const tilt = (rand(i + 70) - 0.5) * 1.2;
      k.set(t0, a, { pivot: 0 });
      if (i < 3) {
        const t1 = bonkT[i];
        k.to(t0, t1, a, { x: headTop()[0], y: headTop()[1] }, 'inQuad');
        if (i < 2) {
          k.to(t1, t1 + 0.28, a, { x: px, y: py, tilt }, 'outQuad');
          cues.push({ id: 'sfx_bop', t: t1 + 0.28, volume: 0.4, pitch: 0.8 });
        } else {
          k.to(t1, t1 + 0.08, a, { sy: 0.85, sx: 1.12, y: py }, 'outQuad').to(t1 + 0.08, t1 + 0.3, a, { sy: 1, sx: 1 }, 'outBack');
        }
        texts.words.push({ t0: t1, t1: t1 + 0.6, text: 'CỘP!', x: SPOT.vitTrunk + (i % 2 ? -170 : 170), y: -300, size: 66, rot: i % 2 ? -0.12 : 0.12 });
        cues.push({ id: 'sfx_cop', t: t1, volume: 0.9 });
        face(k, t1, vit, 'squeeze');
        k.to(t1, t1 + 0.06, vit, { sy: 0.88, sx: 1.08 }, 'outQuad').to(t1 + 0.06, t1 + 0.3, vit, { sy: 1, sx: 1 }, 'outBack');
      } else {
        const t1 = t0 + 0.42;
        k.to(t0, t1, a, { x: px, y: py, tilt }, 'inQuad');
        k.to(t1, t1 + 0.07, a, { sy: 0.88, sx: 1.08 }, 'outQuad').to(t1 + 0.07, t1 + 0.25, a, { sy: 1, sx: 1 }, 'outBack');
        cues.push({ id: 'sfx_bop', t: t1, volume: 0.45, pitch: 0.65 + rand(i) * 0.3 });
      }
    });
    cues.push({ id: 'sfx_fall_whistle', t: 16.2, duration: 0.5, volume: 0.35 });
    shake(k, bonkT[2], cam, 10, 0.25);
    // Dazed under the pile.
    face(k, 18.4, vit, 'side');
    k.set(18.4, vit, { lookX: 0.6 });
    cues.push({ id: 'sfx_crickets', t: 18.3, duration: 0.8, volume: 0.4 });

    // ---- 18.9 - 21.4: "Sao... cậu không rơi?" ----------------------------------------------------
    frame(k, 18.9, cam, BOTH.x, BOTH.y, BOTH.zoom);
    face(k, 18.9, vit, 'dot');
    k.set(18.9, vit, { lookX: -0.4 });
    say(k, cast, vit, 'vit', 18.9, 21.4, 'Sao... cậu\nkhông rơi?', { mouthOf: vit, dx: 150, dy: -40 });

    // ---- 21.5 - 23.4: close on Táo. He turns round. "Tớ có tay." ---------------------------------
    frame(k, 21.5, cam, TAO_SLOT.x + 15, TAO_SLOT.y - 40, 2.3);
    k.set(21.5, tao, { face: 1, lookY: 0.6, lookX: 0.3, breath: 1 });
    say(k, cast, taoBelow, 'tao', 21.9, 23.4, 'Tớ có tay.', { dx: -40, dy: 230, size: 60 });
    // A small wiggle of the free hand.
    k.to(22.9, 23.1, tao, { armL: 0.9 }, 'outQuad').to(23.1, 23.3, tao, { armL: 0.5 }, 'inQuad');

    // ---- 23.5 - 25.4: stinger. Sâu has found a snack. Title card. ---------------------------------
    frame(k, 23.5, cam, WIDE.x, WIDE.y, WIDE.zoom);
    k.set(23.5, sau, { x: APPLES[1].pile[0] + 95, rear: 0, perk: 0, lookX: -0.5 });
    face(k, 23.5, sau, 'closed', 'o');
    k.set(23.5, tao, { lookY: 1, lookX: -0.3 });
    face(k, 23.5, vit, 'half');
    for (let i = 0; i < 4; i++) cues.push({ id: 'sfx_bop', t: 23.6 + i * 0.3, volume: 0.25, pitch: 1.6 + (i % 2) * 0.2 });
    say(k, cast, sau, 'none', 23.7, 25.4, '...', { dx: 60, dy: -90, size: 54 });
    texts.screen.push({ t0: 23.6, t1: 25.4, text: 'TÁO #12 · TRỐN TÌM', x: 0.45, y: 0.19, size: 60 });
    cues.push({ id: 'sfx_chime', t: 23.6, volume: 0.3 });
  },
};

export const SCENES: TronTimScene[] = [sceneTronTim];
