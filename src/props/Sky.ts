import * as THREE from 'three';
import { PALETTE } from '../config/film';

/** Vertical gradient background (blue top -> pink horizon) via CanvasTexture. */
export function createSkyTexture(top: string = PALETTE.skyTop, bottom: string = PALETTE.skyBottom) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, top);
  g.addColorStop(0.65, bottom);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
