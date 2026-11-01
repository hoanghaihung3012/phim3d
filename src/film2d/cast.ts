import { Apple2D } from './characters/Apple2D';
import { Cloud2D } from './characters/Cloud2D';
import { Sparrow2D } from './characters/Sparrow2D';
import { Camera2D } from './Camera2D';
import type { Keyer } from './Keyer';
import { Balloons2D } from './props/Balloons2D';
import { Ground2D } from './props/Ground2D';
import { Seesaw2D } from './props/Seesaw2D';
import { Sky2D } from './props/Sky2D';
import { Texts } from './props/Texts';
import { Tree2D } from './props/Tree2D';

/** Frame-wide effects. */
export class FilmFx {
  /** 0..1 fade to black. */
  fade = 0;
}

export interface Cast2D {
  apple: Apple2D;
  cloud: Cloud2D;
  sparrow: Sparrow2D;
  balloons: Balloons2D;
  tree: Tree2D;
  ground: Ground2D;
  sky: Sky2D;
  seesaw: Seesaw2D;
  cam: Camera2D;
  texts: Texts;
  fx: FilmFx;
}

export function createCast(): Cast2D {
  const apple = new Apple2D();
  const balloons = new Balloons2D();
  balloons.apple = apple;
  const sparrow = new Sparrow2D();
  sparrow.balloons = balloons;
  return {
    apple,
    cloud: new Cloud2D(),
    sparrow,
    balloons,
    tree: new Tree2D(),
    ground: new Ground2D(),
    sky: new Sky2D(),
    seesaw: new Seesaw2D(),
    cam: new Camera2D(),
    texts: new Texts(),
    fx: new FilmFx(),
  };
}

/** One scene of docs/script.md, built with absolute film times. */
export interface Scene2D {
  id: string;
  title: string;
  start: number;
  end: number;
  build(k: Keyer, cast: Cast2D): void;
}
