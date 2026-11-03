// "Táo bón" (vertical, for Reels, no voices: bubbles + music + sound effects).
// Vịt is sick in bed. Táo brings porridge, blows on each spoonful and feeds him with a very
// long spoon. Gà peeks in, panics and runs out to tell Chó and Mèo "Vịt bị táo bón!".
// Táo: "Vịt không BỊ Táo bón. Vịt ĐƯỢC Táo bón." The visitors want to be fed too. "Xếp hàng."
import type { Camera2D } from '../../film2d/Camera2D';
import type { Pt } from '../../film2d/doodle/Sketch';
import type { Keyer } from '../../film2d/Keyer';
import { DOOR } from '../../film2d/props/Bedroom2D';
import { cut, face, say } from '../anhGiaDinh/scenes/helpers';
import { FEED, SCALE, VIT_BED, type TaoBonCast, type TaoBonScene } from './cast';

/** Screen offset (px) that puts a shot's subject in the middle of the Reels safe zone. */
const SUBJECT = { dx: 50, dy: 200 } as const;

function frame(k: Keyer, t: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  cut(k, t, cam, x + SUBJECT.dx / zoom, y + SUBJECT.dy / zoom, zoom);
}

/** Gentle push-in onto a new framing (no shake: the user wants a calm camera). */
function crash(k: Keyer, cast: TaoBonCast, t: number, x: number, y: number, zoom: number): void {
  const { cam, cues } = cast;
  k.to(t, t + 0.5, cam, { x: x + SUBJECT.dx / zoom, y: y + SUBJECT.dy / zoom, zoom }, 'inOutSine');
  cues.push({ id: 'sfx_ting', t, volume: 0.3, pitch: 0.8 });
}

/** Táo's spot by the bed, facing Vịt. */
const TAO_SPOT = { x: 60, y: 0 } as const;
const WIDE = { x: -40, y: -420, zoom: 1.1 } as const;
const TAO_CLOSE = { zoom: 2.0 } as const;

