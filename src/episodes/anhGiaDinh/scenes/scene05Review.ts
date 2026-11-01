import { PERFECT_T, REC_START, type EpisodeScene } from '../cast';
import { anchors, mush } from './scene01Setup';
import { cut, face, pan, say } from './helpers';

/** Reviewing the video on Vịt's camera, finding the frame, Táo's "Ờ.", and the stinger. */
export const scene05Review: EpisodeScene = {
  id: 'review',
  title: 'Cảnh 5: Tìm khung đẹp nhất',
  start: 46.4,
  end: 63.5,
  build(k, cast) {
    const { nam, tao, ba, me, sau, vit, cam, lcdCam, fx, room, texts, cues } = cast;
    const who = anchors(cast);

    // 46.4 - 49: the camera screen, scrubbing frame by frame...
    k.set(46.4, fx, { lcd: 1, scrub: REC_START });
    k.to(46.6, 48.8, fx, { scrub: PERFECT_T }, 'outCubic');
    k.set(48.8, fx, { scrub: PERFECT_T });
    say(k, cast, null, 'vit', 46.7, 48.3, 'Tua... tua...', { screen: [0.5, 0.09], size: 44 });
    cues.push({ id: 'sfx_scrub', t: 46.6, duration: 2.1, volume: 0.5 });
    cues.push({ id: 'sfx_ting', t: 48.8, volume: 0.7 });
    // Pinch-zoom on the screen, right onto Táo's face.
    k.to(48.9, 49.5, lcdCam, { x: -50, y: -215, zoom: 4.6 }, 'inOutQuad');
    cues.push({ id: 'sfx_bop', t: 48.9, volume: 0.4, pitch: 1.3 }, { id: 'sfx_bop', t: 49.2, volume: 0.4, pitch: 1.7 });
    say(k, cast, null, 'nam', 49.4, 50.7, 'Ơ! TÁO CƯỜI KÌA!!', { screen: [0.5, 0.09], shout: true, size: 52 });
    k.set(51.2, fx, { lcd: 0 });

    // 50.7 - 54.2: everybody stares at Táo. Táo: "Ờ."
    // Reset the family to sitting normally first (off screen during the review).
    k.set(46.4, ba, { tilt: 0, headTilt: 0, sweat: 0 });
    k.set(46.4, me, { headTilt: 0 });
    k.set(46.4, nam, { capDown: 0, sx: 1, sy: 1 });
    cut(k, 51.2, cam, -50, -225, 3.4);
    k.set(51.2, nam, { lookX: 1, sparkle: 1, ...mush('happy', 'grin') });
    k.set(51.2, sau, { lookX: 1 });
    face(k, 51.2, sau, 'dot', 'smile');
    k.set(51.2, tao, { lookX: 0 });
    say(k, cast, who.tao, 'tao', 51.6, 52.6, 'Ờ.', { dx: 110, dy: -100, size: 54 });
    cues.push({ id: 'sfx_o', t: 51.65, volume: 0.9 });
    say(k, cast, who.tao, 'tao', 52.8, 54.3, 'Một khung thôi.', { dx: 110, dy: -100 });

    // 54.3 - 58: the framed photo on the wall, then the whole room.
    k.set(54.4, room, { photo: 1 });
    k.set(54.3, nam, { sparkle: 0, lookX: 0, ...mush('happy', 'smile') });
    face(k, 54.3, ba, 'happy', 'smile');
    k.set(54.3, ba, { lookX: 0 });
    face(k, 54.3, me, 'happy', 'smile');
    k.set(54.3, me, { lookX: 0 });
    k.set(54.3, vit, { camera: 0, aim: 0, rec: 0, x: 470, y: 0, flip: -1, lookX: 0 });
    face(k, 54.3, vit, 'happy');
    k.set(54.3, room, { stool: 0 });
    cut(k, 54.4, cam, -300, -800, 3.2);
    cues.push({ id: 'sfx_chime', t: 54.4, volume: 0.45 });
    pan(k, 55.4, 57.2, cam, 0, -470, 1.02);
    say(k, cast, me, 'me', 57.2, 59.2, 'Mà công nhận...\ntấm nào Sâu cũng đẹp.', { mouthOf: me, dx: -60 });
    k.set(57.4, sau, { lookX: 0 });
    face(k, 59.3, sau, 'happy', 'smile');
    k.set(59.3, sau, { blush: 2.2 });
    say(k, cast, sau, 'none', 59.3, 61.0, '...', { dx: 60, dy: -90, size: 54 });
    cues.push({ id: 'sfx_bop', t: 59.3, volume: 0.35, pitch: 1.5 });

    // 61 - 63: fade, end card.
    k.to(60.6, 61.2, fx, { fade: 1 }, 'linear');
    texts.screen.push({ t0: 61.2, t1: 63.5, text: 'HẾT', x: 0.5, y: 0.47, size: 120, color: '#FBFAF6' });
    cues.push({ id: 'sfx_chime', t: 61.2, volume: 0.35 });
  },
};
