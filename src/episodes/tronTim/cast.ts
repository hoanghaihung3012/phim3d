// Cast of "Trốn tìm" (docs/episodes/tron-tim.md): Táo hiding among the apples of a tree,
// Vịt looking for him, Sâu, and the ten ordinary apples that end up on Vịt.
import type { Cue } from '../../audio/cues';
import { REELS_SAFE } from '../../config/film';
import type { FilmScene } from '../../film2d/boot';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { AppleTree2D, Bush2D } from '../../film2d/props/AppleTree2D';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Meadow2D } from '../../film2d/props/Meadow2D';
import { Texts } from '../../film2d/props/Texts';

/** Size of every apple on the tree, Táo included (so he blends in). */
export const APPLE_SCALE = 0.28;

/** Where things stand (world units, ground y = 0). */
export const SPOT = { tree: 60, bush: -390, sau: 165, vitTrunk: -62 } as const;

/** Táo's place on the tree (feet = bottom of the apple). */
export const TAO_SLOT = { x: -130, y: -740 } as const;

/**
 * The ordinary apples: where each hangs on the tree, where it ends up on the ground, and
 * whether it lands in front of Vịt (front) or behind him. Indices 0-2 hit Vịt's head first.
 */
export const APPLES: { slot: [number, number]; pile: [number, number]; front: boolean }[] = [
  { slot: [-40, -560], pile: [-392, 6], front: true }, // bonk 1, bounces left
  { slot: [150, -560], pile: [278, 8], front: true }, // bonk 2, bounces right (Sâu eats it)
  { slot: [60, -740], pile: [SPOT.vitTrunk - 4, -168], front: true }, // bonk 3, stays on his head
  { slot: [-220, -560], pile: [-312, 10], front: true },
  { slot: [330, -560], pile: [-187, 12], front: true },
  { slot: [-310, -740], pile: [-62, 14], front: true },
  { slot: [250, -740], pile: [63, 12], front: true },
  { slot: [-200, -920], pile: [188, 10], front: true },
  { slot: [0, -920], pile: [-252, -78], front: false },
  { slot: [190, -920], pile: [128, -80], front: false },
];

export class TronTimFx {
  /** 1 shows the Reels safe-zone guides (preview only, ?safe). */
  guides = 0;
}

export interface TronTimCast {
  tao: Apple2D;
  apples: Apple2D[];
  vit: Duckling2D;
  sau: Caterpillar2D;
  tree: AppleTree2D;
  bush: Bush2D;
  meadow: Meadow2D;
  cam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: TronTimFx;
  cues: Cue[];
}

export type TronTimScene = FilmScene<TronTimCast>;

export function createTronTimCast(cues: Cue[]): TronTimCast {
  const vit = new Duckling2D();
  vit.round = 1;
  const bubbles = new Bubbles();
  bubbles.safe = { ...REELS_SAFE };
  const tree = new AppleTree2D();
  tree.x = SPOT.tree;
  const bush = new Bush2D();
  bush.x = SPOT.bush;
  bush.scale = 0.85;
  return {
    tao: new Apple2D(),
    apples: APPLES.map(() => new Apple2D()),
    vit,
    sau: new Caterpillar2D(),
    tree,
    bush,
    meadow: new Meadow2D(),
    cam: new Camera2D(),
    texts: new Texts(),
    bubbles,
    fx: new TronTimFx(),
    cues,
  };
}
