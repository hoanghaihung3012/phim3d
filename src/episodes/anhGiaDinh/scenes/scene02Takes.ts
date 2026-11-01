import { SPOT, type EpisodeScene } from '../cast';
import { anchors, mush } from './scene01Setup';
import { cut, face, flash, polaroid, say, shake } from './helpers';

/** Nấm complains; take 2: Ba sneezes on "Ba!". Mẹ's look. */
export const scene02Takes: EpisodeScene = {
  id: 'takes',
  title: 'Cảnh 2: Hắt xì',
  start: 13,
  end: 22,
  build(k, cast) {
    const { nam, tao, ba, me, vit, cam, texts, cues } = cast;
    const who = anchors(cast);

    // 13 - 15.2: Nấm, briefly fierce, then instantly cheerful again.
    cut(k, 13.0, cam, -150, -290, 2.2);
    k.set(13.0, nam, { lookX: 0.4, brows: 1, anger: 1, ...mush('dot', 'grin') });
    k.to(13.0, 13.15, nam, { sy: 1.08, sx: 0.95 }, 'outQuad').to(13.15, 13.4, nam, { sy: 1, sx: 1 }, 'outBack');
    say(k, cast, who.nam, 'nam', 13.1, 15.0, 'Chị đang nói mà!\nChụp lại đi!', { mouthOf: nam, shout: true, dx: 40, dy: -170 });
    k.face(13.4, tao, 'half', 'flat');
    k.set(15.0, nam, { brows: 0, anger: 0, lookX: 0, ...mush('happy', 'grin') });

    // 15.2 - 17.8: through the camera again. Ba's nose starts to itch.
    cut(k, 15.2, cam, -150, -400, 1.8);
    say(k, cast, vit, 'vit', 15.3, 16.0, 'Một...', { size: 52 });
    k.set(15.6, ba, { itch: 1 });
    face(k, 15.6, ba, 'dot', 'smile');
    say(k, cast, vit, 'vit', 16.0, 16.7, 'Hai...', { size: 52 });
    face(k, 16.2, ba, 'half', 'o');
    k.to(16.2, 17.6, ba, { headTilt: -0.16, tilt: -0.03 }, 'inOutSine');
    say(k, cast, ba, 'ba', 16.25, 17.6, 'Ha... ha...', { dx: 140, dy: -60, size: 42 });
    say(k, cast, vit, 'vit', 17.2, 17.8, 'BA!', { size: 60 });

    // 17.8: HẮT XÌ! Flash. Everybody jumps except Táo (and Sâu, who keeps smiling).
    k.set(17.8, ba, { itch: 0, headTilt: 0.22, tilt: 0.1, spray: 0 });
    face(k, 17.8, ba, 'squeeze', 'sneeze');
    k.to(17.8, 18.3, ba, { spray: 1 }, 'linear');
    texts.words.push({ t0: 17.8, t1: 19.0, text: 'HẮT XÌ!', x: SPOT.ba + 170, y: -720, size: 70, rot: 0.08 });
    cues.push({ id: 'sfx_sneeze', t: 17.75, volume: 0.9 });
    k.set(17.8, me, { tilt: -0.07 });
    face(k, 17.8, me, 'shock', 'o');
    k.set(17.8, nam, { capLift: 14, ...mush('shock', 'o') });
    shake(k, 17.8, cam, 10, 0.25);
    flash(k, cast, 17.8);
    polaroid(k, cast, 2, 17.95, 20.0, 0.035);

    // 20 - 22: Mẹ looks at Ba. Ba sweats.
    cut(k, 20.0, cam, -165, -470, 1.55);
    k.set(20.0, ba, { headTilt: 0, tilt: 0, lookX: -1, brows: 2, sweat: 0 });
    face(k, 20.0, ba, 'dot', 'wavy');
    k.to(20.1, 21.0, ba, { sweat: 1 }, 'linear');
    k.set(20.0, me, { tilt: 0, lookX: 1, brows: 1 });
    face(k, 20.0, me, 'half', 'flat');
    k.set(20.0, nam, { capLift: 0, ...mush('dot', 'smile') });
    say(k, cast, ba, 'ba', 20.3, 21.9, 'Xin lỗi...\nbụi thôi mà.', { mouthOf: ba, dx: 150, dy: -40 });
    cues.push({ id: 'sfx_crickets', t: 20.1, duration: 0.8, volume: 0.35 });
  },
};
