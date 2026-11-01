import type { Cloud } from '../characters/Cloud';
import type { Mochi } from '../characters/Mochi';
import type { CameraRig } from '../core/CameraRig';
import type { Timeline } from '../core/Timeline';
import type { TitleCard } from '../props/TitleCard';

/** Everything a scene may animate. */
export interface Cast {
  mochi: Mochi;
  cloud: Cloud;
  title: TitleCard;
  cam: CameraRig;
}

/**
 * One scene of the script. `build` adds keyframes / hooks to the shared
 * timeline using ABSOLUTE film times, matching the tables in docs/script.md.
 */
export interface FilmScene {
  id: string;
  title: string;
  start: number;
  end: number;
  build(tl: Timeline, cast: Cast): void;
}
