import type { Camera2D } from '../Camera2D';
import type { Keyer } from '../Keyer';

/** Hard cut: the camera jumps to a new framing at t. */
export function cut(k: Keyer, t: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  k.set(t, cam, { x, y, zoom, rot: 0 });
}

/** Camera move between two framings. */
export function pan(k: Keyer, t0: number, t1: number, cam: Camera2D, x: number, y: number, zoom: number): void {
  k.to(t0, t1, cam, { x, y, zoom });
}

/** A short shake (e.g. on an impact), amplitude in px. */
export function shake(k: Keyer, t: number, cam: Camera2D, px = 12, dur = 0.3): void {
  k.set(t, cam, { shake: px }).set(t + dur, cam, { shake: 0 });
}

/** Ground y of the world. */
export const GROUND = 0;
export const TREE_X = 0;
