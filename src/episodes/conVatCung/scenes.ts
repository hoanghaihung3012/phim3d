// "Con vật cưng" (vertical, for Reels, no voices: bubbles + music + sound effects).
// Pet show in Táo's front yard. Vịt's puppy shakes hands, Gà's kitten rolls over. Táo puts
// Sâu on its cushion in the middle. Sâu: "..." (a long silence). Táo: "Nó biết im. Hiếm lắm."
// The other pets go noisy; Vịt asks who taught it; Táo and Sâu just look at him: "..." "...".
import type { Camera2D } from '../../film2d/Camera2D';
import type { Pt } from '../../film2d/doodle/Sketch';
import type { Keyer } from '../../film2d/Keyer';
import { cut, face, say } from '../anhGiaDinh/scenes/helpers';
import { SCALE, SPOT, type ConVatCungScene } from './cast';

/** Screen offset (px) that puts a shot's subject in the middle of the Reels safe zone. */
const SUBJECT = { dx: 50, dy: 200 } as const;

function frame(k: Keyer, t: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  cut(k, t, cam, x + SUBJECT.dx / zoom, y + SUBJECT.dy / zoom, zoom);
}

/** Calm camera move onto a new framing (no shake: the user wants a calm camera). */
function move(k: Keyer, cam: Camera2D, t0: number, t1: number, x: number, y: number, zoom: number): void {
  k.to(t0, t1, cam, { x: x + SUBJECT.dx / zoom, y: y + SUBJECT.dy / zoom, zoom }, 'inOutSine');
}

const WIDE = { x: 10, y: -190, zoom: 1.0 } as const;
export const END = 33.8;

