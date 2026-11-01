import { MUSH_EYES, MUSH_MOUTHS } from '../../../film2d/characters/Mushroom2D';
import { SPOT, type EpisodeScene } from '../cast';
import { cut, face, flash, polaroid, say } from './helpers';

export const mush = (eyes?: (typeof MUSH_EYES)[number], mouth?: (typeof MUSH_MOUTHS)[number]) => ({
  ...(eyes ? { eyes: MUSH_EYES.indexOf(eyes) } : {}),
  ...(mouth ? { mouth: MUSH_MOUTHS.indexOf(mouth) } : {}),
});

/** Speech anchors for the two kids, who have no headTop() of their own. */
export function anchors(c: Parameters<EpisodeScene['build']>[1]) {
  return {
    nam: { headTop: () => [c.nam.x, c.nam.y - 395 * c.nam.scale] as [number, number] },
    tao: { headTop: () => [c.tao.x, c.tao.y - c.tao.stemTipHeight() - 10] as [number, number] },
  };
}

/** Title card, everybody in place, Mẹ asks Vịt for a photo. Take 1: Nấm is mid-sentence. */
export const scene01Setup: EpisodeScene = {
  id: 'setup',
  title: 'Cảnh 1: Chụp tấm ảnh',
  start: 0,
  end: 13,
  build(k, cast) {
    const { tao, nam, sau, vit, ba, me, cam, texts, cues } = cast;
    const who = anchors(cast);

    // Initial poses (t = 0).
    k.set(0, me, { x: SPOT.me, y: 0, scale: 1.12, armL: 0.15, armR: 0.5, bendR: 1.2 });
    face(k, 0, me, 'happy', 'smile');
    k.set(0, ba, { x: SPOT.ba, y: 0, scale: 1.12, armL: 0.5, bendL: 1.2, armR: 0.12 });
    face(k, 0, ba, 'dot', 'smile');
    k.set(0, nam, { x: SPOT.nam, y: SPOT.seat, scale: 0.62, armL: 0.3, armR: 0.3, ...mush('dot', 'smile') });
    k.set(0, tao, { x: SPOT.tao, y: SPOT.seat, scale: 0.3, legs: 0, armL: 0.2, armR: 0.2 });
    k.face(0, tao, 'half', 'flat');
    k.set(0, sau, { x: SPOT.sau, y: SPOT.seat, scale: 0.95, flip: -1 });
    face(k, 0, sau, 'dot', 'smile');
    k.set(0, vit, { x: SPOT.vit, y: SPOT.stool, scale: 0.85, flip: -1, camera: 1, aim: 0 });
    face(k, 0, vit, 'dot');

    // 0 - 3.2: title card on blank paper (camera looks at empty wall far above).
    cut(k, 0, cam, 0, -3200, 1);
    texts.screen.push({ t0: 0.3, t1: 3.2, text: 'ẢNH GIA ĐÌNH', x: 0.5, y: 0.44, size: 140, bounce: true });
    texts.screen.push({ t0: 1.0, t1: 3.2, text: 'nhà Táo', x: 0.5, y: 0.6, size: 64 });
    cues.push({ id: 'sfx_chime', t: 0.3, volume: 0.45 }, { id: 'sfx_bop', t: 1.0, volume: 0.4, pitch: 1.4 });

    // 3.2 - 8: wide shot of the living room.
    cut(k, 3.2, cam, 30, -450, 1);
    say(k, cast, me, 'me', 3.6, 5.9, 'Vịt ơi, chụp giúp cô\nmột tấm nhé!', { mouthOf: me, dx: -60 });
    k.set(4.0, vit, { lookX: 1 });
    face(k, 4.0, vit, 'happy');
    k.to(6.0, 6.2, vit, { hop: 26 }, 'outQuad').to(6.2, 6.4, vit, { hop: 0 }, 'inQuad');
    say(k, cast, vit, 'vit', 6.1, 7.9, 'Dạ! Cả nhà\ncười lên nào!', { mouthOf: vit, dx: -80 });
    face(k, 6.6, vit, 'dot');
    k.set(7.0, ba, { armL: 0.12, bendL: 0.2 });
    face(k, 7.0, ba, 'happy', 'grin');
    k.set(7.1, nam, mush('happy', 'grin'));
    face(k, 7.2, sau, 'happy', 'smile');
    k.set(7.6, vit, { aim: 1 });
    cues.push({ id: 'sfx_bop', t: 7.6, volume: 0.35, pitch: 1.8 });

    // 8 - 10.6: through Vịt's camera. Countdown from off screen; Nấm starts chatting.
    cut(k, 8.0, cam, -150, -400, 1.8);
    say(k, cast, vit, 'vit', 8.1, 8.9, 'Một...', { size: 52 });
    say(k, cast, vit, 'vit', 8.9, 9.7, 'Hai...', { size: 52 });
    k.set(9.3, nam, { lookX: 1, ...mush('dot', 'grin') });
    say(k, cast, who.nam, 'nam', 9.35, 10.75, 'Ơ Táo, mũ chị\ncó lệch không?', { mouthOf: nam, dx: -170, dy: -150 });
    say(k, cast, vit, 'vit', 10.0, 10.6, 'BA!', { size: 60 });

    // 10.6: click. Nấm caught mid-word, eyes shut.
    k.set(10.6, nam, { talk: 0, ...mush('closed', 'o') });
    flash(k, cast, 10.6);
    polaroid(k, cast, 1, 10.75, 13.0, -0.04);
    k.set(11.0, nam, mush('dot', 'smile'));
  },
};
