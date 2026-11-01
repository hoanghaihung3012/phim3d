import { HOLD_OFFSET } from '../props/Balloons';
import type { FilmScene } from './types';

/**
 * Scene 3 - "Thử lần 2: Bóng bay" (0:30 - 0:52).
 * Balloons drift in, Mochi bites the strings and floats up, Sẻ Bông lands and
 * pecks, three pops (each quieter), cartoon hold, then a whistle-fall off screen.
 */
export const scene03Balloons: FilmScene = {
  id: 'scene03',
  title: 'Cảnh 3 · Thử lần 2: Bóng bay',
  start: 30,
  end: 52,
  build(tl, { mochi, balloons, sparrow, cam }) {
    const GRAB = 33.5; // Mochi bites the strings
    const RISE = 35; // starts floating up
    const TOP = 42; // reaches the top
    const HEIGHT = 9; // how high Mochi floats
    const POP = [46.0, 46.3, 46.6];
    const FALL = 48.7; // the hold ends
    const LAND = 49.5; // off-screen "BẸP"

    // Top of balloon A, where the sparrow perches (cluster offsets + radius).
    const perch = { x: HOLD_OFFSET.x, y: HEIGHT + HOLD_OFFSET.y + 0.45 + 0.55 * 1.18, z: HOLD_OFFSET.z };

    // --- Camera ------------------------------------------------------------
    // 30-35 medium shot; 35-42 low angle following up; 42-45.5 medium at height;
    // 45.5-48 close-up on the balloons; 48-52 wide (Mochi drops out of frame).
    tl.key(cam.position, 'x', [[30, 0, 'step'], [RISE, 2.5, 'step'], [TOP, 0, 'step'], [45.5, 0.8, 'step'], [48, 0, 'step']]);
    tl.key(cam.position, 'y', [
      [30, 1.8, 'step'],
      [RISE, 0.4, 'step'],
      [TOP, 0.4 + HEIGHT * 0.85, 'inOutSine'],
      [TOP, 11.8, 'step'],
      [45.5, 12.9, 'step'],
      [48, 11, 'step'],
    ]);
    tl.key(cam.position, 'z', [[30, 9, 'step'], [RISE, 7, 'step'], [TOP, 9, 'step'], [45.5, 5.2, 'step'], [48, 12, 'step']]);
    tl.key(cam.target, 'x', [[30, -1.2, 'step'], [32.5, 0], [RISE, 0, 'step'], [TOP, 0, 'step'], [45.5, 0, 'step'], [48, 0, 'step']]);
    tl.key(cam.target, 'y', [
      [30, 1.8, 'step'],
      [RISE, 2.5, 'step'],
      [TOP, HEIGHT + 2.5, 'inOutSine'],
      [TOP, 11.4, 'step'],
      [45.5, 12.7, 'step'],
      [48, 11.2, 'step'],
    ]);
    tl.key(cam.target, 'z', [[30, 0, 'step'], [45.5, 0.4, 'step'], [48, 0, 'step']]);

    // --- Balloons drift in from the left, then follow Mochi -------------------
    tl.key(balloons, 'presence', [[30.3, 0], [30.7, 1, 'outBack']]);
    tl.key(balloons, 'x', [[30.3, -7], [GRAB - 0.1, 0, 'outQuad']]);
    tl.key(balloons, 'y', [[30.3, 4.2], [31.8, 3.7], [GRAB - 0.1, HOLD_OFFSET.y, 'inOutSine']]);
    tl.key(balloons, 'z', [[30.3, HOLD_OFFSET.z]]);
    tl.key(balloons, 'attached', [[30, 0], [GRAB, 1, 'step']]);
    tl.key(balloons, 'popA', [[POP[0], 0], [POP[0] + 0.6, 1, 'linear']]);
    tl.key(balloons, 'popB', [[POP[1], 0], [POP[1] + 0.6, 1, 'linear']]);
    tl.key(balloons, 'popC', [[POP[2], 0], [POP[2] + 0.6, 1, 'linear']]);

    // --- Mochi -------------------------------------------------------------------
    // Reset leftovers from scene 2 (determined squint) and watch the balloons arrive.
    tl.key(mochi, 'eyeOpen', [[30, 0.65], [30.3, 1], [FALL - 0.5, 1], [FALL - 0.42, 0.08], [FALL - 0.3, 1]]);
    tl.key(mochi, 'eyeSize', [[30, 1.15], [30.3, 1], [30.8, 1.35, 'outBack'], [GRAB, 1.35], [GRAB + 0.4, 1], [44.6, 1], [44.8, 1.5, 'outBack'], [FALL, 1.5], [FALL + 0.3, 1]]);
    tl.key(mochi, 'turn', [
      [30.3, 0], [31, -0.5], [32.6, -0.5], [33.1, 0],
      // Frantic "no no no!" while the sparrow pecks.
      [44.8, 0], [44.92, 0.45], [45.04, -0.45], [45.16, 0.45], [45.28, -0.45], [45.4, 0.45], [45.52, -0.45], [45.64, 0.45], [45.76, -0.45], [45.9, 0],
    ]);
    tl.key(mochi, 'squash', [
      [30, 1], [32.9, 1], [33.15, 0.8, 'outQuad'], [33.35, 1.2, 'outQuad'], [GRAB + 0.2, 0.92], [GRAB + 0.5, 1, 'outBack'],
      [RISE, 1], [RISE + 1, 1.08], // hanging = slightly stretched
      [FALL, 1.08], [FALL + 0.3, 1.25], [LAND - 0.02, 1.3], [LAND + 0.06, 0.3, 'outQuad'], [51.2, 0.3], [52, 1, 'outBack'],
    ]);
    tl.key(mochi, 'y', [
      [30, 0], [33.15, 0], [33.35, 0.35, 'outQuad'], [GRAB + 0.15, 0, 'inQuad'],
      [RISE, 0], [TOP, HEIGHT, 'inOutSine'], [FALL, HEIGHT], [LAND, 0, 'inQuad'],
    ]);
    tl.key(mochi, 'hang', [[RISE - 0.01, 0], [RISE, 1, 'step'], [FALL, 1], [FALL + 0.01, 0, 'step']]);
    tl.key(mochi, 'sway', [[RISE, 0], [RISE + 1, 0.2], [TOP, 0.2], [TOP + 1.5, 0.06], [44.8, 0], [52, 0]]);
    tl.key(mochi, 'mouthOpen', [
      [30, 0], [33.1, 0], [33.3, 1], [GRAB, 0.15, 'outQuad'], // bites the strings
      [44.8, 0.15], [45, 0.9], [45.9, 0.9], [46.1, 0.15],
      [FALL, 0.15], [FALL + 0.2, 1], [LAND, 1], [LAND + 0.1, 0],
    ]);
    tl.key(mochi, 'autoBlink', [[46.6, 1], [46.6, 0, 'step'], [FALL, 0], [FALL, 1, 'step']]);
    tl.key(mochi, 'gaze', [[TOP, 0], [TOP + 1, 0.6], [44.6, 0.6], [44.8, 0.2], [47, 0.2], [47.3, 0]]);

    // --- Sẻ Bông -------------------------------------------------------------------
    tl.key(sparrow, 'presence', [[41.9, 0], [42, 1, 'step']]);
    tl.key(sparrow, 'x', [[42, 7], [44, perch.x, 'outQuad'], [50.2, perch.x], [51.8, -8, 'inQuad']]);
    tl.key(sparrow, 'y', [[42, perch.y + 1.2], [44, perch.y, 'outQuad'], [50.2, perch.y], [51.8, perch.y + 4, 'inQuad']]);
    tl.key(sparrow, 'z', [[42, perch.z]]);
    tl.key(sparrow, 'turn', [[42, -0.9], [43.8, -0.9], [44.2, 0], [50.1, 0], [50.4, -1.2]]);
    tl.key(sparrow, 'flap', [[42, 1], [43.9, 1], [44.1, 0, 'step'], [50.1, 0], [50.2, 1, 'step']]);
    tl.key(sparrow, 'headTilt', [[44.2, 0], [44.6, 0.4], [45.0, -0.3], [45.4, 0.35], [45.6, 0], [49.7, 0], [49.9, 0.5], [50.2, 0]]);
    tl.key(sparrow, 'peck', [[45.6, 0], [45.85, 1, 'inQuad'], [46.05, 0, 'outQuad']]);
  },
};