export const sceneTaoBon: TaoBonScene = {
  id: 'tao-bon',
  title: 'Táo bón',
  start: 0,
  end: 34.2,
  build(k, cast) {
    const { tao, vit, sau, ga, cho, meo, room, cam, texts, cues, fx, hearts } = cast;
    const taoHead = { headTop: (): Pt => [tao.x, tao.y - tao.stemTipHeight() - 32] };
    const taoFace = (): [number, number] => [TAO_SPOT.x, TAO_SPOT.y - 140];
    const heart = (t0: number, x: number, y: number): void => {
      hearts.push({ t0, x, y });
    };
    const feed = (t: number, target: number, mouthOf: { mouth?: number; bill?: number } | null): void => {
      k.set(t, fx, { target, full: 1 });
      k.to(t, t + 0.22, fx, { reach: 1 }, 'outBack');
      cues.push({ id: 'sfx_boing', t, volume: 0.35, pitch: 1.6 });
      k.set(t + 0.3, fx, { full: 0 });
      cues.push({ id: 'sfx_pop', t: t + 0.3, volume: 0.5 });
      if (mouthOf && 'bill' in mouthOf) k.set(t + 0.32, mouthOf, { bill: 0 });
      k.to(t + 0.5, t + 0.7, fx, { reach: 0 }, 'inQuad');
    };

    // ---- Initial state -------------------------------------------------------------------
    k.set(0, room, { door: 0 });
    k.set(0, fx, { place: 0, burst: 0, bowl: 1, steam: 1, spoon: 0, reach: 0, target: FEED.vit, sick: 1, thermo: 1 });
    k.set(0, vit, { x: VIT_BED.x, y: VIT_BED.y, scale: SCALE.vit, lookX: 0.4, bill: 0, sweat: 0 });
    face(k, 0, vit, 'squeeze', 'frown');
    k.set(0, tao, { x: TAO_SPOT.x, y: TAO_SPOT.y, scale: SCALE.tao, flip: -1, legs: 1, run: 0, arms: 1, armL: 1.0, armR: 0.6, lookX: 0, leaf: 0.2 });
    k.face(0, tao, 'half', 'flat');
    k.set(0, sau, { x: 700, y: 0, scale: SCALE.sau, flip: -1, visible: 0 });
    face(k, 0, sau, 'dot', 'smile');
    for (const [who, x] of [[ga, 900], [cho, 900], [meo, 900]] as const) {
      k.set(0, who, { x, y: 0, scale: SCALE.critter, flip: -1, visible: 0, walk: 0, basket: 0 });
      face(k, 0, who, 'dot', 'smile');
    }

    // ---- 0 - 2.8: OPENING hook. Táo close-up with the steaming bowl, big title. ------------
    const [fx0, fy0] = taoFace();
    frame(k, 0, cam, fx0 + 10, fy0 + 30, 2.3);
    k.to(0, 2.8, cam, { zoom: 2.0 }, 'outQuad');
    texts.screen.push({ t0: 0.1, t1: 2.8, text: 'TÁO Ờ', x: 0.46, y: 0.175, size: 52 });
    texts.screen.push({ t0: 0.35, t1: 2.8, text: 'TÁO BÓN', x: 0.46, y: 0.245, size: 150, bounce: true, color: '#FF6B6B' });
    cues.push({ id: 'sfx_cop', t: 0.35, volume: 1 });
    cues.push({ id: 'sfx_boing', t: 0.38, volume: 0.6 });
    k.to(1.4, 2.0, tao, { sigh: 1 }, 'linear');
    k.set(2.0, tao, { sigh: 0 });
    cues.push({ id: 'sfx_haizz', t: 1.4, volume: 0.35 });
    texts.screen.push({ t0: 1.9, t1: 2.8, text: 'khụ khụ...', x: 0.25, y: 0.62, size: 50 });
    cues.push({ id: 'sfx_hu', t: 1.9, volume: 0.25 });
    cues.push({ id: 'sfx_hu', t: 2.2, volume: 0.25 });

    // ---- 2.8 - 6.5: Vịt sick in bed. Táo is not there yet. -------------------------------
    frame(k, 2.8, cam, WIDE.x, WIDE.y, WIDE.zoom);
    k.set(2.8, fx, { bowl: 0 });
    k.set(2.8, tao, { visible: 0, x: DOOR.x + 100 });
    k.to(2.8, 3.6, vit, { sweat: 1 }, 'linear');
    for (let i = 0; i < 4; i++) {
      const t = 3.0 + i * 0.8;
      k.to(t, t + 0.1, vit, { tilt: 0.06 }, 'outQuad').to(t + 0.1, t + 0.25, vit, { tilt: -0.04 }, 'inOutQuad').to(t + 0.25, t + 0.4, vit, { tilt: 0 }, 'inQuad');
    }
    texts.words.push({ t0: 3.0, t1: 3.5, text: 'khụ!', x: VIT_BED.x + 180, y: VIT_BED.y - 230, size: 52, rot: 0.1 });
    texts.words.push({ t0: 4.6, t1: 5.1, text: 'khụ!', x: VIT_BED.x + 200, y: VIT_BED.y - 250, size: 52, rot: -0.1 });
    say(k, cast, vit, 'vit', 3.1, 6.4, 'Tớ ốm rồi...\nkhông cầm muỗng nổi.', { mouthOf: vit, dx: 260, dy: -150, size: 50 });

    // ---- 6.5 - 9.0: the door opens, Táo brings porridge, Sâu follows. "Để tớ bón cho." -----
    k.set(6.4, vit, { sweat: 0 });
    k.to(6.5, 6.75, room, { door: 1 }, 'outQuad');
    cues.push({ id: 'sfx_snap', t: 6.5, volume: 0.5 });
    k.set(6.6, fx, { bowl: 1 });
    k.set(6.6, tao, { visible: 1, run: 1 });
    k.to(6.6, 7.6, tao, { x: TAO_SPOT.x }, 'outQuad');
    cues.push({ id: 'sfx_steps', t: 6.6, duration: 1.0, volume: 0.35 });
    k.set(7.6, tao, { run: 0 });
    k.set(6.9, sau, { visible: 1, x: DOOR.x + 120, wiggle: 1 });
    k.to(6.9, 8.4, sau, { x: TAO_SPOT.x + 170 }, 'linear');
    k.set(8.4, sau, { wiggle: 0 });
    face(k, 7.0, vit, 'dot', 'smile');
    k.set(7.0, vit, { lookX: 0.8 });
    say(k, cast, taoHead, 'tao', 7.7, 9.0, 'Để tớ\nbón cho.', { dx: 40, dy: -120, size: 54 });
    heart(8.2, VIT_BED.x + 40, VIT_BED.y - 230);

    // ---- 9.0 - 11.5: Táo blows on the spoonful, carefully. Kindness beat. ------------------
    frame(k, 9.0, cam, fx0 - 30, fy0 + 10, 1.9);
    k.to(9.0, 11.5, cam, { zoom: 2.1 }, 'linear');
    k.set(9.0, fx, { spoon: 1, reach: 0, full: 1 });
    k.set(9.0, tao, { armR: 2.4 });
    k.to(9.0, 9.3, tao, { armR: 2.7 }, 'outQuad');
    for (const [t, dx] of [[9.5, -110], [10.4, -150]] as const) {
      k.to(t, t + 0.15, tao, { sx: 1.06, sy: 0.96 }, 'outQuad').to(t + 0.15, t + 0.5, tao, { sx: 1, sy: 1 }, 'outQuad');
      texts.words.push({ t0: t, t1: t + 0.8, text: 'phù...', x: fx0 + dx, y: fy0 - 40, size: 64, rot: -0.08 });
      cues.push({ id: 'sfx_inflate', t, duration: 0.45, volume: 0.25, pitch: 0.7 });
    }
    k.to(9.5, 11.0, fx, { steam: 0.2 }, 'linear');
    heart(10.9, fx0 + 10, fy0 - 150);
    cues.push({ id: 'sfx_ting', t: 10.9, volume: 0.4, pitch: 1.2 });

    // ---- 11.5 - 14.5: the LONG spoon. "Há miệng ra. A~" "A~" MĂM! ---------------------------
    frame(k, 11.5, cam, WIDE.x, WIDE.y, WIDE.zoom);
    k.set(11.5, tao, { armR: 1.35 });
    say(k, cast, taoHead, 'tao', 11.6, 13.0, 'Há miệng ra.\nA~', { dx: 60, dy: -130, size: 52 });
    k.set(12.4, vit, { bill: 1 });
    k.set(12.4, fx, { thermo: 0 });
    face(k, 12.4, vit, 'happy', 'smile');
    say(k, cast, vit, 'none', 12.4, 13.4, 'A~', { dx: 120, dy: -120, size: 56 });
    k.set(12.9, fx, { full: 1 });
    k.to(12.9, 13.2, fx, { reach: 1 }, 'outBack');
    cues.push({ id: 'sfx_boing', t: 12.9, volume: 0.6, pitch: 0.7 });
    texts.words.push({ t0: 12.95, t1: 13.4, text: 'VÚT!', x: -60, y: -380, size: 70, rot: -0.1 });
    k.set(13.3, vit, { bill: 0 });
    k.set(13.3, fx, { full: 0 });
    cues.push({ id: 'sfx_pop', t: 13.3, volume: 0.8 });
    texts.words.push({ t0: 13.3, t1: 14.2, text: 'MĂM!', x: VIT_BED.x + 190, y: VIT_BED.y - 230, size: 72, rot: 0.1 });
    k.to(13.3, 13.45, vit, { sy: 0.9, sx: 1.08 }, 'outQuad').to(13.45, 13.75, vit, { sy: 1, sx: 1 }, 'outBack');
    heart(13.5, VIT_BED.x - 40, VIT_BED.y - 220);
    heart(13.7, VIT_BED.x + 60, VIT_BED.y - 240);
    cues.push({ id: 'sfx_mochi_happy', t: 13.5, volume: 0.5 });
    k.to(13.9, 14.3, fx, { reach: 0 }, 'inQuad');

    // ---- 14.5 - 16.0: Gà peeks in. Crash zoom. Drops the basket and runs. -------------------
    k.to(14.4, 14.6, room, { door: 0.35 }, 'outQuad');
    cues.push({ id: 'sfx_snap', t: 14.4, volume: 0.4, pitch: 0.8 });
    k.set(14.5, ga, { visible: 1, x: DOOR.x + DOOR.w - 40, basket: 1, lookX: -0.6 });
    face(k, 14.5, ga, 'dot', 'smile');
    // Feeding goes on in the background.
    feed(14.6, FEED.vit, vit);
    k.set(14.6, vit, { bill: 1 });
    face(k, 15.0, ga, 'shock', 'o');
    const gaFace: Pt = [DOOR.x + DOOR.w - 40, -110];
    crash(k, cast, 15.0, gaFace[0], gaFace[1], 2.4);
    texts.screen.push({ t0: 15.1, t1: 15.7, text: '!!', x: 0.7, y: 0.3, size: 140, color: '#FF6B6B' });
    cues.push({ id: 'sfx_trombone', t: 15.1, volume: 0.45 });
    k.to(15.0, 15.6, ga, { sweat: 1 }, 'linear');
    k.set(15.0, sau, { visible: 0 });
    k.set(15.6, sau, { visible: 1 });
    k.set(15.6, fx, { dropped: 1 });
    k.set(15.6, ga, { basket: 0 });
    cues.push({ id: 'sfx_cop', t: 15.6, volume: 0.6 });
    k.set(15.6, ga, { flip: 1, walk: 1 });
    k.set(15.6, room, { door: 1 });
    k.set(15.6, sau, { wiggle: 1, flip: -1 });
    k.to(15.6, 18.3, sau, { x: -90 }, 'linear');
    k.set(18.3, sau, { wiggle: 0 });
    k.to(15.6, 16.2, ga, { x: 470 }, 'outQuad');
    texts.words.push({ t0: 15.65, t1: 16.1, text: 'VÚT!', x: 330, y: -300, size: 64 });

    // ---- 15.6 - 18.5: in the hallway right outside the door (same set, the camera pans).
    // Chó and Mèo are waiting there. "Trời ơi! Vịt bị táo bón kìa!!" -------------------------
    const HALL = { x: 600, y: -150, zoom: 1.5 } as const;
    k.to(15.6, 16.2, cam, { x: HALL.x + SUBJECT.dx / HALL.zoom, y: HALL.y + SUBJECT.dy / HALL.zoom, zoom: HALL.zoom }, 'inOutSine');
    k.set(15.6, cho, { visible: 1, x: 590, flip: -1, walk: 0, lookX: 0.4 });
    k.set(15.6, meo, { visible: 1, x: 720, flip: -1, walk: 0, lookX: 0.2 });
    face(k, 15.6, cho, 'dot', 'smile');
    face(k, 15.6, meo, 'dot', 'smile');
    cues.push({ id: 'sfx_steps', t: 15.6, duration: 0.6, volume: 0.45 });
    k.set(16.2, ga, { walk: 0, sweat: 1 });
    face(k, 16.2, ga, 'shock', 'o');
    say(k, cast, ga, 'vit', 16.3, 17.65, 'Trời ơi!\nVịt bị táo bón kìa!!', { mouthOf: ga, dx: 80, dy: -170, size: 54, shout: true });
    cues.push({ id: 'sfx_cop', t: 16.3, volume: 0.5, pitch: 1.4 });
    k.to(16.3, 16.45, ga, { hop: 30 }, 'outQuad').to(16.45, 16.65, ga, { hop: 0 }, 'inQuad');
    // Chó and Mèo: shocked double take.
    face(k, 17.6, cho, 'shock', 'o');
    face(k, 17.6, meo, 'shock', 'o');
    k.set(17.6, cho, { sweat: 1, lookX: -0.5 });
    k.set(17.6, meo, { sweat: 1, lookX: -0.5 });
    k.to(17.6, 17.75, cho, { hop: 45 }, 'outQuad').to(17.75, 17.95, cho, { hop: 0 }, 'inQuad');
    k.to(17.65, 17.8, meo, { hop: 50 }, 'outQuad').to(17.8, 18.0, meo, { hop: 0 }, 'inQuad');
    cues.push({ id: 'sfx_trombone', t: 17.7, volume: 0.35, pitch: 0.8 });
    texts.words.push({ t0: 17.65, t1: 18.45, text: 'HẢ?!', x: 680, y: -260, size: 90, rot: 0.08 });

    // ---- 18.5 - 21.6: they burst in. Close on Táo: the wordplay. ---------------------------
    k.set(18.5, fx, { reach: 0 });
    k.to(18.4, 18.9, cam, { x: WIDE.x + SUBJECT.dx / WIDE.zoom, y: WIDE.y + SUBJECT.dy / WIDE.zoom, zoom: WIDE.zoom }, 'inOutSine');
    k.set(18.5, room, { door: 1 });
    k.set(18.5, tao, { visible: 1, armR: 1.35, lookX: 0 });
    k.set(18.5, vit, { visible: 1, bill: 0 });
    face(k, 18.5, vit, 'happy', 'smile');
    const DOORWAY = [175, 280, 385] as const;
    for (const [who, x, i] of [[ga, DOORWAY[0], 0], [cho, DOORWAY[1], 1], [meo, DOORWAY[2], 2]] as const) {
      k.set(18.5, who, { flip: -1, walk: 1, sweat: 0, hop: 0 });
      k.to(18.5, 19.0 + i * 0.1, who, { x }, 'outQuad');
      k.set(19.05 + i * 0.1, who, { walk: 0 });
      face(k, 18.5, who, 'shock', 'o');
    }
    cues.push({ id: 'sfx_steps', t: 18.5, duration: 0.5, volume: 0.45 });
    k.face(18.5, tao, 'half', 'flat');
    // Push in on Táo.
    crash(k, cast, 19.1, fx0 - 20, fy0 + 20, TAO_CLOSE.zoom);
    say(k, cast, taoHead, 'tao', 19.15, 21.6, 'Vịt không BỊ Táo bón.\nVịt ĐƯỢC Táo bón.', { dx: 20, dy: -150, size: 52 });
    cues.push({ id: 'sfx_ting', t: 20.3, volume: 0.5 });

    // ---- 21.6 - 23.0: "..." and Vịt wants more. -------------------------------------------
        frame(k, 21.6, cam, WIDE.x, WIDE.y, WIDE.zoom);
    for (const who of [ga, cho, meo]) face(k, 21.6, who, 'dot', 'flat');
    say(k, cast, cho, 'none', 21.65, 22.5, '...', { dx: 0, dy: -110, size: 56 });
    cues.push({ id: 'sfx_crickets', t: 21.65, duration: 0.8, volume: 0.45 });
    k.set(22.3, vit, { bill: 1, wing: 1 });
    say(k, cast, vit, 'none', 22.3, 23.1, 'A~ nữa!', { dx: 150, dy: -120, size: 54 });
    feed(22.5, FEED.vit, vit);

    // ---- 23.0 - 26.5: they look at each other... "Tụi tớ cũng muốn được Táo bón!" -------------
    k.set(23.1, vit, { wing: 0 });
    frame(k, 23.5, cam, 310, -170, 1.7);
    k.set(23.5, fx, { bowl: 0 });
    k.set(26.5, fx, { bowl: 1 });
    k.set(23.1, ga, { lookX: 0.6 });
    k.set(23.1, meo, { lookX: -0.6 });
    k.set(23.5, ga, { lookX: -0.4 });
    k.set(23.5, meo, { lookX: 0.4 });
    k.set(23.5, cho, { lookX: 0.6 });
    for (const who of [ga, cho, meo]) {
      face(k, 23.9, who, 'happy', 'grin');
      k.set(23.9, who, { lookX: -0.5 });
    }
    for (let i = 0; i < 3; i++) {
      const t = 23.9 + i * 0.45;
      for (const [j, who] of [ga, cho, meo].entries()) {
        k.to(t + j * 0.05, t + j * 0.05 + 0.15, who, { hop: 45 }, 'outQuad').to(t + j * 0.05 + 0.15, t + j * 0.05 + 0.32, who, { hop: 0 }, 'inQuad');
      }
      cues.push({ id: 'sfx_bop', t: t + 0.3, volume: 0.35, pitch: 1.2 + i * 0.15 });
    }
    say(k, cast, cho, 'vit', 23.9, 26.4, 'Tụi tớ cũng muốn\nđược Táo bón!', { mouthOf: cho, dx: -40, dy: -190, size: 58, shout: true });
    k.set(23.9, ga, { talk: 1 }).set(25.6, ga, { talk: 0 });
    k.set(23.9, meo, { talk: 1 }).set(25.6, meo, { talk: 0 });
    cues.push({ id: 'sfx_mochi_happy', t: 23.95, volume: 0.6 });
    heart(24.4, DOORWAY[0], -300);
    heart(24.6, DOORWAY[2], -310);

    // ---- 26.5 - 29.3: close on Táo. A small sigh. "Xếp hàng." (punchline) ------------------
    frame(k, 26.5, cam, fx0 - 20, fy0 + 20, 1.9);
    k.to(26.5, 29.3, cam, { zoom: 2.25 }, 'linear');
    k.to(26.6, 27.2, tao, { sigh: 1 }, 'linear');
    k.set(27.2, tao, { sigh: 0 });
    cues.push({ id: 'sfx_haizz', t: 26.6, volume: 0.45 });
    say(k, cast, taoHead, 'tao', 27.25, 29.3, 'Xếp hàng.', { dx: 20, dy: -130, size: 64 });
    cues.push({ id: 'sfx_cop', t: 27.25, volume: 0.6, pitch: 0.8 });

    // ---- 29.3 - 32.5: the queue. Táo feeds them one by one; Sâu last. Title. --------------
    frame(k, 29.3, cam, WIDE.x, WIDE.y, WIDE.zoom);
    k.set(29.3, tao, { x: 330 });
    k.set(29.3, fx, { reach: 0 });
    k.set(29.3, vit, { bill: 0 });
    face(k, 29.3, vit, 'closed', 'smile');
    const QUEUE: [typeof ga | typeof sau, number][] = [[ga, -250], [cho, -110], [meo, 30], [sau, 170]];
    for (const [who, x] of QUEUE) k.set(29.3, who, { x, flip: 1 });
    for (const who of [ga, cho, meo]) {
      face(k, 29.3, who, 'happy', 'o');
      k.set(29.3, who, { lookX: 0.5 });
    }
    k.set(29.3, sau, { rear: 1, perk: 1, flip: 1 });
    face(k, 29.3, sau, 'happy', 'o');
    feed(29.5, FEED.ga, null);
    feed(30.2, FEED.cho, null);
    feed(30.9, FEED.meo, null);
    for (const [t, who] of [[29.8, ga], [30.5, cho], [31.2, meo]] as const) {
      face(k, t, who, 'happy', 'smile');
      texts.words.push({ t0: t, t1: t + 0.5, text: 'măm!', x: who === ga ? -250 : who === cho ? -110 : 30, y: -300, size: 56 });
    }
    say(k, cast, sau, 'none', 31.4, 32.5, '...', { dx: 40, dy: -90, size: 54 });
    k.face(31.6, tao, 'half', 'smile');
    texts.screen.push({ t0: 30.3, t1: 32.5, text: 'TÁO Ờ · TÁO BÓN', x: 0.46, y: 0.19, size: 70, bounce: true });
    cues.push({ id: 'sfx_chime', t: 30.35, volume: 0.45 });

    // ---- 32.5 - 34.2: end card "HẾT" (channel rule: every Reel ends with it). -------------
    texts.screen.push({ t0: 32.5, t1: 34.2, text: 'HẾT', x: 0.46, y: 0.36, size: 170, bounce: true, color: '#FF6B6B' });
    cues.push({ id: 'sfx_cop', t: 32.5, volume: 0.6 });
    cues.push({ id: 'sfx_chime', t: 32.55, volume: 0.4, pitch: 0.8 });
  },
};

export const SCENES: TaoBonScene[] = [sceneTaoBon];
