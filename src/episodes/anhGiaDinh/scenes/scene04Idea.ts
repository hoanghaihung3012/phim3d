import { PERFECT_T, REC_START, type EpisodeScene } from '../cast';
import { anchors, mush } from './scene01Setup';
import { cut, face, say } from './helpers';

/**
 * The battery is dying; Táo's clever line: film a video and pick the best frame.
 * Then the recording: everybody holds their smile as long as they can, and for exactly
 * one drawing (PERFECT_T) Táo smiles too.
 */
export const scene04Idea: EpisodeScene = {
  id: 'idea',
  title: 'Cảnh 4: Quay video đi',
  start: 32.8,
  end: 46.4,
  build(k, cast) {
    const { nam, tao, ba, me, sau, vit, cam, fx, cues } = cast;
    const who = anchors(cast);

    // 32.9 - 34.8: Vịt panics about the battery.
    cut(k, 32.9, cam, 380, -330, 1.45);
    k.set(32.9, vit, { brows: 2, aim: 0 });
    face(k, 32.9, vit, 'dot');
    k.to(32.9, 33.8, vit, { sweat: 1 }, 'linear');
    k.set(32.9, ba, { lookX: 0.6 });
    k.set(32.9, sau, { lookX: 0 });
    say(k, cast, vit, 'vit', 33.0, 34.8, 'Ơ... máy sắp\nhết pin rồi!', { mouthOf: vit, dx: -120 });
    cues.push({ id: 'sfx_trombone', t: 33.2, volume: 0.25 });

    // 35 - 38.8: Táo, flat as ever, solves it.
    cut(k, 35.0, cam, -50, -225, 3.4);
    k.set(35.0, tao, { lookX: 1 });
    say(k, cast, who.tao, 'tao', 35.2, 36.9, 'Vịt. Quay video đi.', { dx: -40, dy: -110 });
    say(k, cast, who.tao, 'tao', 37.0, 38.8, 'Rồi chọn khung\nđẹp nhất.', { dx: -40, dy: -120 });

    // 38.9 - 40.6: wide. Silence... then Mẹ is impressed.
    cut(k, 38.9, cam, 30, -450, 1);
    k.set(38.9, vit, { brows: 0, sweat: 0, lookX: 0 });
    face(k, 38.9, vit, 'shock');
    k.set(38.9, nam, { lookX: 0.6, bulb: 1, ...mush('shock', 'o') });
    face(k, 38.9, ba, 'dot', 'o');
    face(k, 38.9, me, 'dot', 'o');
    k.set(38.9, me, { lookX: 1 });
    cues.push({ id: 'sfx_ting', t: 39.0, volume: 0.5 });
    say(k, cast, me, 'me', 39.4, 40.6, 'Ồ... thông minh ghê!', { mouthOf: me, dx: -40 });
    face(k, 39.4, me, 'happy', 'smile');

    // 40.6 - 41: Vịt starts recording.
    k.set(40.6, nam, { bulb: 0 });
    k.set(40.6, vit, { aim: 1, rec: 1 });
    face(k, 40.6, vit, 'happy');
    say(k, cast, vit, 'vit', 40.6, 41.9, 'Quay nè! Giữ nguyên nha!', { mouthOf: vit, dx: -140 });

    // 41 - 45.5: through the camera, REC. Everybody holds the smile... and holds it.
    cut(k, REC_START, cam, -150, -400, 1.8);
    k.set(REC_START, fx, { rec: 1 });
    k.set(REC_START, ba, { lookX: 0 });
    face(k, REC_START, ba, 'happy', 'grin');
    k.set(REC_START, me, { lookX: 0 });
    face(k, REC_START, me, 'happy', 'smile');
    k.set(REC_START, nam, { lookX: 0, ...mush('happy', 'grin') });
    k.set(REC_START, tao, { lookX: 0 });
    k.face(REC_START, tao, 'half', 'flat');
    face(k, REC_START, sau, 'happy', 'smile');
    cues.push({ id: 'sfx_ticks', t: REC_START + 0.3, duration: 4.0, volume: 0.35 });

    // The single drawing where Táo smiles (one frame only, like the series rule).
    k.face(PERFECT_T, tao, 'happy', 'smile');
    k.set(PERFECT_T, tao, { blush: 1.6 });
    k.face(PERFECT_T + 1 / 12, tao, 'half', 'flat');
    k.set(PERFECT_T + 1 / 12, tao, { blush: 1 });

    // Strain builds after the perfect moment.
    k.set(43.8, ba, { tremble: 1 });
    k.to(43.8, 44.6, ba, { sweat: 1 }, 'linear');
    k.set(44.2, me, { tremble: 1 });
    k.set(44.5, nam, { sweat: 1, ...mush('closed', 'wavy') });
    k.set(44.8, sau, { wiggle: 0.6 });
    k.set(45.0, ba, { brows: 2 });
    face(k, 45.0, ba, 'squeeze', 'grin');

    // 45.5: "Xong!" Everybody collapses.
    cut(k, 45.5, cam, 30, -450, 1);
    k.set(45.5, fx, { rec: 0 });
    k.set(45.5, vit, { rec: 0 });
    face(k, 45.5, vit, 'happy');
    say(k, cast, vit, 'vit', 45.5, 46.4, 'XONG!', { mouthOf: vit, dx: -60, size: 56 });
    k.set(45.6, ba, { tremble: 0, brows: 0, tilt: 0.06, headTilt: 0.15 });
    face(k, 45.6, ba, 'closed', 'o');
    k.set(45.6, me, { tremble: 0, headTilt: -0.12 });
    face(k, 45.6, me, 'closed', 'o');
    k.set(45.6, nam, { sweat: 0, capDown: 10, ...mush('closed', 'o') });
    k.to(45.6, 45.9, nam, { sy: 0.88, sx: 1.08 }, 'outQuad');
    k.set(45.6, sau, { wiggle: 0 });
    face(k, 45.6, sau, 'closed', 'smile');
    cues.push({ id: 'sfx_haizz', t: 45.65, duration: 0.9, volume: 0.6 });
  },
};
