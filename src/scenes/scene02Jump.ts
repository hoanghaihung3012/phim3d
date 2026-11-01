import type { FilmScene } from './types';

/**
 * Scene 2 - "Thử lần 1: Nhảy" (0:14 - 0:30). The vertical slice:
 * long anticipation -> fast launch -> cartoon hold at the top -> fall -> pancake -> re-inflate.
 */
export const scene02Jump: FilmScene = {
  id: 'scene02',
  title: 'Cảnh 2 · Thử lần 1: Nhảy',
  start: 14,
  end: 30,
  build(tl, { mochi, cloud, cam }) {
    // Beat times (seconds) - tweak timing here, everything below follows.
    const CHARGE = 14.5; // start squashing down
    const LAUNCH = 18.0; // "Boing!"
    const APEX = 18.5;
    const FALL = 20.4; // the hold ends, gravity remembers Mochi
    const IMPACT = 21.0; // "Bẹp!"
    const INFLATE = 25.0; // "phù~"

    // Bé Mây is gone (up in the sky) for this scene.
    tl.key(cloud, 'presence', [[14, 1], [14.01, 0, 'step']]);

    // --- Camera: static medium wide, tilts up with the jump, close-up at the end.
    tl.key(cam.position, 'x', [[14, 0, 'step']]);
    tl.key(cam.position, 'y', [[14, 2.2, 'step'], [LAUNCH, 2.2], [APEX, 3.4, 'outQuad'], [FALL, 3.4], [IMPACT, 2.2, 'inQuad'], [INFLATE, 2.2], [INFLATE, 1.1, 'step']]);
    tl.key(cam.position, 'z', [[14, 10, 'step'], [INFLATE, 10], [INFLATE, 4.4, 'step'], [30, 4.0]]);
    tl.key(cam.target, 'x', [[14, 0, 'step']]);
    tl.key(cam.target, 'y', [[14, 1.1, 'step'], [LAUNCH, 1.1], [APEX, 3.6, 'outQuad'], [FALL, 3.6], [IMPACT, 1.0, 'inQuad'], [INFLATE, 1.0], [INFLATE, 0.5, 'step'], [26.5, 1.0, 'outQuad']]);
    tl.key(cam.target, 'z', [[14, 0, 'step']]);

    // --- Mochi body ------------------------------------------------------
    tl.key(mochi, 'squash', [
      [CHARGE, 1],
      [CHARGE + 0.8, 0.5, 'outQuad'], // deep squash, held for a long, shaky anticipation
      [LAUNCH, 0.5],
      [LAUNCH + 0.12, 1.5, 'outQuad'], // stretch on launch
      [APEX, 1, 'outQuad'],
      [FALL, 1],
      [IMPACT, 1.3, 'inQuad'], // stretch while falling
      [IMPACT + 0.06, 0.3, 'outQuad'], // pancake!
      [IMPACT + 0.22, 0.55], // flying pancake on the bounces
      [IMPACT + 0.45, 0.3],
      [IMPACT + 0.62, 0.38],
      [IMPACT + 0.8, 0.3],
      [INFLATE, 0.3],
      [INFLATE + 1.5, 1, 'outElastic'], // puffs back up like a steamed bun
    ]);
    tl.key(mochi, 'y', [
      [LAUNCH, 0],
      [APEX, 2.2, 'outQuad'],
      [FALL, 2.2],
      [IMPACT, 0, 'inQuad'],
      [IMPACT + 0.22, 0.45, 'outQuad'],
      [IMPACT + 0.45, 0, 'inQuad'],
      [IMPACT + 0.62, 0.18, 'outQuad'],
      [IMPACT + 0.8, 0, 'inQuad'],
    ]);
    tl.key(mochi, 'shake', [[CHARGE + 0.8, 0], [CHARGE + 1.2, 0.03], [LAUNCH - 0.15, 0.08, 'inQuad'], [LAUNCH, 0, 'step']]);

    // --- Face --------------------------------------------------------------
    tl.key(mochi, 'eyeOpen', [
      [CHARGE, 1],
      [CHARGE + 0.6, 0.35], // squinting effort
      [LAUNCH, 0.35],
      [LAUNCH + 0.1, 1],
      [IMPACT, 1],
      [IMPACT + 0.05, 0.12, 'step'], // dizzy, eyes squeezed
      [24.6, 0.12],
      [24.9, 1],
      [28.0, 1],
      [28.3, 0.65], // determined squint
      [30, 0.65],
    ]);
    tl.key(mochi, 'eyeSize', [[LAUNCH, 1], [APEX + 0.1, 1.45, 'outBack'], [FALL, 1.45], [IMPACT, 1], [28.0, 1], [28.3, 1.15]]);
    tl.key(mochi, 'gaze', [[APEX, 0], [APEX + 0.3, -1], [FALL, -1], [IMPACT, 0]]);
    tl.key(mochi, 'mouthOpen', [[CHARGE, 0], [CHARGE + 0.6, 0.35], [LAUNCH, 0.35], [LAUNCH + 0.2, 0.9], [APEX, 0], [FALL, 0], [FALL + 0.2, 1], [IMPACT, 0.4], [IMPACT + 0.3, 0]]);
    // Auto-blink off during the hold so the two deliberate blinks read clearly.
    tl.key(mochi, 'autoBlink', [[APEX, 1], [APEX, 0, 'step'], [IMPACT, 0], [IMPACT, 1, 'step']]);
    // Two slow blinks at the camera during the hold (the gag).
    // (eyeOpen is already 1 here; blink is layered with a separate quick dip.)
    tl.key(mochi, 'eyeOpen', [[19.2, 1], [19.32, 0.08], [19.44, 1], [19.75, 1], [19.87, 0.08], [19.99, 1]]);

    // Head shake after re-inflating, then determination.
    tl.key(mochi, 'turn', [[27.0, 0], [27.15, 0.35], [27.35, -0.35], [27.55, 0.3], [27.75, 0]]);
  },
};
