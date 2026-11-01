import type { Cue } from '../audio/cues';
import { FACE } from '../characters/appleFaces';
import { steppedKeys } from '../core/keys';
import type { FilmScene } from '../scenes/types';

/**
 * Character test reel for Táo Lém (~20s): every face, leaf and stem acting,
 * the legs gag, a jump with a "cộp" landing, and a turnaround.
 * Used to sign off the character design before re-blocking the film.
 */
export const appleTestScene: FilmScene = {
  id: 'apple-test',
  title: 'Thử vai · Táo Lém',
  start: 0,
  end: 20,
  build(tl, { apple, mochi, title, cam }) {
    tl.key(mochi, 'presence', [[0, 0]]);
    tl.key(apple, 'presence', [[0, 1]]);

    // Camera: medium shot, cuts to a close-up for the reaction beats.
    const MED = { px: 0, py: 1.7, pz: 6.5, ty: 1.0 };
    const CU = { px: 0, py: 1.3, pz: 3.6, ty: 1.0 };
    const shots: [number, typeof MED][] = [[0, MED], [5.8, CU], [8.6, MED], [11.6, CU], [14.4, MED]];
    tl.key(cam.position, 'x', shots.map(([t, s]) => [t, s.px, 'step']));
    tl.key(cam.position, 'y', shots.map(([t, s]) => [t, s.py, 'step']));
    tl.key(cam.position, 'z', shots.map(([t, s]) => [t, s.pz, 'step']));
    tl.key(cam.target, 'x', [[0, 0]]);
    tl.key(cam.target, 'y', shots.map(([t, s]) => [t, s.ty, 'step']));
    tl.key(cam.target, 'z', [[0, 0]]);

    tl.key(title, 'opacity', [[0.2, 0], [0.8, 1, 'outQuad'], [2.2, 1], [2.7, 0]]);
    tl.key(title, 'scale', [[0.2, 0.8], [0.8, 1, 'outBack']]);

    // Faces swap instantly, never blend.
    tl.key(apple, 'face', [
      [0, FACE.bored],
      [4.5, FACE.shock, 'step'],
      [5.8, FACE.side_eye, 'step'],
      [7.2, FACE.smug, 'step'],
      [8.6, FACE.bored, 'step'],
      [13.2, FACE.side_eye, 'step'],
      [14.4, FACE.happy, 'step'],
      [16, FACE.bored, 'step'],
    ]);

    // Sigh: leaf droops, body deflates a touch. Startle: leaf stands up.
    tl.key(apple, 'leafPose', [[0, 0], [2.8, 0], [3.4, -1], [4.5, -1], [4.5, 1, 'step'], [5.8, 1], [6.1, 0], [14.4, 0], [14.4, 1, 'step'], [15.2, 0.3]]);
    tl.key(apple, 'squash', [
      [2.8, 1], [3.2, 0.95], [3.8, 1],
      [11.0, 1], [11.02, 0.9, 'step'], [11.15, 1, 'step'], // "cộp": tiny squash, then rigid
    ]);
    tl.key(apple, 'sway', [[0, 0.05], [4.4, 0.05], [4.5, 0, 'step']]);
    tl.key(apple, 'twitch', [[7.2, 0], [7.2, 1, 'step'], [8.4, 1], [8.4, 0, 'step']]);

    // Startle hop and the jump, both "on twos" at 12 fps.
    tl.key(apple, 'y', [
      ...steppedKeys(4.5, 4.62, 0, 0.25, 'outQuad'),
      ...steppedKeys(4.62, 4.78, 0.25, 0, 'inQuad'),
      ...steppedKeys(10.6, 10.8, 0, 0.3, 'outQuad'),
      ...steppedKeys(10.8, 11.0, 0.3, 0, 'inQuad'),
    ]);

    // Legs pop out (no transition), back up, run, jump ~30cm, land, legs pop back in.
    tl.key(apple, 'legsOut', [[9.0, 0], [9.0, 1, 'step'], [12.3, 1], [12.3, 0, 'step']]);
    tl.key(apple, 'run', [[9.0, 0], [9.2, 0.6, 'step'], [9.7, 0.6], [9.8, 1, 'step'], [10.6, 1], [10.6, 0, 'step']]);
    tl.key(apple, 'x', [[9.2, 0], [9.7, -1.0], [10.6, 0.6, 'linear'], [11.0, 0.8, 'outQuad']]);

    // Turnaround to show the stem, leaf and outline from every side.
    tl.key(apple, 'turn', [[16, 0], [19.5, Math.PI * 2, 'inOutSine']]);
  },
};

export const APPLE_TEST_CUES: Cue[] = [
  { id: 'sfx_haizz', t: 2.8, duration: 1.0, volume: 0.6 },
  { id: 'sfx_hu', t: 4.5, volume: 0.7 },
  { id: 'sfx_steps', t: 9.2, duration: 0.5, volume: 0.5 },
  { id: 'sfx_steps', t: 9.8, duration: 0.8, volume: 0.7 },
  { id: 'sfx_cop', t: 11.0, volume: 0.9 },
  { id: 'sfx_o', t: 13.2, volume: 0.8 },
  { id: 'sfx_chime', t: 14.4, volume: 0.4 },
];
