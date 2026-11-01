import * as THREE from 'three';
import { addOutline, toon } from '../core/toon';
import { APPLE_FACES, createFaceTextures } from './appleFaces';

export const APPLE_COLORS = {
  body: '#FF6B6B',
  shine: '#FFA8A8',
  stem: '#8B5A2B',
  leaf: '#7BD389',
  legs: '#FF6B6B',
} as const;

/** Apple silhouette: a sphere with dimples at top and bottom, a bit wider at the shoulders. */
function appleShape(v: THREE.Vector3) {
  const rho = Math.min(1, Math.hypot(v.x, v.z));
  const pole = Math.pow(1 - rho, 3);
  if (v.y > 0) v.y -= 0.42 * pole;
  else v.y += 0.18 * pole;
  const widen = 1 + 0.07 * v.y;
  v.x *= widen;
  v.z *= widen;
}

function deform(geo: THREE.BufferGeometry, scale = 1) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).divideScalar(scale);
    appleShape(v);
    v.multiplyScalar(scale);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Táo Lém: a deadpan apple. Toon-shaded with an ink outline, and a 2D marker
 * face on its surface that swaps instantly (keyframe `face` with 'step').
 * Acting happens through the face, the stem (twitch) and the leaf (droop/perk).
 *
 * Hierarchy: root (world position/rotation) → body (pivot at the bottom, squash)
 *            → apple mesh + face patch + stem + leaf; legs hang off root.
 */
export class Apple {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly faceMat: THREE.MeshBasicMaterial;
  private readonly faces: THREE.CanvasTexture[];
  private readonly stem = new THREE.Group();
  private readonly leaf = new THREE.Group();
  private readonly legs: THREE.Group[] = [];

  // ---- animatable state -------------------------------------------------
  x = 0;
  y = 0;
  z = 0;
  turn = 0;
  lean = 0;
  tilt = 0;
  /** Side-to-side sway amplitude (radians), ~1 swing per 2s. */
  sway = 0;
  /** Apples are hard: keep this between ~0.88 and 1.1. */
  squash = 1;
  /** Index into APPLE_FACES. Use ease 'step' so it swaps instantly. */
  face = 0;
  /** -1 = leaf drooping (sad), 0 = normal, 1 = standing straight up (startled). */
  leafPose = 0;
  /** Stem twitch amount 0..1 (annoyed). */
  twitch = 0;
  /** 0 = no legs, 1 = legs out (they pop, no transition). */
  legsOut = 0;
  /** 0..1 running cycle strength. */
  run = 0;
  /** Hidden unless a scene keys it (the Mochi film does not use the apple yet). */
  presence = 0;

  constructor() {
    this.root.add(this.body);

    // Body
    const geo = deform(new THREE.SphereGeometry(1, 64, 48));
    const apple = new THREE.Mesh(geo, toon(APPLE_COLORS.body));
    apple.position.y = 0.82; // bottom dimple sits on the ground
    apple.castShadow = true;
    addOutline(apple, 0.04);
    this.body.add(apple);

    // Little painted highlight.
    const shine = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 20),
      new THREE.MeshBasicMaterial({ color: APPLE_COLORS.shine, transparent: true, opacity: 0.9 }),
    );
    shine.scale.set(1, 0.6, 1);
    const n = new THREE.Vector3(-0.55, 0.45, 0.7).normalize();
    shine.position.copy(n).multiplyScalar(1.0);
    appleShape(shine.position);
    shine.position.multiplyScalar(1.004);
    shine.lookAt(shine.position.clone().add(n));
    shine.rotation.z += 0.6;
    apple.add(shine);

    // Face: a patch of the same apple surface (front, ~90° wide) with a canvas texture.
    this.faces = createFaceTextures();
    this.faceMat = new THREE.MeshBasicMaterial({
      map: this.faces[0],
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const faceGeo = deform(
      new THREE.SphereGeometry(1.006, 40, 30, Math.PI / 2 - 0.85, 1.7, Math.PI / 2 - 0.75, 1.3),
      1.006,
    );
    const facePatch = new THREE.Mesh(faceGeo, this.faceMat);
    apple.add(facePatch);

    // Stem: a thin curved tube rising from the top dimple.
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, 0.28, 0),
      new THREE.Vector3(0.16, 0.48, 0),
    );
    const stemMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.045, 8), toon(APPLE_COLORS.stem));
    addOutline(stemMesh, 0.02);
    this.stem.add(stemMesh);
    this.stem.position.set(0, 0.82 + 0.6, 0);
    this.body.add(this.stem);

    // Leaf: a teardrop shape, hinged at the stem.
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0.08, 0.32, 0.12, 0.5, 0);
    shape.bezierCurveTo(0.32, -0.12, 0.12, -0.08, 0, 0);
    const leafMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(shape, 12),
      toon(APPLE_COLORS.leaf, { side: THREE.DoubleSide }),
    );
    leafMesh.rotation.x = -0.3; // slight cup
    const leafOutline = new THREE.Mesh(
      new THREE.ShapeGeometry(shape, 12).scale(1.12, 1.35, 1).translate(-0.02, 0, -0.005),
      new THREE.MeshBasicMaterial({ color: '#1d1420', side: THREE.DoubleSide }),
    );
    leafMesh.add(leafOutline);
    this.leaf.add(leafMesh);
    this.leaf.position.set(0.04, 0.2, 0);
    this.stem.add(this.leaf);

    // Legs: two stubby capsules that appear from nowhere.
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.22, 6, 12), toon(APPLE_COLORS.legs));
      m.position.y = -0.2;
      m.castShadow = true;
      addOutline(m, 0.025);
      leg.add(m);
      leg.position.set(side * 0.32, 0.38, 0);
      leg.userData.side = side;
      this.root.add(leg);
      this.legs.push(leg);
    }

    this.body.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o !== facePatch) o.castShadow = true;
    });
  }

  update(t: number) {
    this.root.visible = this.presence > 0.001;
    const legLift = this.legsOut > 0.5 ? 0.38 : 0;
    this.root.position.set(this.x, this.y + legLift, this.z);
    const lean = this.lean + Math.sin(t * Math.PI) * this.sway;
    this.root.rotation.set(this.tilt, this.turn, lean, 'YXZ');
    this.root.scale.setScalar(Math.max(this.presence, 0.0001));

    const s = Math.max(this.squash, 0.05);
    const w = 1 / Math.sqrt(s);
    this.body.scale.set(w, s, w);

    const idx = Math.min(APPLE_FACES.length - 1, Math.max(0, Math.round(this.face)));
    if (this.faceMat.map !== this.faces[idx]) {
      this.faceMat.map = this.faces[idx];
      this.faceMat.needsUpdate = true;
    }

    // Stem twitch: jittery, deliberately not smooth.
    const jitter = Math.sign(Math.sin(t * 47)) * Math.abs(Math.sin(t * 13));
    this.stem.rotation.z = -0.1 + this.twitch * 0.25 * jitter;

    // Leaf: -1 droops along the side, +1 sticks straight up.
    const p = this.leafPose;
    this.leaf.rotation.set(0, 0, p >= 0 ? 0.35 + p * 1.1 : 0.35 + p * 1.6);

    for (const leg of this.legs) {
      leg.visible = this.legsOut > 0.5;
      const phase = leg.userData.side * Math.sin(t * 28);
      leg.rotation.x = phase * 0.9 * this.run;
      leg.position.y = 0.38 + Math.max(0, phase) * 0.08 * this.run - legLift;
    }
  }
}
