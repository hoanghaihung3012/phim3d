import * as THREE from 'three';
import { PALETTE } from '../config/film';
import { clay, enableShadows } from '../core/materials';

/** Sẻ Bông: a round yellow bird that flaps with sin(t), tilts its head and pecks. */
export class Sparrow {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly wings: THREE.Mesh[] = [];

  x = 8;
  y = 12;
  z = 0;
  /** Facing angle around Y (radians). 0 faces the camera (+z). */
  turn = 0;
  /** Wing-flap amount 0..1 (0 = wings folded). */
  flap = 1;
  /** Curious head tilt (radians). */
  headTilt = 0;
  /** 0..1 forward peck. */
  peck = 0;
  presence = 1;

  constructor() {
    this.root.add(this.body);
    const yellow = clay(PALETTE.sparrow);
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.35, 28, 20), yellow);
    torso.position.y = 0.35;
    this.body.add(torso);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 12), clay(PALETTE.beak));
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.36, 0.38);
    this.body.add(beak);

    const eyeMat = new THREE.MeshStandardMaterial({ color: PALETTE.eye, roughness: 0.3 });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), eyeMat);
      eye.position.set(side * 0.14, 0.46, 0.3);
      this.body.add(eye);

      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), yellow);
      wing.scale.set(1.2, 0.35, 0.8);
      wing.geometry.translate(side * 0.18, 0, 0); // hinge at the shoulder
      wing.position.set(side * 0.28, 0.4, -0.02);
      this.body.add(wing);
      this.wings.push(wing);
    }

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 10), yellow);
    tail.rotation.x = -Math.PI / 2.6;
    tail.position.set(0, 0.32, -0.36);
    this.body.add(tail);

    enableShadows(this.body, true, false);
  }

  update(t: number) {
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.y = this.turn;
    this.root.visible = this.presence > 0.001;
    this.root.scale.setScalar(Math.max(this.presence, 0.0001));
    this.body.rotation.set(this.peck * 0.7, 0, this.headTilt);
    const beat = Math.sin(t * 40) * this.flap;
    this.wings[0].rotation.z = 0.2 + beat * 0.9;
    this.wings[1].rotation.z = -0.2 - beat * 0.9;
  }
}
