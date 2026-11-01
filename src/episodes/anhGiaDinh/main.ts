import type { Cue } from '../../audio/cues';
import { bootFilm2D } from '../../film2d/boot';
import '../../style.css';
import { createEpisodeCast } from './cast';
import { BASE_CUES } from './cues';
import { createEpisodeDrawer } from './drawFrame';
import { SCENES } from './scenes';

// Episode "Ảnh gia đình" (docs/episodes/anh-gia-dinh.md). Scenes add their dialogue
// babble to `cues` while they are built, before the audio manager reads the list.
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  createCast: () => createEpisodeCast(cues),
  drawFrame: createEpisodeDrawer(),
  fileName: 'tao-anh-gia-dinh.webm',
});
