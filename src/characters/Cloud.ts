import * as THREE from 'three';
import { PALETTE } from '../config/film';
import { clay, enableShadows } from '../core/materials';

/** Bé Mây: a cluster of white puffs with bean eyes that bobs gently. */
export class Cloud {
  readonly root = new THREE.Group();
  private readonly puffs = new THREE.Group();

  x = 0;
  y = 6;
  z = 0;
  /** Facing angle around Y (radians); PI faces away from the default camera. */
  turn = 0;
  /** Bobbing amplitude (world units). */
  bob = 0.15;
  /** Squash for when Mochi lands on it (Y scale). */
  squash = 1;
  /** Visibility 0..1 via scale pop; 0 hides the cloud. */
  presence = 1;

  constructor() {
    this.root.add(this.puffs);
    const body = clay(PALETTE.cloud, { emissive: PALETTE.cloudShade, emissiveIntensity: 0.45 });
    const layout: [number, number, number, number][] = [
      [0, 0, 0, 1],
      [-0.95, -0.15, 0.1, 0.7],
      [0.95, -0.1, 0.05, 0.75],
      [-0.45, 0.45, -0.1, 0.65],
      [0.5, 0.5, -0.15, 0.6],
      [0, -0.3, 0.45, 0.6],
    ];
    for (const [x, y, z, r] of layout) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), body);
      puff.position.set(x, y, z);
      this.puffs.add(puff);
    }
    const eyeMat = new THREE.MeshStandardMaterial({ color: PALETTE.eye, roughness: 0.3 });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), eyeMat);
      eye.scale.y = 1.5;
      eye.position.set(side * 0.28, 0.1, 0.98);
      this.puffs.add(eye);
    }
    enableShadows(this.puffs, true, false);
  }

  update(t: number) {
    this.root.position.set(this.x, this.y + Math.sin(t * 1.6) * this.bob, this.z);
    this.root.rotation.y = this.turn;
    const p = Math.max(this.presence, 0.0001);
    const s = Math.max(this.squash, 0.05);
    const w = 1 / Math.sqrt(s);
    this.puffs.scale.set(w * p, s * p, w * p);
    this.root.visible = this.presence > 0.001;
  }
}
