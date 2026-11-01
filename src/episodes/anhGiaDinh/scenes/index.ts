import type { EpisodeScene } from '../cast';
import { scene01Setup } from './scene01Setup';
import { scene02Takes } from './scene02Takes';
import { scene03Smile } from './scene03Smile';
import { scene04Idea } from './scene04Idea';
import { scene05Review } from './scene05Review';

/** Scenes in film order (they must be built in time order: Keyer remembers latest values). */
export const SCENES: EpisodeScene[] = [scene01Setup, scene02Takes, scene03Smile, scene04Idea, scene05Review];
