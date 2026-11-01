import * as THREE from 'three';
import { PALETTE } from '../config/film';
import { clay, enableShadows } from '../core/materials';

const BODY_RADIUS = 1;

/**
 * Mochi, the hero: a pink sphere with volume-preserving squash & stretch.
 *
 * Every field below is a plain number so the Timeline can keyframe it:
 *   tl.key(mochi, 'squash', [[14, 1], [15.5, 0.5, 'outQuad']])
 * `update(t)` turns the numbers into transforms each frame.
 *
 * Hierarchy: root (position / rotation in the world)
 *              └─ body (pivot at the BOTTOM, receives squash scale)
 *                   └─ sphere, eyes, cheeks, ears, mouth
 */
export class Mochi {
  /** Point on Mochi's face (root space) where the mouth is, for things it bites/holds. */
  static readonly MOUTH = new THREE.Vector3(0, 1.0, 1.0);

  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly eyes: THREE.Group[] = [];
  private readonly mouth: THREE.Mesh;

  // ---- animatable state -------------------------------------------------
  x = 0;
  y = 0;
  z = 0;
  /** Facing angle around Y (radians). */
  turn = 0;
  /** Sideways lean (radians), e.g. pendulum swing under balloons. */
  lean = 0;
  /** Amplitude (radians) of a side-to-side sway added to `lean`, ~1 sway per second. */
  sway = 0;
  /** Forward tilt (radians); negative leans back to look up. */
  tilt = 0;
  /** Scale on Y. 1 = round, <1 squash, >1 stretch. X/Z compensate to keep volume. */
  squash = 1;
  /** Extra horizontal squash on X only (e.g. "face flattened by a plank"). */
  flatX = 1;
  /** Fast vibration amplitude (anticipation shake). */
  shake = 0;
  /** 1 = eyes open, 0 = closed. Multiplied with the automatic blink. */
  eyeOpen = 1;
  /** Eye size multiplier (1.4 = surprised). */
  eyeSize = 1;
  /** Vertical gaze offset: positive looks up. */
  gaze = 0;
  /** 0 = mouth closed, 1 = wide open. */
  mouthOpen = 0;
  /** Turn automatic blinking on (1) or off (0). */
  autoBlink = 1;
  /** 1 = hanging from the top (balloon string): lean/sway pivots at the top, not the bottom. */
  hang = 0;

  constructor() {
    this.root.add(this.body);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(BODY_RADIUS, 48, 32), clay(PALETTE.mochi));
    // Pivot at the bottom: squashing flattens Mochi onto the ground, not into its centre.
    sphere.position.y = BODY_RADIUS;
    this.body.add(sphere);

    // Ears / little tufts on top.
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), clay(PALETTE.mochi));
      ear.scale.set(1, 0.6, 0.8);
      ear.position.set(side * 0.45, 1.85, -0.05);
      ear.rotation.z = -side * 0.5;
      this.body.add(ear);
    }

    // Eyes: black bead + white highlight, grouped so we can scale them for blinks.
    const eyeMat = new THREE.MeshStandardMaterial({ color: PALETTE.eye, roughness: 0.3 });
    const shineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    for (const side of [-1, 1]) {
      const eye = new THREE.Group();
      placeOnSphere(eye, side * 0.33, 1.22);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), eyeMat);
      bead.scale.z = 0.6;
      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), shineMat);
      shine.position.set(0.035, 0.04, 0.06);
      eye.add(bead, shine);
      this.body.add(eye);
      this.eyes.push(eye);
    }

    // Blush cheeks.
    const cheekMat = new THREE.MeshBasicMaterial({
      color: PALETTE.mochiCheek,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    for (const side of [-1, 1]) {
      const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), cheekMat);
      placeOnSphere(cheek, side * 0.6, 1.0, 1.005);
      cheek.scale.y = 0.65;
      this.body.add(cheek);
    }

    // Mouth: a tiny dark ellipse that grows when open.
    this.mouth = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 20),
      new THREE.MeshBasicMaterial({ color: '#8a3b4f' }),
    );
    placeOnSphere(this.mouth, 0, 1.02, 1.006);
    this.body.add(this.mouth);

    enableShadows(this.body, true, false);
  }

  update(t: number) {
    const shakeX = this.shake * Math.sin(t * 90);
    const shakeZ = this.shake * Math.sin(t * 73 + 1.7);
    this.root.position.set(this.x + shakeX, this.y, this.z + shakeZ);
    const lean = this.lean + Math.sin(t * Math.PI) * this.sway;
    this.root.rotation.set(this.tilt, this.turn, lean, 'YXZ');
    if (this.hang > 0) {
      // Pivot at the top of the head (y = 2): shift so that point stays put while leaning.
      const top = 2 * BODY_RADIUS;
      this.root.position.x += this.hang * top * Math.sin(lean);
      this.root.position.y += this.hang * top * (1 - Math.cos(lean));
    }

    // Volume-preserving squash: Y = s, X = Z = 1/sqrt(s).
    const s = Math.max(this.squash, 0.05);
    const w = 1 / Math.sqrt(s);
    this.body.scale.set(w * this.flatX, s, w / this.flatX);

    // Deterministic auto-blink (pure function of t, so seeking is stable).
    const blink = this.autoBlink > 0.5 ? blinkCurve(t) : 1;
    const open = Math.max(0.08, this.eyeOpen * blink);
    for (const eye of this.eyes) {
      eye.scale.set(this.eyeSize, this.eyeSize * open, this.eyeSize);
      eye.position.y = eye.userData.baseY + this.gaze * 0.12;
    }

    const m = this.mouthOpen;
    this.mouth.scale.set(0.6 + m * 0.8, 0.25 + m * 1.6, 1);
  }
}

/** Put an object on the sphere surface at (x, y) and face it outward. */
function placeOnSphere(obj: THREE.Object3D, x: number, y: number, radiusScale = 1) {
  const cy = BODY_RADIUS;
  const dy = y - cy;
  const z = Math.sqrt(Math.max(BODY_RADIUS * BODY_RADIUS - x * x - dy * dy, 0));
  const normal = new THREE.Vector3(x, dy, z).normalize();
  obj.position.copy(normal).multiplyScalar(BODY_RADIUS * radiusScale);
  obj.position.y += cy;
  obj.lookAt(obj.position.clone().add(normal));
  obj.userData.baseY = obj.position.y;
}

/** 1 most of the time, dips to 0 for ~0.12s every ~3.4s with slight irregularity. */
function blinkCurve(t: number): number {
  const period = 3.4;
  const phase = (t + Math.sin(Math.floor(t / period) * 12.9898) * 0.6) % period;
  const d = Math.abs(phase - 0.06);
  return d < 0.06 ? d / 0.06 : 1;
}
