import * as THREE from 'three';
import { PALETTE } from '../config/film';
import { clay, enableShadows } from '../core/materials';

const HILL_RADIUS = 40;

/** Mint hill (top of a huge sphere sits at y = 0) with bushes and flowers. */
export function createHill(): THREE.Group {
  const group = new THREE.Group();

  const hill = new THREE.Mesh(new THREE.SphereGeometry(HILL_RADIUS, 96, 48), clay(PALETTE.hill, { roughness: 1 }));
  hill.position.y = -HILL_RADIUS;
  hill.receiveShadow = true;
  group.add(hill);

  // Seeded random so the layout is identical on every run (important for re-renders).
  const rand = mulberry32(7);

  const bushMat = clay(PALETTE.bush);
  for (let i = 0; i < 16; i++) {
    const bush = new THREE.Group();
    const n = 3 + Math.floor(rand() * 2);
    for (let j = 0; j < n; j++) {
      const r = 0.5 + rand() * 0.4;
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), bushMat);
      puff.position.set((j - n / 2) * 0.55, r * 0.6, rand() * 0.3);
      bush.add(puff);
    }
    const angle = rand() * Math.PI * 2;
    const dist = 7 + rand() * 9;
    const bx = Math.cos(angle) * dist;
    const bz = Math.sin(angle) * dist - 3;
    // Keep the main camera corridor (in front of Mochi, +z) clear.
    if (bz > -2 && Math.abs(bx) < 7) continue;
    placeOnHill(bush, bx, bz);
    group.add(bush);
  }

  const stemMat = clay('#7cc58b');
  const centerMat = clay('#FFD36E');
  for (let i = 0; i < 28; i++) {
    const flower = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 6), stemMat);
    stem.position.y = 0.2;
    const petals = PALETTE.flowerPetals[i % PALETTE.flowerPetals.length];
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), clay(petals));
    head.position.y = 0.45;
    head.scale.y = 0.6;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), centerMat);
    dot.position.y = 0.5;
    flower.add(stem, head, dot);
    const angle = rand() * Math.PI * 2;
    const dist = 2.5 + rand() * 9;
    placeOnHill(flower, Math.cos(angle) * dist, Math.sin(angle) * dist);
    group.add(flower);
  }

  enableShadows(group, true, true);
  hill.castShadow = false;
  return group;
}

/** Height of the hill surface at (x, z). */
export function hillHeight(x: number, z: number) {
  return Math.sqrt(Math.max(HILL_RADIUS * HILL_RADIUS - x * x - z * z, 0)) - HILL_RADIUS;
}

function placeOnHill(obj: THREE.Object3D, x: number, z: number) {
  obj.position.set(x, hillHeight(x, z), z);
  const normal = new THREE.Vector3(x, obj.position.y + HILL_RADIUS, z).normalize();
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
