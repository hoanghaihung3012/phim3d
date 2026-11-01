import * as THREE from 'three';
import { FILM } from '../config/film';

/**
 * The 2D film is drawn with Canvas 2D into a fixed 1920x1080 canvas, which is shown on a
 * full-frame Three.js plane (CanvasTexture). Keeping Three.js as the presenter means 3D
 * elements or shader effects can be layered in later, and the Recorder captures the
 * WebGL canvas exactly like the 3D version did.
 */
export class Stage2D {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  readonly film: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  private readonly texture: THREE.CanvasTexture;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.film = document.createElement('canvas');
    this.film.width = FILM.width;
    this.film.height = FILM.height;
    const ctx = this.film.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.ctx = ctx;

    this.texture = new THREE.CanvasTexture(this.film);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.texture }));
    this.scene.add(plane);
    this.camera.position.z = 1;

    this.setPreviewSize();
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  setPreviewSize(): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(1280, 720, false);
  }

  setExportSize(): void {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(FILM.width, FILM.height, false);
  }

  /** Call after drawing a new frame into `ctx`. */
  markDirty(): void {
    this.texture.needsUpdate = true;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
