import * as THREE from 'three';

/** Soft "clay" look: high roughness, no metalness. */
export function clay(color: THREE.ColorRepresentation, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
}

/** Mark every mesh under `obj` to cast and/or receive shadows. */
export function enableShadows(obj: THREE.Object3D, cast = true, receive = true) {
  obj.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
}
