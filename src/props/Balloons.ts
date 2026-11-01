import * as THREE from 'three';
import { Mochi } from '../characters/Mochi';
import { clay, enableShadows } from '../core/materials';

const COLORS = ['#FFB3C6', '#BDE0FE', '#FFF1A8'];
/** Balloon centres relative to the cluster origin. */
export const BALLOON_OFFSETS = [
  new THREE.Vector3(0, 0.45, 0),
  new THREE.Vector3(-0.85, 0, 0.1),
  new THREE.Vector3(0.85, -0.05, -0.1),
];
/** Where the cluster sits above Mochi's root when Mochi holds the strings. */
export const HOLD_OFFSET = new THREE.Vector3(0, 3.4, 0.4);

const PARTICLES = 10;
const RADIUS = 0.55;

/**
 * A bunch of 3 pastel balloons. Keyframe `popA/popB/popC` from 0 to 1 over
 * ~0.5s to pop each one: a 2-frame swell, then a burst of confetti.
 * With `attached = 1` the cluster follows Mochi and the strings end at its mouth.
 */
export class Balloons {
  readonly root = new THREE.Group();
  private readonly balloons: THREE.Mesh[] = [];
  private readonly strings: THREE.Line[] = [];
  private readonly bursts: THREE.Group[] = [];

  x = -9;
  y = 3.4;
  z = 0;
  attached = 0;
  presence = 0;
  popA = 0;
  popB = 0;
  popC = 0;

  constructor(private readonly mochi: Mochi) {
    const stringMat = new THREE.LineBasicMaterial({ color: '#8d7b96' });
    COLORS.forEach((color, i) => {
      const mat = clay(color, { roughness: 0.35 });
      const b = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 32, 24), mat);
      b.scale.y = 1.18;
      b.position.copy(BALLOON_OFFSETS[i]);
      const knot = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 8), mat);
      knot.position.y = -RADIUS - 0.02;
      knot.scale.y = 1 / 1.18;
      b.add(knot);
      this.root.add(b);
      this.balloons.push(b);

      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geo, stringMat);
      line.frustumCulled = false;
      this.root.add(line);
      this.strings.push(line);

      // Deterministic burst directions (golden-angle spiral on a sphere).
      const burst = new THREE.Group();
      for (let k = 0; k < PARTICLES; k++) {
        const y = 1 - (k / (PARTICLES - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const a = k * 2.39996;
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat);
        p.userData.dir = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
        burst.add(p);
      }
      burst.position.copy(BALLOON_OFFSETS[i]);
      this.root.add(burst);
      this.bursts.push(burst);
    });
    enableShadows(this.root, true, false);
  }

  private readonly tmp = new THREE.Vector3();

  /** Call AFTER mochi.update(t) so the strings follow Mochi's latest pose. */
  update() {
    const m = this.mochi;
    if (this.attached > 0.5) {
      this.root.position.set(m.x, m.y, m.z).add(HOLD_OFFSET);
    } else {
      this.root.position.set(this.x, this.y, this.z);
    }
    const p = Math.max(this.presence, 0.0001);
    this.root.visible = this.presence > 0.001;
    this.root.scale.setScalar(p);
    this.root.updateMatrixWorld();

    // String end: Mochi's mouth when attached, otherwise dangling below.
    let anchor: THREE.Vector3 | undefined;
    if (this.attached > 0.5) {
      m.root.updateMatrixWorld();
      anchor = this.root.worldToLocal(m.root.localToWorld(this.tmp.copy(Mochi.MOUTH)));
    }

    const pops = [this.popA, this.popB, this.popC];
    pops.forEach((pop, i) => {
      const balloon = this.balloons[i];
      const swell = pop > 0 && pop < 0.07;
      balloon.visible = pop < 0.07;
      balloon.scale.set(swell ? 1.2 : 1, swell ? 1.18 * 1.2 : 1.18, swell ? 1.2 : 1);

      const string = this.strings[i];
      string.visible = pop < 0.07;
      const pos = string.geometry.attributes.position as THREE.BufferAttribute;
      const top = BALLOON_OFFSETS[i];
      pos.setXYZ(0, top.x, top.y - RADIUS * 1.18 - 0.05, top.z);
      const end = anchor ?? new THREE.Vector3(top.x * 0.3, -2.6, top.z);
      pos.setXYZ(1, end.x, end.y, end.z);
      pos.needsUpdate = true;

      const burst = this.bursts[i];
      burst.visible = pop >= 0.07 && pop < 1;
      if (burst.visible) {
        const k = (pop - 0.07) / 0.93;
        const dist = 0.4 + (1 - Math.pow(1 - k, 3)) * 1.6;
        for (const child of burst.children) {
          child.position.copy(child.userData.dir).multiplyScalar(dist);
          child.position.y -= k * k * 0.8; // a little gravity
          child.scale.setScalar(1 - k);
        }
      }
    });
  }
}
