import type { Scene2D } from '../cast';
import { scene01Hanging } from './scene01Hanging';
import { scene02Jump } from './scene02Jump';
import { scene03Balloons } from './scene03Balloons';
import { scene04Catapult } from './scene04Catapult';
import { scene05Friend } from './scene05Friend';
import { scene06Ending } from './scene06Ending';

/** Scenes in film order (they must be built in time order: Keyer remembers latest values). */
export const SCENES_2D: Scene2D[] = [scene01Hanging, scene02Jump, scene03Balloons, scene04Catapult, scene05Friend, scene06Ending];