export const sceneConVatCung: ConVatCungScene = {
  id: 'con-vat-cung',
  title: 'Con vật cưng',
  start: 0,
  end: END,
  build(k, cast) {
    const { tao, vit, sau, ga, cho, meo, cam, texts, cues, fx } = cast;
    const taoHead = { headTop: (): Pt => [tao.x, tao.y - tao.stemTipHeight() - 32] };
    const hop = (who: { hop: number }, t: number, h = 40): void => {
      k.to(t, t + 0.14, who, { hop: h }, 'outQuad').to(t + 0.14, t + 0.3, who, { hop: 0 }, 'inQuad');
    };

    // ---- Initial state -------------------------------------------------------------------
    k.set(0, fx, { iris: 0, irisX: 0.5, irisY: 0.42, leaf: 0, carry: 0 });
    k.set(0, vit, { x: SPOT.vit.x, y: SPOT.vit.y, scale: SCALE.vit, flip: 1, lookX: 0.3, bill: 0, wing: 0, hold: 0 });
    face(k, 0, vit, 'dot', 'smile');
    k.set(0, ga, { x: SPOT.ga.x, y: SPOT.ga.y, scale: SCALE.ga, flip: 1, lookX: 0.2 });
    face(k, 0, ga, 'dot', 'smile');
    k.set(0, cho, { x: SPOT.cho.x, y: SPOT.cho.y, scale: SCALE.pet, flip: -1, lookX: 0.3, paw: 0 });
    face(k, 0, cho, 'happy', 'grin');
    k.set(0, meo, { x: SPOT.meo.x, y: SPOT.meo.y, scale: SCALE.pet, flip: 1, lookX: 0, roll: 0 });
    face(k, 0, meo, 'dot', 'smile');
    k.set(0, tao, { x: 720, y: SPOT.tao.y, scale: SCALE.tao, flip: -1, legs: 1, run: 0, arms: 1, armL: 0.3, armR: 0.3, lookX: 0, leaf: 0.2 });
    k.face(0, tao, 'half', 'flat');
    k.set(0, sau, { x: SPOT.sau.x, y: SPOT.sau.y, scale: SCALE.sau, flip: -1, rear: 0, perk: 0 });
    face(k, 0, sau, 'dot', 'smile');

    // ---- 0 - 3.0: OPENING. Iris opens on Sâu on its cushion, pull back, big title. ----------
    frame(k, 0, cam, SPOT.sau.x - 20, SPOT.sau.y - 60, 2.6);
    k.to(0.05, 0.9, fx, { iris: 1 }, 'outQuad');
    cues.push({ id: 'sfx_poof', t: 0.1, volume: 0.4 });
    move(k, cam, 1.0, 3.0, WIDE.x, WIDE.y, WIDE.zoom);
    // Táo strolls in late, flat face, and takes his place next to Sâu.
    k.set(1.2, tao, { run: 1 });
    k.to(1.2, 2.8, tao, { x: SPOT.tao.x }, 'outQuad');
    k.set(2.8, tao, { run: 0 });
    cues.push({ id: 'sfx_steps', t: 1.2, duration: 1.4, volume: 0.3 });
    texts.screen.push({ t0: 0.5, t1: 3.0, text: 'TÁO Ờ', x: 0.46, y: 0.175, size: 52 });
    texts.screen.push({ t0: 0.7, t1: 3.0, text: 'CON VẬT CƯNG', x: 0.46, y: 0.24, size: 116, bounce: true, color: '#FF6B6B' });
    cues.push({ id: 'sfx_cop', t: 0.7, volume: 1 });
    cues.push({ id: 'sfx_boing', t: 0.73, volume: 0.6 });

    // ---- 3.0 - 5.0: the yard, the banner, three owners and their pets. -------------------
    hop(cho, 3.3, 24);
    cues.push({ id: 'sfx_ting', t: 3.35, volume: 0.25, pitch: 2.2 });
    face(k, 3.6, meo, 'closed', 'smile');
    face(k, 4.0, meo, 'dot', 'smile');
    k.to(3.8, 4.4, tao, { sigh: 1 }, 'linear');
    k.set(4.4, tao, { sigh: 0 });
    cues.push({ id: 'sfx_haizz', t: 3.8, volume: 0.3 });

    // ---- 5.0 - 10.0: Vịt: "Chó tớ biết bắt tay nè!" BỘP! -----------------------------------
    const PAIR_VIT = { x: -250, y: -120, zoom: 1.65 } as const;
    move(k, cam, 4.8, 5.4, PAIR_VIT.x, PAIR_VIT.y, PAIR_VIT.zoom);
    k.set(5.2, vit, { wing: 1 });
    k.to(5.2, 5.4, vit, { sy: 1.05, sx: 0.97 }, 'outQuad');
    say(k, cast, vit, 'vit', 5.3, 7.1, 'Chó tớ biết\nbắt tay nè!', { mouthOf: vit, dx: 80, dy: -120, size: 54 });
    k.set(7.1, vit, { wing: 0, sy: 1, sx: 1, hold: 1 });
    k.set(7.1, cho, { flip: -1, lookX: 0.6 });
    face(k, 7.1, cho, 'dot', 'o');
    k.to(7.5, 7.75, cho, { paw: 1 }, 'outBack');
    cues.push({ id: 'sfx_smack', t: 7.75, volume: 0.6, pitch: 1.3 });
    texts.words.push({ t0: 7.75, t1: 8.5, text: 'BỘP!', x: SPOT.cho.x - 60, y: -40, size: 76, rot: -0.1 });
    face(k, 7.8, cho, 'happy', 'grin');
    hop(cho, 8.0, 16);
    cues.push({ id: 'sfx_ting', t: 8.0, volume: 0.25, pitch: 2.2 });
    k.to(8.6, 8.8, cho, { paw: 0 }, 'inQuad');
    k.set(8.6, vit, { hold: 0 });
    face(k, 7.8, vit, 'happy', 'grin');
    k.set(8.7, ga, { lookX: -0.6 });
    face(k, 8.7, ga, 'happy', 'grin');
    hop(ga, 8.8, 30);
    say(k, cast, ga, 'vit', 8.7, 9.9, 'Giỏi quá!', { mouthOf: ga, dx: 60, dy: -120, size: 54 });
    cues.push({ id: 'sfx_mochi_happy', t: 8.8, volume: 0.4 });

    // ---- 10.0 - 15.0: Gà: "Mèo tớ biết lăn nè!" The kitten rolls over. -----------------------
    const PAIR_GA = { x: 110, y: -110, zoom: 1.65 } as const;
    move(k, cam, 9.9, 10.5, PAIR_GA.x, PAIR_GA.y, PAIR_GA.zoom);
    face(k, 10.0, vit, 'dot', 'smile');
    k.set(10.2, ga, { lookX: 0.4 });
    say(k, cast, ga, 'vit', 10.3, 12.0, 'Mèo tớ biết\nlăn nè!', { mouthOf: ga, dx: 70, dy: -120, size: 54 });
    k.set(12.0, ga, { lookX: 0.6 });
    hop(ga, 12.05, 30);
    texts.words.push({ t0: 12.05, t1: 12.6, text: 'Lăn!', x: SPOT.ga.x + 110, y: -230, size: 60 });
    cues.push({ id: 'sfx_cop', t: 12.05, volume: 0.4, pitch: 1.4 });
    face(k, 12.4, meo, 'closed', 'grin');
    k.to(12.4, 13.4, meo, { roll: Math.PI * 2, x: SPOT.meo.x + 120 }, 'inOutQuad');
    cues.push({ id: 'sfx_scrub', t: 12.4, duration: 1.0, volume: 0.35 });
    texts.words.push({ t0: 12.6, t1: 13.6, text: 'LĂN~', x: SPOT.meo.x + 80, y: -60, size: 70, rot: 0.08 });
    k.set(13.4, meo, { roll: 0 });
    k.to(13.4, 13.5, meo, { sy: 0.9, sx: 1.08 }, 'outQuad').to(13.5, 13.75, meo, { sy: 1, sx: 1 }, 'outBack');
    cues.push({ id: 'sfx_ting', t: 13.45, volume: 0.25, pitch: 2.4 });
    // Licks its paw.
    face(k, 13.8, meo, 'closed', 'smile');
    k.to(13.8, 14.0, meo, { paw: 0.7 }, 'outQuad');
    k.to(14.6, 14.8, meo, { paw: 0 }, 'inQuad');
    face(k, 14.8, meo, 'dot', 'smile');
    face(k, 13.6, ga, 'happy', 'grin');

    // ---- 13.9 - 17.0: wide. Vịt: "Oa!" Then both turn to Táo: "Tới lượt Táo!" -------------
    move(k, cam, 13.9, 14.5, WIDE.x, WIDE.y, WIDE.zoom);
    face(k, 14.4, vit, 'shock', 'o');
    k.set(14.4, vit, { wing: 1 });
    say(k, cast, vit, 'vit', 14.4, 15.4, 'Oa!', { mouthOf: vit, dx: 60, dy: -110, size: 58 });
    k.set(15.4, vit, { wing: 0, lookX: 0.8 });
    k.set(15.4, ga, { lookX: 0.8 });
    face(k, 15.4, vit, 'happy', 'grin');
    face(k, 15.4, ga, 'happy', 'grin');
    k.set(15.4, cho, { flip: 1, lookX: 0.6 });
    k.set(15.4, meo, { lookX: 0.6 });
    say(k, cast, ga, 'vit', 15.5, 17.0, 'Tới lượt Táo!', { mouthOf: ga, dx: 40, dy: -130, size: 56 });
    k.set(15.5, vit, { talk: 1 }).set(16.6, vit, { talk: 0 });
    hop(vit, 15.6, 30);
    hop(ga, 15.65, 30);

    // ---- 17.0 - 19.0: Táo quietly carries the cushion with Sâu to the middle. ----------------
    k.set(17.0, tao, { armL: 1.3, armR: 1.3, run: 1 });
    k.set(17.0, fx, { carry: 1 });
    k.set(17.0, sau, { y: SPOT.sau.y - 70 });
    k.to(17.0, 18.2, tao, { x: SPOT.stage.x + 120, y: SPOT.stage.y - 70 }, 'inOutSine');
    k.to(17.0, 18.2, sau, { x: SPOT.stage.x, y: SPOT.stage.y - 70 }, 'inOutSine');
    cues.push({ id: 'sfx_steps', t: 17.0, duration: 1.2, volume: 0.35 });
    k.set(18.2, tao, { run: 0 });
    k.to(18.2, 18.4, sau, { y: SPOT.stage.y }, 'inQuad');
    k.set(18.4, fx, { carry: 0 });
    cues.push({ id: 'sfx_pop', t: 18.4, volume: 0.4 });
    k.set(18.4, tao, { armL: 0.3, armR: 2.0 });
    for (const who of [vit, ga, cho, meo]) k.set(18.4, who, { lookX: 0.2 });
    face(k, 18.4, vit, 'dot', 'o');
    face(k, 18.4, ga, 'dot', 'o');
    face(k, 18.4, cho, 'dot', 'o');
    face(k, 18.4, meo, 'dot', 'o');
    k.to(18.4, 18.8, vit, { tilt: 0.12 }, 'outQuad');

    // ---- 19.0 - 22.5: the silence. Close on Sâu: "..." Crickets, a leaf drifts by. -----------
    k.set(18.95, tao, { armR: 0.3 });
    frame(k, 19.0, cam, SPOT.stage.x - 10, SPOT.stage.y - 50, 2.4);
    k.to(19.0, 20.8, cam, { zoom: 2.6 }, 'linear');
    face(k, 19.0, sau, 'dot', 'flat');
    say(k, cast, sau, 'none', 19.2, 20.8, '...', { dx: 30, dy: -90, size: 60 });
    cues.push({ id: 'sfx_crickets', t: 19.3, duration: 3.1, volume: 0.5 });
    frame(k, 20.8, cam, WIDE.x, WIDE.y + 40, WIDE.zoom);
    for (const [who, t] of [[vit, 20.9], [ga, 21.1], [cho, 21.3], [meo, 21.5]] as const) k.to(t, t + 0.4, who, { sweat: 1 }, 'linear');
    face(k, 20.8, vit, 'dot', 'flat');
    face(k, 20.8, ga, 'dot', 'flat');
    face(k, 20.8, cho, 'dot', 'flat');
    face(k, 20.8, meo, 'dot', 'flat');
    k.to(21.0, 21.5, ga, { lookX: -0.2 }, 'inOutSine');
    say(k, cast, sau, 'none', 21.0, 22.4, '...', { dx: 30, dy: -90, size: 56 });
    k.set(20.8, fx, { leaf: 1, leafX: -600, leafY: -260 });
    k.to(20.8, 22.5, fx, { leafX: 620, leafY: -120 }, 'linear');
    k.set(22.5, fx, { leaf: 0 });

    // ---- 22.5 - 25.6: close on Táo, flat: "Nó biết im. Hiếm lắm." (punchline) --------------
    const taoFace = (): [number, number] => [SPOT.stage.x + 120, SPOT.stage.y - 70 - 140];
    const [tfx, tfy] = taoFace();
    frame(k, 22.5, cam, tfx - 20, tfy + 20, 2.0);
    k.to(22.5, 25.6, cam, { zoom: 2.25 }, 'linear');
    k.set(22.5, tao, { lookX: 0 });
    k.face(22.5, tao, 'half', 'flat');
    say(k, cast, taoHead, 'tao', 22.7, 25.5, 'Nó biết im.\nHiếm lắm.', { dx: 20, dy: -140, size: 60 });
    cues.push({ id: 'sfx_ting', t: 24.0, volume: 0.45 });

    // ---- 25.6 - 27.6: the proof: everyone else goes noisy. Only Sâu stays still. ------------
    frame(k, 25.6, cam, WIDE.x, WIDE.y + 40, WIDE.zoom);
    for (const who of [vit, ga, cho, meo]) k.set(25.6, who, { sweat: 0 });
    k.set(25.6, vit, { tilt: 0, wing: 1 });
    face(k, 25.6, cho, 'squeeze', 'grin');
    face(k, 25.6, meo, 'squeeze', 'o');
    face(k, 25.6, vit, 'squeeze', 'o');
    face(k, 25.6, ga, 'squeeze', 'o');
    for (let i = 0; i < 4; i++) {
      const t = 25.65 + i * 0.45;
      hop(cho, t, 34);
      hop(meo, t + 0.2, 34);
      hop(vit, t + 0.1, 24);
      hop(ga, t + 0.3, 24);
      cues.push({ id: 'sfx_bop', t, volume: 0.4, pitch: 1.6 });
      cues.push({ id: 'sfx_chirp', t: t + 0.2, volume: 0.35, pitch: 1.3 });
    }
    k.set(25.6, cho, { flip: -1 });
    k.set(25.9, cho, { flip: 1 }).set(26.3, cho, { flip: -1 }).set(26.7, cho, { flip: 1 });
    texts.words.push({ t0: 25.65, t1: 27.5, text: 'GÂU GÂU!', x: SPOT.cho.x - 10, y: -40, size: 64, rot: -0.12 });
    texts.words.push({ t0: 25.85, t1: 27.5, text: 'MEO MEO!', x: SPOT.meo.x + 50, y: -50, size: 64, rot: 0.1 });
    texts.words.push({ t0: 26.3, t1: 27.5, text: 'ỒN QUÁ!', x: -170, y: -360, size: 70, rot: -0.05 });
    texts.words.push({ t0: 26.4, t1: 27.5, text: 'ỒN QUÁ!', x: 140, y: -330, size: 70, rot: 0.06 });
    k.set(26.3, vit, { talk: 1 }).set(27.3, vit, { talk: 0 });
    k.set(26.4, ga, { talk: 1 }).set(27.3, ga, { talk: 0 });
    cues.push({ id: 'sfx_trombone', t: 26.4, volume: 0.25, pitch: 1.2 });
    face(k, 25.6, sau, 'closed', 'smile');

    // ---- 27.6 - 30.6: Vịt, quietly: "Mà... ai dạy nó vậy?" Táo and Sâu: "..." "..." "À." ---
    k.set(27.6, vit, { x: -170, y: 150, wing: 0, flip: 1, lookX: 0.6 });
    face(k, 27.6, vit, 'dot', 'flat');
    face(k, 27.6, cho, 'dot', 'smile');
    face(k, 27.6, meo, 'dot', 'smile');
    face(k, 27.6, ga, 'dot', 'smile');
    face(k, 27.6, sau, 'dot', 'smile');
    const TRIO = { x: -20, y: -60, zoom: 1.45 } as const;
    frame(k, 27.6, cam, TRIO.x, TRIO.y, TRIO.zoom);
    k.to(27.6, 30.6, cam, { zoom: 1.6 }, 'linear');
    say(k, cast, vit, 'vit', 27.7, 29.0, 'Mà... ai dạy\nnó vậy?', { mouthOf: vit, dx: 60, dy: -110, size: 52 });
    // Táo and Sâu turn to Vịt with the very same face.
    k.set(29.0, tao, { flip: -1, lookX: 0.5 });
    k.face(29.0, tao, 'half', 'flat');
    k.set(29.0, sau, { flip: -1, rear: 1, lookX: 0.5 });
    face(k, 29.0, sau, 'half', 'flat');
    cues.push({ id: 'sfx_cop', t: 29.0, volume: 0.35, pitch: 0.7 });
    say(k, cast, taoHead, 'none', 29.05, 30.0, '...', { dx: 20, dy: -100, size: 56 });
    say(k, cast, sau, 'none', 29.25, 30.0, '...', { dx: 10, dy: -80, size: 56 });
    cues.push({ id: 'sfx_crickets', t: 29.1, duration: 0.8, volume: 0.35 });
    face(k, 30.0, vit, 'half', 'flat');
    k.to(30.0, 30.15, vit, { tilt: 0.06 }, 'outQuad').to(30.15, 30.35, vit, { tilt: 0 }, 'inQuad');
    say(k, cast, vit, 'vit', 30.0, 30.9, 'À.', { mouthOf: vit, dx: 60, dy: -110, size: 58 });

    // ---- 30.9 - 32.2: end card "HẾT" (channel rule: every Reel ends with it). -------------
    texts.screen.push({ t0: 30.9, t1: 32.3, text: 'HẾT', x: 0.46, y: 0.24, size: 170, bounce: true, color: '#FF6B6B' });
    cues.push({ id: 'sfx_cop', t: 30.9, volume: 0.6 });
    cues.push({ id: 'sfx_chime', t: 30.95, volume: 0.4, pitch: 0.8 });

    // ---- 32.2 - 33.8: closing iris on Táo and Sâu, with the series title. -----------------
    k.set(32.2, fx, { irisX: 0.58, irisY: 0.55 });
    k.to(32.2, 33.3, fx, { iris: 0 }, 'inOutQuad');
    cues.push({ id: 'sfx_poof', t: 33.2, volume: 0.35 });
    texts.screen.push({ t0: 32.3, t1: END, text: 'TÁO Ờ · CON VẬT CƯNG', x: 0.46, y: 0.2, size: 64, bounce: true, color: '#FBFAF6' });
    cues.push({ id: 'sfx_chime', t: 32.4, volume: 0.35 });
  },
};

export const SCENES: ConVatCungScene[] = [sceneConVatCung];
