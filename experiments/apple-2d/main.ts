// 2D hand-drawn Táo Lém test. The doodle is drawn into a canvas and shown on a Three.js plane
// (CanvasTexture), so the same character can later be dropped into the 3D film as a billboard.
import * as THREE from 'three';
import { AppleDoodle, PALETTES, CANVAS_SIZE, GROUND } from './AppleDoodle';
import { ACTIONS, DEMO_ORDER, idle, withBlink, type Action } from './actions';
import './style.css';

const DRAW_FPS = 12; // "on twos": pose and line boil both step at 12 fps
const BOIL_DRAWINGS = 3; // cycle through 3 slightly different redraws

// Itim: hand-written font with Vietnamese glyphs, for captions and "haizz".
const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = 'https://fonts.googleapis.com/css2?family=Itim&display=swap';
document.head.appendChild(font);

const stage = document.getElementById('stage') as HTMLDivElement;
const captionEl = document.getElementById('caption') as HTMLDivElement;
const actionsEl = document.getElementById('actions') as HTMLDivElement;
const autoBtn = document.getElementById('btn-auto') as HTMLButtonElement;
const paletteSel = document.getElementById('palette') as HTMLSelectElement;
const steppedChk = document.getElementById('stepped') as HTMLInputElement;

// --- Three.js setup ---------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#FBFAF6');
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 5;

const doodle = new AppleDoodle();
const texture = new THREE.CanvasTexture(doodle.canvas);
texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
const character = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
);
scene.add(character);

function resize(): void {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h);
  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.updateProjectionMatrix();
  // The drawn character occupies roughly y 28%..80% of the square texture (ground at 78%).
  // Center that band slightly above the middle and put the caption right under the feet.
  const size = Math.min(w * 1.15, h * 1.1);
  const planeCenterY = h * 0.45 - size * 0.037; // in CSS px from the top
  character.scale.set(size, size, 1);
  character.position.y = h / 2 - planeCenterY;
  const groundY = planeCenterY + size * (GROUND / CANVAS_SIZE - 0.5);
  captionEl.style.top = `${groundY + size * 0.05}px`;
  captionEl.style.fontSize = `${Math.max(18, Math.min(34, size * 0.05))}px`;
}
new ResizeObserver(resize).observe(stage);

// --- Acting -----------------------------------------------------------------
const byId = new Map(ACTIONS.map((a) => [a.id, a]));
let current: Action | null = null;
let startedAt = 0;
let auto = true;
let demoIndex = 0;

function play(action: Action, now: number): void {
  current = action;
  startedAt = now;
  for (const b of actionsEl.querySelectorAll('button')) b.classList.toggle('active', b.dataset.id === action.id);
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

for (const [id, pal] of Object.entries(PALETTES)) {
  const o = document.createElement('option');
  o.value = id;
  o.textContent = pal.label;
  paletteSel.appendChild(o);
}
paletteSel.addEventListener('change', () => {
  doodle.palette = PALETTES[paletteSel.value];
  lastKey = '';
});

// --- Loop -------------------------------------------------------------------
let lastKey = '';
let lastCaption = '';

function frame(ms: number): void {
  const now = ms / 1000;
  const T = steppedChk.checked ? Math.floor(now * DRAW_FPS) / DRAW_FPS : now;

  if (current && now - startedAt >= current.duration) {
    if (auto) {
      demoIndex = (demoIndex + 1) % DEMO_ORDER.length;
      play(byId.get(DEMO_ORDER[demoIndex])!, now);
    } else {
      current = null;
      for (const b of actionsEl.querySelectorAll('button')) b.classList.remove('active');
    }
  }

  const t = current ? Math.max(0, T - startedAt) : 0;
  const pose = withBlink(current ? current.pose(t, T) : idle(T), T);
  const boil = Math.floor(now * DRAW_FPS) % BOIL_DRAWINGS;

  // Only redraw the canvas (and re-upload the texture) when something visible changed.
  const key = `${boil}|${T}|${current?.id}`;
  if (key !== lastKey) {
    lastKey = key;
    doodle.draw(pose, boil);
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

resize();
setAuto(true, performance.now() / 1000);
requestAnimationFrame(frame);

// Exposed for quick tweaking from the browser console.
Object.assign(window, { doodle });
