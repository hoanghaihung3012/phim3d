import { AudioManager } from '../audio/AudioManager';
import { renderCuesWav } from '../audio/renderWav';
import type { Cue } from '../audio/cues';
import { FILM } from '../config/film';
import { Playback } from '../core/Playback';
import { Recorder } from '../core/Recorder';
import { Timeline } from '../core/Timeline';
import { createCast, type Scene2D } from './cast';
import { Sketch } from './doodle/Sketch';
import { FONT_FAMILY, FONT_URL } from './doodle/style';
import { drawFrame } from './drawFrame';
import { Keyer } from './Keyer';
import { Stage2D } from './Stage2D';

/** Drawings per second: the film is animated "on twos" like hand-drawn cartoons. */
export const DRAW_FPS = 12;
/** Number of slightly different redraws the line boil cycles through. */
const BOIL_DRAWINGS = 3;

export interface Film2DOptions {
  scenes: Scene2D[];
  cues: Cue[];
  fileName?: string;
}

export function bootFilm2D(opts: Film2DOptions) {
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = FONT_URL;
  document.head.appendChild(font);

  const stage = new Stage2D(document.getElementById('viewport')!);
  const sk = new Sketch(stage.ctx);
  const cast = createCast();

  const timeline = new Timeline();
  const keyer = new Keyer(timeline);
  for (const scene of opts.scenes) {
    scene.build(keyer, cast);
    timeline.mark(scene.start, scene.title);
    timeline.duration = Math.max(timeline.duration, scene.end);
  }

  const audio = new AudioManager(opts.cues);
  const playback = new Playback(timeline.duration);

  let lastT = -1;
  let drawnAt = Number.NaN;
  function renderAt(t: number) {
    const frame = Math.floor(t * DRAW_FPS + 1e-6);
    const tq = frame / DRAW_FPS;
    if (tq !== drawnAt) {
      drawnAt = tq;
      timeline.evaluate(tq);
      sk.seed = frame % BOIL_DRAWINGS;
      drawFrame(sk, cast, tq);
      stage.markDirty();
    }
    stage.render();
    audio.update(lastT, t);
    lastT = t;
    updateHud(t);
  }

  // Redraw once the hand-written font is ready (canvas text does not re-render by itself).
  document.fonts?.load(`40px ${FONT_FAMILY}`).then(() => (drawnAt = Number.NaN)).catch(() => {});

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
    lastT = -1;
  });
  window.addEventListener('keydown', async (e) => {
    if (recorder.recording) return;
    if (e.code === 'Space') {
      e.preventDefault();
      await audio.unlock();
      playback.toggle();
    } else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      const step = e.shiftKey ? 1 : 1 / DRAW_FPS;
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
      drawnAt = Number.NaN;
      btnPlay.disabled = btnRecord.disabled = seek.disabled = true;
    },
    onProgress: (t, d) => (btnRecord.textContent = `⏺ ${Math.round((t / d) * 100)}%`),
    onFinish: () => {
      stage.setPreviewSize();
      drawnAt = Number.NaN;
      btnPlay.disabled = btnRecord.disabled = seek.disabled = false;
      btnRecord.textContent = '⏺ Xuất WebM';
    },
  });
  btnRecord.addEventListener('click', () => {
    recorder.record(timeline.duration, opts.fileName ?? 'tao-muon-bay.webm').catch((err) => {
      console.error(err);
      alert(`Xuất video lỗi: ${err instanceof Error ? err.message : err}`);
    });
  });

  // ---- Main loop ------------------------------------------------------------
  const startAt = Number(new URLSearchParams(location.search).get('t') ?? 0);
  playback.seek(Number.isFinite(startAt) ? startAt : 0);

  function loop() {
    if (!recorder.recording) renderAt(playback.tick());
    requestAnimationFrame(loop);
  }
  loop();

  /** Whole soundtrack rendered offline as a base64 WAV (for scripts/export-mp4.mjs). */
  const renderAudioWav = (sampleRate = 44100) => renderCuesWav(opts.cues, timeline.duration, sampleRate);

  Object.assign(window, {
    __film: {
      seek: (t: number) => (playback.pause(), playback.seek(t), renderAt(t)),
      filmCanvas: stage.film,
      drawFps: DRAW_FPS,
      duration: timeline.duration,
      renderAudioWav,
      fontsReady: () => document.fonts.load(`40px ${FONT_FAMILY}`).then(() => document.fonts.check(`40px ${FONT_FAMILY}`)),
      timeline,
      cast,
      recorder,
      fps: FILM.fps,
    },
  });
}
