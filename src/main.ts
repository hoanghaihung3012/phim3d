import { AudioManager } from './audio/AudioManager';
import { Cloud } from './characters/Cloud';
import { Mochi } from './characters/Mochi';
import { FILM } from './config/film';
import { CameraRig } from './core/CameraRig';
import { Playback } from './core/Playback';
import { Recorder } from './core/Recorder';
import { Stage } from './core/Stage';
import { Timeline } from './core/Timeline';
import { createHill } from './props/Hill';
import { createSkyTexture } from './props/Sky';
import { TitleCard } from './props/TitleCard';
import { SCENES } from './scenes';
import type { Cast } from './scenes/types';
import './style.css';

// ---- Stage & cast -------------------------------------------------------
const stage = new Stage(document.getElementById('viewport')!);
stage.scene.background = createSkyTexture();
stage.scene.add(createHill());

const cast: Cast = {
  mochi: new Mochi(),
  cloud: new Cloud(),
  title: new TitleCard(stage.camera, FILM.title),
  cam: new CameraRig(stage.camera),
};
stage.scene.add(cast.mochi.root, cast.cloud.root);

// ---- Timeline: scenes add keyframes, then cast turns state into transforms.
const timeline = new Timeline();
for (const scene of SCENES) {
  scene.build(timeline, cast);
  timeline.mark(scene.start, scene.title);
  timeline.duration = Math.max(timeline.duration, scene.end);
}
timeline.onUpdate((t) => {
  cast.mochi.update(t);
  cast.cloud.update(t);
  cast.title.update();
  cast.cam.update(t);
});

const audio = new AudioManager();
const playback = new Playback(timeline.duration);

let lastT = -1;
/** Render the exact frame for film time t. Used by preview AND export. */
function renderAt(t: number) {
  timeline.evaluate(t);
  stage.render();
  audio.update(lastT, t);
  lastT = t;
  updateHud(t);
}

// ---- HUD ----------------------------------------------------------------
const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
const btnRecord = document.getElementById('btn-record') as HTMLButtonElement;
const seek = document.getElementById('seek') as HTMLInputElement;
const timeLabel = document.getElementById('time')!;
const sceneLabel = document.getElementById('scene-label')!;
seek.max = String(timeline.duration);

function updateHud(t: number) {
  timeLabel.textContent = `${t.toFixed(2)}s`;
  sceneLabel.textContent = timeline.markerAt(t)?.label ?? '';
  if (document.activeElement !== seek) seek.value = String(t);
  btnPlay.textContent = playback.playing ? '⏸ Pause' : '▶ Play';
}

btnPlay.addEventListener('click', async () => {
  await audio.unlock();
  playback.toggle();
});

seek.addEventListener('input', () => {
  playback.seek(Number(seek.value));
  lastT = -1; // seeking must not fire every cue in between
});

window.addEventListener('keydown', async (e) => {
  if (recorder.recording) return;
  if (e.code === 'Space') {
    e.preventDefault();
    await audio.unlock();
    playback.toggle();
  } else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
    // Frame step (Shift = 1 second).
    const step = e.shiftKey ? 1 : 1 / FILM.fps;
    playback.pause();
    playback.seek(playback.time + (e.code === 'ArrowRight' ? step : -step));
    lastT = -1;
  }
});

// ---- Export -------------------------------------------------------------
const recorder = new Recorder(stage.canvas, {
  renderAt,
  audioStream: () => audio.stream,
  onStart: async () => {
    await audio.unlock();
    playback.pause();
    lastT = -1;
    stage.setExportSize();
    btnPlay.disabled = btnRecord.disabled = seek.disabled = true;
  },
  onProgress: (t, d) => (btnRecord.textContent = `⏺ ${Math.round((t / d) * 100)}%`),
  onFinish: () => {
    stage.setPreviewSize();
    btnPlay.disabled = btnRecord.disabled = seek.disabled = false;
    btnRecord.textContent = '⏺ Xuất WebM';
  },
});
btnRecord.addEventListener('click', () => {
  recorder.record(timeline.duration).catch((err) => {
    console.error(err);
    alert(`Xuất video lỗi: ${err instanceof Error ? err.message : err}`);
  });
});

// ---- Main loop ------------------------------------------------------------
// ?t=18 in the URL jumps straight to a moment (handy for debugging a gag).
const startAt = Number(new URLSearchParams(location.search).get('t') ?? 0);
playback.seek(Number.isFinite(startAt) ? startAt : 0);

function loop() {
  if (!recorder.recording) renderAt(playback.tick());
  requestAnimationFrame(loop);
}
loop();

// Exposed for console debugging / automated screenshots: __film.seek(21)
Object.assign(window, {
  __film: { seek: (t: number) => (playback.pause(), playback.seek(t), renderAt(t)), timeline, cast, recorder },
});
