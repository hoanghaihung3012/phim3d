// Cast of "Con vật cưng" (docs/episodes/con-vat-cung.md): show-and-tell of pets in Táo's
// front yard. Vịt brings his puppy (shakes hands), Gà her kitten (rolls over), Táo brings Sâu
// on a red cushion ("Nó biết im. Hiếm lắm."). The pets are small, non-talking Critter2Ds.
import type { Cue } from '../../audio/cues';
import { REELS_SAFE } from '../../config/film';
import type { FilmScene } from '../../film2d/boot';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Critter2D } from '../../film2d/characters/Critter2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { Texts } from '../../film2d/props/Texts';

export const SCALE = { tao: 0.45, vit: 0.95, sau: 1.0, ga: 0.72, pet: 0.5 } as const;

/** Where everyone stands at the start: owners in the back row, pets in front. */
export const SPOT = {
  vit: { x: -330, y: 0 },
  cho: { x: -190, y: 120 },
  ga: { x: 20, y: 0 },
  meo: { x: 150, y: 120 },
  tao: { x: 310, y: 0 },
  sau: { x: 380, y: 130 },
  /** Front and centre: where Táo puts Sâu's cushion for the show. */
  stage: { x: 0, y: 230 },
} as const;

export class ConVatCungFx {
  /** Iris: 1 open, 0 closed. Centre as fractions of the frame. */
  iris = 1;
  irisX = 0.5;
  irisY = 0.4;
  /** A leaf drifting across during the long silence (world x, y; visible 0/1). */
  leaf = 0;
  leafX = 0;
  leafY = 0;
  /** Sâu's cushion is carried by Táo (raised off the ground). */
  carry = 0;
  /** 1 shows the Reels safe-zone guides (preview only, ?safe). */
  guides = 0;
}

export interface ConVatCungCast {
  tao: Apple2D;
  vit: Duckling2D;
  sau: Caterpillar2D;
  ga: Critter2D;
  cho: Critter2D;
  meo: Critter2D;
  meadow: Meadow2D;
  cam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: ConVatCungFx;
  cues: Cue[];
}

export type ConVatCungScene = FilmScene<ConVatCungCast>;

export function createConVatCungCast(cues: Cue[]): ConVatCungCast {
  const vit = new Duckling2D();
  vit.round = 1;
  const cho = new Critter2D('dog');
  const meo = new Critter2D('cat');
  cho.collar = 1;
  meo.collar = 1;
  const bubbles = new Bubbles();
  bubbles.safe = { ...REELS_SAFE };
  const meadow = new Meadow2D();
  meadow.cloudSpeed = 6;
  return {
    tao: new Apple2D(),
    vit,
    sau: new Caterpillar2D(),
    ga: new Critter2D('hen'),
    cho,
    meo,
    meadow,
    cam: new Camera2D(),
    texts: new Texts(),
    bubbles,
    fx: new ConVatCungFx(),
    cues,
  };
}
