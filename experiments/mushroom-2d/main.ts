// Character test for Nấm (2D doodle mushroom). Same pipeline as the film: Canvas 2D drawn with
// the film's Sketch helpers, shown on a Three.js plane, stepped at 12 drawings per second.
import * as THREE from 'three';
import { Apple2D } from '../../src/film2d/characters/Apple2D';
import { Mushroom2D } from '../../src/film2d/characters/Mushroom2D';
import { Sketch } from '../../src/film2d/doodle/Sketch';
import { FONT_URL } from '../../src/film2d/doodle/style';
import { ACTIONS, DEMO_ORDER, type Action } from './actions';
import './style.css';

const SIZE = 1024;
const DRAW_FPS = 12;

const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = FONT_URL;
document.head.appendChild(font);

const stage = document.getElementById('stage') as HTMLDivElement;
const captionEl = document.getElementById('caption') as HTMLDivElement;
const actionsEl = document.getElementById('actions') as HTMLDivElement;
const autoBtn = document.getElementById('btn-auto') as HTMLButtonElement;
const withApple = document.getElementById('with-apple') as HTMLInputElement;

// --- Three.js presenter -------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#FBFAF6');
stage.prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 5;
const canvas = document.createElement('canvas');
canvas.width = canvas.height = SIZE;
const ctx = canvas.getContext('2d')!;
const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
scene.add(plane);

const GROUND = 0.8; // ground line as a fraction of the square
function resize(): void {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h);
  Object.assign(camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
  camera.updateProjectionMatrix();
  const size = Math.min(w * 1.1, h * 1.05);
  const centerY = h * 0.44 - size * 0.04;
  plane.scale.set(size, size, 1);
  plane.position.y = h / 2 - centerY;
  captionEl.style.top = `${centerY + size * (GROUND - 0.5) + size * 0.05}px`;
  captionEl.style.fontSize = `${Math.max(18, Math.min(34, size * 0.05))}px`;
}
new ResizeObserver(resize).observe(stage);

// --- Cast ---------------------------------------------------------------------
const sk = new Sketch(ctx);
const nam = new Mushroom2D();
const DEFAULTS = { ...nam };
const apple = new Apple2D();
Object.assign(apple, { x: 190, y: 0, scale: 0.55, legs: 1, lookX: -1 });

// --- Acting -------------------------------------------------------------------
const byId = new Map(ACTIONS.map((a) => [a.id, a]));
let current: Action | null = null;
let startedAt = 0;
let auto = true;
let demoIndex = 0;

function play(a: Action, now: number): void {
  current = a;
  startedAt = now;
  for (const b of actionsEl.querySelectorAll('button')) b.classList.toggle('active', b.dataset.id === a.id);
}
function setAuto(on: boolean, now: number): void {
  auto = on;
  autoBtn.classList.toggle('active', on);
  autoBtn.textContent = on ? '⏸ Tự diễn' : '▶ Tự diễn';
  if (on) {
    demoIndex = 0;
    play(byId.get(DEMO_ORDER[0])!, now);
  }
}
for (const a of ACTIONS) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.id = a.id;
  b.innerHTML = `<kbd>${a.key}</kbd> ${a.label}`;
  b.addEventListener('click', () => {
    const now = performance.now() / 1000;
    setAuto(false, now);
    play(a, now);
  });
  actionsEl.appendChild(b);
}
autoBtn.addEventListener('click', () => setAuto(!auto, performance.now() / 1000));
window.addEventListener('keydown', (e) => {
  const a = ACTIONS.find((x) => x.key === e.key);
  if (!a) return;
  const now = performance.now() / 1000;
  setAuto(false, now);
  play(a, now);
});

// --- Loop ---------------------------------------------------------------------
let lastFrame = -1;
let lastCaption = '';
function frame(ms: number): void {
  const now = ms / 1000;
  const f = Math.floor(now * DRAW_FPS);
  if (current && now - startedAt >= current.duration) {
    if (auto) {
      demoIndex = (demoIndex + 1) % DEMO_ORDER.length;
      play(byId.get(DEMO_ORDER[demoIndex])!, now);
    } else {
      current = null;
      for (const b of actionsEl.querySelectorAll('button')) b.classList.remove('active');
    }
  }
  const T = f / DRAW_FPS;
  const t = current ? Math.max(0, T - startedAt) : 0;

  if (f !== lastFrame) {
    lastFrame = f;
    Object.assign(nam, DEFAULTS);
    const pair = withApple.checked;
    nam.x = pair ? -150 : 0;
    current?.apply(nam, t);
    const zoom = pair ? 1.12 : 1.3;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    sk.seed = f % 3;
    sk.setCamera(new DOMMatrix().translate(SIZE / 2, SIZE * GROUND).scale(zoom));
    // Ground line.
    sk.line([[-420, 4], [-200, 2], [0, 5], [200, 3], [420, 4]], 1, { amp: 2 });
    nam.draw(sk, T);
    if (pair) apple.draw(sk, T);
    texture.needsUpdate = true;
  }

  let caption = '';
  if (current) for (const [at, text] of current.captions) if (t >= at) caption = text;
  if (caption !== lastCaption) {
    lastCaption = caption;
    captionEl.textContent = caption;
    captionEl.classList.toggle('show', caption !== '');
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
withApple.addEventListener('change', () => (lastFrame = -1));

resize();
setAuto(true, performance.now() / 1000);
requestAnimationFrame(frame);
