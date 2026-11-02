// "Táo chào mọi người": short intro clip of the 2D hand-drawn Táo. The doodle is drawn into a
// canvas, composed with its caption onto a 1920x1080 frame, and shown on a Three.js plane.
// The frame is deterministic in time, so scripts/export-mp4.mjs can seek it and export an MP4.
import * as THREE from 'three';
import { renderCuesWav } from '../../src/audio/renderWav';
import { AppleDoodle, CANVAS_SIZE, GROUND } from './AppleDoodle';
import { withBlink } from './actions';
import { INTRO_CUES, INTRO_DURATION, stepAt } from './intro';
import './style.css';

const DRAW_FPS = 12; // "on twos": pose and line boil both step at 12 fps
const BOIL_DRAWINGS = 3; // cycle through 3 slightly different redraws
const HOLD = 1.2; // pause on the last drawing before the loop restarts
const W = 1920;
const H = 1080;
const FONT_FAMILY = 'Itim';
const PAPER = '#FBFAF6';
const INK = '#3A3F4E';

const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = 'https://fonts.googleapis.com/css2?family=Itim&display=swap';
document.head.appendChild(font);

const stage = document.getElementById('stage') as HTMLDivElement;
const replayBtn = document.getElementById('btn-replay') as HTMLButtonElement;
const progress = document.getElementById('progress') as HTMLDivElement;

// --- Frame composition ---------------------------------------------------------
const doodle = new AppleDoodle();
const frameCanvas = document.createElement('canvas');
frameCanvas.width = W;
frameCanvas.height = H;
const fctx = frameCanvas.getContext('2d')!;

// The square doodle is scaled so the ground line sits at 80% of the frame height.
const DOODLE_PX = 1240;
const DOODLE_SCALE = DOODLE_PX / CANVAS_SIZE;
const GROUND_Y = H * 0.8;
const DOODLE_TOP = GROUND_Y - GROUND * DOODLE_SCALE;

function drawGround(seed: number): void {
  const wob = (x: number) => 3 * Math.sin(x * 0.013 + seed * 2.1);
  fctx.beginPath();
  for (let x = W * 0.22; x <= W * 0.78; x += 24) fctx.lineTo(x, GROUND_Y + wob(x));
  fctx.lineWidth = 7;
  fctx.lineCap = 'round';
  fctx.strokeStyle = INK;
  fctx.stroke();
}

/** Draws the clip at time t (seconds) into frameCanvas. */
function renderAt(t: number): void {
  const f = Math.floor(t * DRAW_FPS + 1e-6);
  const T = f / DRAW_FPS;
  const { step, local } = stepAt(T);
  const pose = withBlink(step.action.pose(local, T), T);
  doodle.draw(pose, f % BOIL_DRAWINGS);

  fctx.setTransform(1, 0, 0, 1, 0, 0);
  fctx.fillStyle = PAPER;
  fctx.fillRect(0, 0, W, H);
  drawGround(f % BOIL_DRAWINGS);
  fctx.drawImage(doodle.canvas, (W - DOODLE_PX) / 2, DOODLE_TOP, DOODLE_PX, DOODLE_PX);

  let caption = '';
  for (const [at, text] of step.captions) if (local >= at) caption = text;
  if (caption) {
    fctx.font = `64px ${FONT_FAMILY}, 'Comic Sans MS', sans-serif`;
    fctx.textAlign = 'center';
    fctx.textBaseline = 'middle';
    fctx.lineJoin = 'round';
    fctx.lineWidth = 14;
    fctx.strokeStyle = PAPER;
    fctx.strokeText(caption, W / 2, GROUND_Y + 95);
    fctx.fillStyle = INK;
    fctx.fillText(caption, W / 2, GROUND_Y + 95);
  }
  texture.needsUpdate = true;
}

// --- Three.js presenter ----------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(PAPER);
stage.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 5;
const texture = new THREE.CanvasTexture(frameCanvas);
texture.colorSpace = THREE.SRGBColorSpace;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texture }));
scene.add(plane);

function resize(): void {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h);
  Object.assign(camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
  camera.updateProjectionMatrix();
  // Fit the 16:9 frame inside the stage.
  const s = Math.min(w / W, h / H);
  plane.scale.set(W * s, H * s, 1);
}
new ResizeObserver(resize).observe(stage);

// --- Playback ---------------------------------------------------------------------
let startedAt = performance.now() / 1000;
let seeking = false; // true while an exporter drives the clip with seek()
let lastDrawing = -1;
replayBtn.addEventListener('click', () => {
  seeking = false;
  startedAt = performance.now() / 1000;
  lastDrawing = -1;
});

function loop(ms: number): void {
  if (!seeking) {
    const t = (ms / 1000 - startedAt) % (INTRO_DURATION + HOLD);
    const drawing = Math.floor(Math.min(t, INTRO_DURATION - 1e-3) * DRAW_FPS);
    if (drawing !== lastDrawing) {
      lastDrawing = drawing;
      renderAt(drawing / DRAW_FPS);
      progress.style.width = `${(Math.min(t, INTRO_DURATION) / INTRO_DURATION) * 100}%`;
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

resize();
renderAt(0);
requestAnimationFrame(loop);

// Same contract as the film (src/film2d/boot.ts) so scripts/export-mp4.mjs can export this clip.
Object.assign(window, {
  doodle,
  __film: {
    seek: (t: number) => {
      seeking = true;
      renderAt(t);
    },
    filmCanvas: frameCanvas,
    drawFps: DRAW_FPS,
    duration: INTRO_DURATION,
    renderAudioWav: (sampleRate = 44100) => renderCuesWav(INTRO_CUES, INTRO_DURATION, sampleRate),
    fontsReady: () => document.fonts.load(`40px ${FONT_FAMILY}`).then(() => document.fonts.check(`40px ${FONT_FAMILY}`)),
  },
});
