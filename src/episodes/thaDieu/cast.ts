// Cast of "Thả diều" (docs/episodes/tha-dieu.md): Táo, Vịt (round comic look), Sâu, a kite.
import type { Cue } from '../../audio/cues';
import type { FilmScene } from '../../film2d/boot';
import { Camera2D } from '../../film2d/Camera2D';
import { Apple2D } from '../../film2d/characters/Apple2D';
import { Caterpillar2D } from '../../film2d/characters/Caterpillar2D';
import { Duckling2D } from '../../film2d/characters/Duckling2D';
import { Bubbles } from '../../film2d/props/Bubbles';
import { Kite2D, Meadow2D, Wind2D } from '../../film2d/props/Meadow2D';
import { Texts } from '../../film2d/props/Texts';

export class KiteFx {
  fade = 0;
}

export interface KiteCast {
  tao: Apple2D;
  vit: Duckling2D;
  sau: Caterpillar2D;
  kite: Kite2D;
  meadow: Meadow2D;
  wind: Wind2D;
  cam: Camera2D;
  texts: Texts;
  bubbles: Bubbles;
  fx: KiteFx;
  cues: Cue[];
}

export type KiteScene = FilmScene<KiteCast>;

/** Where Táo and Sâu sit all episode (downwind, on the right). */
export const SPOT = { tao: 650, sau: 850 } as const;

export function createKiteCast(cues: Cue[]): KiteCast {
  const vit = new Duckling2D();
  vit.round = 1;
  return {
    tao: new Apple2D(),
    vit,
    sau: new Caterpillar2D(),
    kite: new Kite2D(),
    meadow: new Meadow2D(),
    wind: new Wind2D(),
    cam: new Camera2D(),
    texts: new Texts(),
    bubbles: new Bubbles(),
    fx: new KiteFx(),
    cues,
  };
}
