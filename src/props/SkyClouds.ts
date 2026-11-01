import * as THREE from 'three';
import { clay } from '../core/materials';

/** Static background clouds so high-altitude shots are not just an empty gradient. */
export function createSkyClouds(): THREE.Group {
  const group = new THREE.Group();
  const mat = clay('#ffffff', { emissive: '#ffeef4', emissiveIntensity: 0.5 });
  // [x, y, z, size] - hand placed behind the action (negative z) at several heights.
  const layout: [number, number, number, number][] = [
    [-14, 7, -26, 2.2],
    [12, 9, -30, 2.8],
    [-6, 15, -22, 1.8],
    [9, 17, -18, 1.5],
    [-18, 19, -34, 3],
    [20, 13, -40, 3.4],
    [2, 22, -28, 2.4],
    [-10, 11, -14, 1.2],
  ];
  for (const [x, y, z, s] of layout) {
    const cloud = new THREE.Group();
    const puffs: [number, number, number, number][] = [
      [0, 0, 0, 1],
      [-1, -0.2, 0, 0.7],
      [1, -0.15, 0, 0.75],
      [-0.4, 0.45, 0, 0.6],
      [0.5, 0.4, 0, 0.55],
    ];
    for (const [px, py, pz, r] of puffs) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat);
      m.position.set(px, py, pz);
      cloud.add(m);
    }
    cloud.scale.set(s, s * 0.75, s * 0.6);
    cloud.position.set(x, y, z);
    group.add(cloud);
  }
  return group;
}
