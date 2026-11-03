// Cast of "Táo bón" (docs/episodes/tao-bon.md): Vịt sick in bed, Táo feeding him porridge
// with a very long spoon, Sâu, and the three visitors Gà, Chó, Mèo (who misunderstand).
import type { Cue } from '../../audio/cues';
import { REELS_SAFE } from '../../config/film';
import type { FilmScene } from '../../film2d/boot';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Critter2D } from '../../film2d/characters/Critter2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import type { Pt } from '../../film2d/doodle/Sketch';
import { Bedroom2D } from '../../film2d/props/Bedroom2D';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { Texts } from '../../film2d/props/Texts';

export const SCALE = { tao: 0.45, vit: 0.95, sau: 1.0, critter: 0.72 } as const;

/** Where Vịt sits up in bed (his ball's bottom is under the blanket). */
export const VIT_BED = { x: -300, y: -150 } as const;

/** Spoon target: who the long spoon is pointing at (index into spoonTargets()). */
export const FEED = { vit: 0, ga: 1, cho: 2, meo: 3, sau: 4 } as const;

/** A little heart floating up (kindness beats). */
export interface Heart {
  t0: number;
  x: number;
  y: number;
}

export class TaoBonFx {
  /** 0 Vịt's bedroom, 1 the yard outside. */
  place = 0;
  /** 1 replaces the set by a comic "shock" burst backdrop (close-ups). */
  burst = 0;
  /** Burst colour scheme: 0 warm yellow, 1 pink alarm, 2 cool blue. */
  burstTone = 0;
  /** Bowl in Táo's left hand (1) and steam amount (0..1). */
  bowl = 0;
  steam = 1;
  /** Spoon in Táo's right hand: shown, how far it reaches 0..1, which target, with porridge. */
  spoon = 0;
  reach = 0;
  target = 0;
  full = 1;
  /** Vịt is sick: ice pack + thermometer. */
  sick = 1;
  thermo = 1;
  /** Gà's basket lying on the floor by the door. */
  dropped = 0;
  /** 1 shows the Reels safe-zone guides (preview only, ?safe). */
  guides = 0;
}

export interface TaoBonCast {
  tao: Apple2D;
  vit: Duckling2D;
  sau: Caterpillar2D;
  ga: Critter2D;
  cho: Critter2D;
  meo: Critter2D;
  room: Bedroom2D;
  meadow: Meadow2D;
  cam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: TaoBonFx;
  hearts: Heart[];
  cues: Cue[];
}

export type TaoBonScene = FilmScene<TaoBonCast>;

/** Mouth positions the spoon can point at, in FEED order. */
export function spoonTargets(cast: TaoBonCast): Pt[] {
  const { vit, ga, cho, meo, sau } = cast;
  return [
    [vit.x + 6, vit.y - 84 * vit.scale],
    ga.mouthWorld(),
    cho.mouthWorld(),
    meo.mouthWorld(),
    [sau.x + 10 * sau.scale * sau.flip, sau.y - 26 * sau.scale],
  ];
}

export function createTaoBonCast(cues: Cue[]): TaoBonCast {
  const vit = new Duckling2D();
  vit.round = 1;
  const bubbles = new Bubbles();
  bubbles.safe = { ...REELS_SAFE };
  return {
    tao: new Apple2D(),
    vit,
    sau: new Caterpillar2D(),
    ga: new Critter2D('hen'),
    cho: new Critter2D('dog'),
    meo: new Critter2D('cat'),
    room: new Bedroom2D(),
    meadow: new Meadow2D(),
    cam: new Camera2D(),
    texts: new Texts(),
    bubbles,
    fx: new TaoBonFx(),
    hearts: [],
    cues,
  };
}
