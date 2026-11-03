// Cast of "Bập bênh" (docs/episodes/bap-benh.md): Táo and Vịt on a playground seesaw, Sâu
// trying to help. Riders sit on the plank at a position u along it (see BapBenhFx).
import type { Cue } from '../../audio/cues';
import { REELS_SAFE } from '../../config/film';
import type { FilmScene } from '../../film2d/boot';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { PlaygroundSeesaw2D } from '../../film2d/props/PlaygroundSeesaw2D';
import { Texts } from '../../film2d/props/Texts';

/** Sizes: Táo is a solid apple, a bit smaller than round Vịt but much heavier. */
export const SCALE = { tao: 0.45, vit: 0.95, sau: 1.15 } as const;

/** Seat positions along the plank (-1 left end, +1 right end). */
export const SEAT = { vit: -0.93, tao: 0.93, taoMiddle: 0.46, vitMiddle: -0.38, sau: -0.72 } as const;

/**
 * Who is riding the plank and where. While `<who>Ride` is 1, drawFrame puts that character
 * on the plank at `<who>U` (keyed x / y are ignored); at 0 the keyed x / y are used.
 */
export class BapBenhFx {
  taoRide = 0;
  taoU = SEAT.tao;
  vitRide = 1;
  vitU = SEAT.vit;
  sauRide = 0;
  sauU = SEAT.sau;
  /** 1 shows the Reels safe-zone guides (preview only, ?safe). */
  guides = 0;
}

export interface BapBenhCast {
  tao: Apple2D;
  vit: Duckling2D;
  sau: Caterpillar2D;
  seesaw: PlaygroundSeesaw2D;
  meadow: Meadow2D;
  cam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: BapBenhFx;
  cues: Cue[];
}

export type BapBenhScene = FilmScene<BapBenhCast>;

export function createBapBenhCast(cues: Cue[]): BapBenhCast {
  const vit = new Duckling2D();
  vit.round = 1;
  const bubbles = new Bubbles();
  bubbles.safe = { ...REELS_SAFE };
  return {
    tao: new Apple2D(),
    vit,
    sau: new Caterpillar2D(),
    seesaw: new PlaygroundSeesaw2D(),
    meadow: new Meadow2D(),
    cam: new Camera2D(),
    texts: new Texts(),
    bubbles,
    fx: new BapBenhFx(),
    cues,
  };
}
