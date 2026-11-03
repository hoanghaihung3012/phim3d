import type { Cue } from '../../audio/cues';
import { setFilmFormat } from '../../config/film';
import { bootFilm2D } from '../../film2d/boot';
import { setBabble } from '../anhGiaDinh/scenes/helpers';
import '../../style.css';
import { createTaoBonCast } from './cast';
import { BASE_CUES } from './cues';
import { drawTaoBonFrame } from './drawFrame';
import { SCENES } from './scenes';

// Episode "Táo bón" (docs/episodes/tao-bon.md): a vertical 9:16 clip for Reels, with no voices
// (speech bubbles, music and sound effects only), so the babble synth is always off.
// ?safe: show the Reels safe-zone guides (never in the export).
const query = new URLSearchParams(location.search);
setFilmFormat('vertical');
setBabble(false);
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  createCast: () => {
    const cast = createTaoBonCast(cues);
    cast.fx.guides = query.has('safe') ? 1 : 0;
    return cast;
  },
  drawFrame: drawTaoBonFrame,
  fileName: 'tao-bon.webm',
});
