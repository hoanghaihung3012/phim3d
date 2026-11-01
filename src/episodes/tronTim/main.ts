import type { Cue } from '../../audio/cues';
import { setFilmFormat } from '../../config/film';
import { bootFilm2D } from '../../film2d/boot';
import { setBabble } from '../anhGiaDinh/scenes/helpers';
import '../../style.css';
import { createTronTimCast } from './cast';
import { BASE_CUES } from './cues';
import { drawTronTimFrame } from './drawFrame';
import { SCENES } from './scenes';

// Episode "Trốn tìm" (docs/episodes/tron-tim.md): a vertical 9:16 clip for Reels.
// ?nobabble: drop the synth babble so the recorded dub can be mixed in (scripts/mix-dub.mjs).
// ?safe: show the Reels safe-zone guides (never in the export).
const query = new URLSearchParams(location.search);
setFilmFormat('vertical');
setBabble(!query.has('nobabble'));
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  createCast: () => {
    const cast = createTronTimCast(cues);
    cast.fx.guides = query.has('safe') ? 1 : 0;
    return cast;
  },
  drawFrame: drawTronTimFrame,
  fileName: 'tao-tron-tim.webm',
});
