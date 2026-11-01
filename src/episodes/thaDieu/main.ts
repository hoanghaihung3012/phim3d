import type { Cue } from '../../audio/cues';
import { bootFilm2D } from '../../film2d/boot';
import { setBabble } from '../anhGiaDinh/scenes/helpers';
import '../../style.css';
import { createKiteCast } from './cast';
import { BASE_CUES } from './cues';
import { drawKiteFrame } from './drawFrame';
import { SCENES } from './scenes';

// Episode "Thả diều" (docs/episodes/tha-dieu.md), in the colourful comic-strip look.
// ?nobabble: drop the synth babble so a recorded dub can be mixed in (scripts/mix-dub.mjs).
setBabble(!new URLSearchParams(location.search).has('nobabble'));
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  createCast: () => createKiteCast(cues),
  drawFrame: drawKiteFrame,
  fileName: 'tao-tha-dieu.webm',
});
