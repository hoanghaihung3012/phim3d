// Cast, layout and shared timings of the episode "Ảnh gia đình" (docs/episodes/anh-gia-dinh.md).
import type { Cue } from '../../audio/cues';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Mushroom2D } from '../../film2d/characters/Mushroom2D';
import { Person2D } from '../../film2d/characters/Person2D';
import type { FilmScene } from '../../film2d/boot';
import { Bubbles } from '../../film2d/props/Bubbles';
import { LivingRoom2D, SOFA, STOOL } from '../../film2d/props/LivingRoom2D';
import { Texts } from '../../film2d/props/Texts';

/** Where everybody sits or stands for the family photo. */
export const SPOT = {
  me: -420,
  ba: 90,
  nam: -245,
  tao: -50,
  sau: 95,
  seat: SOFA.seatY,
  vit: STOOL.x,
  stool: STOOL.topY,
} as const;

/** Moments the shutter fires (index = photo number shown on the polaroid). */
export const PHOTO_TIMES = [0, 10.6, 17.8, 24.6] as const;
/** The video Vịt records starts here... */
export const REC_START = 41.0;
/** ...and this single drawing is the one where Táo smiles. */
export const PERFECT_T = 43.5;
export const PERFECT_PHOTO = 4;

export class EpisodeFx {
  fade = 0;
  /** White camera flash. */
  flash = 0;
  /** Polaroid on screen: 0 none, 1..3 = PHOTO_TIMES index, 4 = the perfect frame. */
  photo = 0;
  photoTilt = 0;
  photoScale = 1;
  /** Camera screen (reviewing the video) on top of everything. */
  lcd = 0;
  /** Film time of the recorded drawing shown on the camera screen. */
  scrub = 0;
  /** "● REC" overlay while looking through Vịt's camera. */
  rec = 0;
}

export interface EpisodeCast {
  tao: Apple2D;
  nam: Mushroom2D;
  sau: Caterpillar2D;
  vit: Duckling2D;
  ba: Person2D;
  me: Person2D;
  room: LivingRoom2D;
  cam: Camera2D;
  /** Fixed framing of Vịt's camera (used for photos and the recorded video). */
  photoCam: Camera2D;
  /** Framing on the camera screen while reviewing the video (can zoom in). */
  lcdCam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: EpisodeFx;
  /** Sound cues; scenes add voice babble here while they are built. */
  cues: Cue[];
}

export type EpisodeScene = FilmScene<EpisodeCast>;

export function photoFraming(cam: Camera2D): Camera2D {
  cam.x = -150;
  cam.y = -400;
  cam.zoom = 1.8;
  return cam;
}

export function createEpisodeCast(cues: Cue[]): EpisodeCast {
  const tao = new Apple2D();
  const nam = new Mushroom2D();
  const sau = new Caterpillar2D();
  const vit = new Duckling2D();
  return {
    tao,
    nam,
    sau,
    vit,
    ba: new Person2D('dad'),
    me: new Person2D('mom'),
    room: new LivingRoom2D(),
    cam: new Camera2D(),
    photoCam: photoFraming(new Camera2D()),
    lcdCam: photoFraming(new Camera2D()),
    texts: new Texts(),
    bubbles: new Bubbles(),
    fx: new EpisodeFx(),
    cues,
  };
}
