import * as THREE from 'three';

/**
 * Animatable camera: keyframe `position.x/y/z`, `target.x/y/z`, `fov` and
 * `roll` on the rig, then `update()` pushes them into the real camera.
 * Use ease 'step' on keys for hard cuts between shots.
 */
export class CameraRig {
  readonly position = new THREE.Vector3(0, 4, 14);
  readonly target = new THREE.Vector3(0, 1, 0);
  fov = 40;
  roll = 0;
  /** Small handheld-style shake amount (0 = locked off). */
  shake = 0;

  constructor(readonly camera: THREE.PerspectiveCamera) {}

  update(t: number) {
    const c = this.camera;
    c.position.copy(this.position);
    if (this.shake > 0) {
      c.position.x += Math.sin(t * 37.1) * this.shake;
      c.position.y += Math.sin(t * 29.3 + 1.3) * this.shake;
    }
    c.up.set(Math.sin(this.roll), Math.cos(this.roll), 0);
    c.lookAt(this.target);
    if (c.fov !== this.fov) {
      c.fov = this.fov;
      c.updateProjectionMatrix();
    }
  }
}
