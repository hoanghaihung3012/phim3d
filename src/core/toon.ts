import * as THREE from 'three';

let gradient: THREE.DataTexture | undefined;

/** 3-step toon ramp shared by every toon material (hand-drawn look). */
function toonGradient() {
  if (!gradient) {
    gradient = new THREE.DataTexture(new Uint8Array([90, 175, 255]), 3, 1, THREE.RedFormat);
    gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
  }
  return gradient;
}

export function toon(color: THREE.ColorRepresentation, opts: Partial<THREE.MeshToonMaterialParameters> = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), ...opts });
}

const outlineMat = new THREE.MeshBasicMaterial({ color: '#1d1420', side: THREE.BackSide });

/**
 * Inverted-hull outline: a black back-face copy of the mesh pushed out along
 * its normals by `thickness`, so the silhouette gets a thick ink line.
 */
export function addOutline(mesh: THREE.Mesh, thickness = 0.035): THREE.Mesh {
  const geo = mesh.geometry.clone();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + nrm.getX(i) * thickness,
      pos.getY(i) + nrm.getY(i) * thickness,
      pos.getZ(i) + nrm.getZ(i) * thickness,
    );
  }
  const hull = new THREE.Mesh(geo, outlineMat);
  hull.castShadow = false;
  mesh.add(hull);
  return hull;
}
