import * as THREE from 'three';

/**
 * Text overlay rendered INSIDE the 3D canvas (attached to the camera),
 * so it is captured by the video recorder. Keyframe `opacity` / `scale`.
 */
export class TitleCard {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.MeshBasicMaterial;
  opacity = 0;
  scale = 1;

  constructor(camera: THREE.Camera, text: string, sub = '') {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.font = '700 190px "Comic Sans MS", "Baloo 2", system-ui, sans-serif';
    ctx.lineWidth = 28;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(text, 1024, sub ? 220 : 256);
    ctx.fillStyle = '#ff8fa3';
    ctx.fillText(text, 1024, sub ? 220 : 256);
    if (sub) {
      ctx.font = '600 72px system-ui, sans-serif';
      ctx.fillStyle = '#6b5a75';
      ctx.fillText(sub, 1024, 420);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), this.material);
    this.mesh.position.set(0, 0.1, -2);
    this.mesh.renderOrder = 999;
    camera.add(this.mesh);
  }

  update() {
    this.material.opacity = this.opacity;
    this.mesh.visible = this.opacity > 0.001;
    this.mesh.scale.setScalar(this.scale);
  }
}
