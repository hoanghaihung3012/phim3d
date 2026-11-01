import * as THREE from 'three';
import { FILM } from '../config/film';

/**
 * Renderer + THREE.Scene + camera + soft pastel lighting.
 * The canvas always renders at a fixed 16:9 internal resolution; CSS scales it.
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly sun: THREE.DirectionalLight;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping; // keeps pastel hues (ACES greys them out)
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap was removed in r18x; PCF + shadow.radius gives soft edges
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(40, FILM.width / FILM.height, 0.1, 500);
    // The camera is part of the scene so camera-attached overlays (title card) render.
    this.scene.add(this.camera);

    // Soft sky/ground fill + one warm key light with soft shadows.
    const hemi = new THREE.HemisphereLight('#dff1ff', '#bdebc4', 1.6);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight('#fff3e0', 2.2);
    this.sun.position.set(6, 12, 8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.radius = 6;
    this.sun.shadow.bias = -0.0005;
    const s = this.sun.shadow.camera;
    s.left = -14;
    s.right = 14;
    s.top = 14;
    s.bottom = -14;
    s.near = 1;
    s.far = 50;
    this.scene.add(this.sun);

    this.scene.fog = new THREE.Fog('#ffe9f0', 35, 120);

    this.setPreviewSize();
  }

  get canvas() {
    return this.renderer.domElement;
  }

  /** Preview: render at up to 1280x720 times devicePixelRatio for speed. */
  setPreviewSize() {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(1280, 720, false);
  }

  /** Export: exact film resolution, pixel ratio 1. */
  setExportSize() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(FILM.width, FILM.height, false);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
