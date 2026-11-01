import type { Cue } from '../../audio/cues';
import { bootFilm2D } from '../../film2d/boot';
import { LINE_THEME } from '../../film2d/doodle/themes';
import '../../style.css';
import { createEpisodeCast } from '../anhGiaDinh/cast';
import { BASE_CUES } from '../anhGiaDinh/cues';
import { createEpisodeDrawer } from '../anhGiaDinh/drawFrame';
import { SCENES } from '../anhGiaDinh/scenes';

// "Ảnh gia đình", minimal line version: same scenes and sound, but pure white paper,
// thin black ink, washed-out colours, a bare room, still lines (no boil) and limited
// animation at 8 drawings per second.
const DRAW_FPS = 8;
const cues: Cue[] = [...BASE_CUES];
bootFilm2D({
  scenes: SCENES,
  cues,
  drawFps: DRAW_FPS,
  boil: 1,
  createCast: () => {
    const cast = createEpisodeCast(cues);
    cast.room.minimal = true;
    return cast;
  },
  drawFrame: createEpisodeDrawer(LINE_THEME, DRAW_FPS),
  fileName: 'tao-anh-gia-dinh-net.webm',
});
