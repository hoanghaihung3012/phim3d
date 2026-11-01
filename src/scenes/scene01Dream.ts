import type { FilmScene } from './types';

/** Scene 1 - "Ước mơ" (0:00 - 0:14): Mochi lies on the hill dreaming, Bé Mây drifts by. */
export const scene01Dream: FilmScene = {
  id: 'scene01',
  title: 'Cảnh 1 · Ước mơ',
  start: 0,
  end: 14,
  build(tl, { mochi, cloud, title, cam }) {
    // --- Camera ----------------------------------------------------------
    // 0-4: high wide shot, slow dolly down to the hill.
    // 4-9: medium shot at Mochi's height, gentle push in.
    // 9-12: over-the-shoulder from behind Mochi, looking up at the sky.
    // 12-14: cut back to the front for the sparkle-eyes beat.
    tl.key(cam.position, 'x', [[0, 0], [9, 0], [9, 1.6, 'step'], [12, 1.4], [12, 0, 'step']]);
    tl.key(cam.position, 'y', [[0, 20], [4, 3, 'inOutCubic'], [9, 2.2], [9, 1.1, 'step'], [12, 1.0], [12, 1.7, 'step']]);
    tl.key(cam.position, 'z', [[0, 34], [4, 11, 'inOutCubic'], [9, 8.5], [9, -4.4, 'step'], [12, -4.6], [12, 6.2, 'step'], [14, 5.6]]);
    tl.key(cam.target, 'x', [[0, 0], [9, 0], [9, -1.5, 'step'], [12, 1.5], [12, 0, 'step']]);
    tl.key(cam.target, 'y', [[0, 4], [4, 1, 'inOutCubic'], [9, 0.8], [9, 3.4, 'step'], [12, 4.4], [12, 1.3, 'step']]);
    tl.key(cam.target, 'z', [[0, 0], [9, 0], [9, 6, 'step'], [12, 6], [12, 0, 'step']]);

    // --- Title card --------------------------------------------------------
    tl.key(title, 'opacity', [[0.4, 0], [1.3, 1, 'outQuad'], [3.0, 1], [3.8, 0, 'inQuad']]);
    tl.key(title, 'scale', [[0.4, 0.8], [1.3, 1, 'outBack'], [3.8, 1.05]]);

    // --- Mochi: lying on its back, swaying to the music --------------------
    tl.key(mochi, 'squash', [
      [0, 0.75],
      [11.5, 0.75],
      [11.8, 0.55, 'outQuad'], // anticipation
      [11.95, 1.35, 'outQuad'], // pop up: stretch
      [12.3, 0.85, 'inQuad'], // land
      [12.6, 1, 'outBack'],
    ]);
    tl.key(mochi, 'tilt', [[0, -0.55], [11.8, -0.55], [11.95, 0, 'outQuad']]);
    tl.key(mochi, 'y', [[0, 0], [11.8, 0], [12.05, 0.7, 'outQuad'], [12.3, 0, 'inQuad']]);
    tl.key(mochi, 'sway', [[0, 0], [4, 0.12], [11.3, 0.12], [11.5, 0]]);
    tl.key(mochi, 'gaze', [[0, 0.8], [11.8, 0.8], [12.0, 0]]);
    tl.key(mochi, 'mouthOpen', [[4.9, 0], [5.1, 0.6], [5.6, 0], [6.9, 0], [7.1, 0.6], [7.6, 0]]);
    // Sparkle eyes when Mochi decides to fly.
    tl.key(mochi, 'eyeSize', [[0, 1], [12.0, 1], [12.15, 1.45, 'outBack'], [13.6, 1.4], [14, 1]]);

    // --- Bé Mây drifts past, waves, then rises ------------------------------
    tl.key(cloud, 'presence', [[0, 0], [8.8, 0], [9.2, 1, 'outBack']]);
    tl.key(cloud, 'x', [[0, -9], [9, -9], [12, 3, 'linear'], [14, 6]]);
    tl.key(cloud, 'y', [[0, 4.5], [11.5, 4.8], [14, 10, 'inQuad']]);
    tl.key(cloud, 'z', [[0, 6]]);
    // Face the over-the-shoulder camera (behind Mochi) while it is on screen.
    tl.key(cloud, 'turn', [[0, Math.PI], [12, Math.PI], [12, 0, 'step']]);
  },
};
