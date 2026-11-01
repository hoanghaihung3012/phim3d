import type { Cue } from '../../audio/cues';
import { bootFilm2D } from '../../film2d/boot';
import '../../style.css';
import { createKiteCast } from './cast';
import { BASE_CUES } from './cues';
import { drawKiteFrame } from './drawFrame';
import { SCENES } from './scenes';

// Episode "Thả diều" (docs/episodes/tha-dieu.md), in the colourful comic-strip look.
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  createCast: () => createKiteCast(cues),
  drawFrame: drawKiteFrame,
  fileName: 'tao-tha-dieu.webm',
});
