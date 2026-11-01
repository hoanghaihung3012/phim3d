import type { EpisodeScene } from '../cast';
import { anchors, mush } from './scene01Setup';
import { cut, face, flash, polaroid, say, shake } from './helpers';

/** Take 3 is perfect, except Táo. "TÁO! CƯỜI LÊN COI!" "Em đang cười mà." */
export const scene03Smile: EpisodeScene = {
  id: 'smile',
  title: 'Cảnh 3: Táo cười đi',
  start: 22,
  end: 32.8,
  build(k, cast) {
    const { nam, tao, ba, me, sau, vit, cam, cues } = cast;
    const who = anchors(cast);

    // 22 - 24: wide. Vịt tries again; everybody puts on their best smile.
    cut(k, 22.0, cam, 30, -450, 1);
    k.set(22.0, ba, { lookX: 0, brows: 0, sweat: 0 });
    face(k, 22.0, ba, 'happy', 'grin');
    k.set(22.0, me, { lookX: 0, brows: 0 });
    face(k, 22.0, me, 'happy', 'smile');
    k.set(22.0, vit, { brows: 1 });
    say(k, cast, vit, 'vit', 22.1, 24.0, 'Lần này phải đẹp!\nMột... hai...', { mouthOf: vit, dx: -110 });
    k.set(22.6, nam, mush('happy', 'grin'));
    k.to(22.6, 22.9, nam, { sy: 1.05 }, 'outQuad').to(22.9, 23.2, nam, { sy: 1 }, 'inOutSine');
    face(k, 22.8, sau, 'happy', 'smile');
    k.face(22.9, tao, 'half', 'flat');

    // 24 - 24.6: the camera's view, "BA!", flash: four smiles and one Táo.
    cut(k, 24.0, cam, -150, -400, 1.8);
    say(k, cast, vit, 'vit', 24.0, 24.6, 'BA!', { size: 60 });
    flash(k, cast, 24.6);
    polaroid(k, cast, 3, 24.75, 27.0, -0.025);
    cues.push({ id: 'sfx_crickets', t: 25.4, duration: 1.5, volume: 0.45 });

    // 27 - 29: everybody turns to Táo. Nấm goes fierce.
    cut(k, 27.0, cam, -150, -290, 2.2);
    k.set(27.0, ba, { lookX: -1, brows: 0 });
    face(k, 27.0, ba, 'dot', 'flat');
    k.set(27.0, me, { lookX: 1 });
    face(k, 27.0, me, 'dot', 'flat');
    k.set(27.0, sau, { lookX: 1 });
    face(k, 27.0, sau, 'dot', 'smile');
    k.set(27.0, nam, { lookX: 1, brows: 1, anger: 1, ...mush('dot', 'grin') });
    k.to(27.0, 27.15, nam, { sy: 1.12, sx: 0.94, capSquash: 1.1 }, 'outQuad').to(27.15, 27.5, nam, { sy: 1, sx: 1, capSquash: 1 }, 'outBack');
    shake(k, 27.1, cam, 14, 0.35);
    say(k, cast, who.nam, 'nam', 27.15, 29.0, 'TÁO!\nCƯỜI LÊN COI!', { mouthOf: nam, shout: true, dx: -40, dy: -190, size: 54 });

    // 29.1 - 31.2: close on Táo. Nothing moves.
    cut(k, 29.1, cam, -50, -225, 3.4);
    k.set(29.1, nam, { brows: 0, anger: 0, talk: 0, ...mush('dot', 'smile') });
    k.set(29.1, tao, { lookX: -0.6 });
    say(k, cast, who.tao, 'tao', 29.5, 31.2, 'Em đang cười mà.', { dx: 120, dy: -110 });

    // 31.3 - 32.8: Ba and Mẹ look at each other.
    cut(k, 31.3, cam, -165, -470, 1.55);
    k.set(31.3, ba, { lookX: -1 });
    k.set(31.3, me, { lookX: 1 });
    cues.push({ id: 'sfx_crickets', t: 31.3, duration: 1.4, volume: 0.4 });
    say(k, cast, ba, 'ba', 31.7, 32.8, '...Thật hả?', { mouthOf: ba, dx: 140, dy: -40, size: 42 });
  },
};
