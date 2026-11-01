import { AudioManager } from '../audio/AudioManager';
import { SYNTHS } from '../audio/synth';
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

  /**
   * Renders the whole soundtrack offline (no real-time playback needed) and returns a
   * 16-bit mono WAV as base64. Used by scripts/export-mp4.mjs together with `filmCanvas`.
   */
  async function renderAudioWav(sampleRate = 44100): Promise<string> {
    const ctx = new OfflineAudioContext(1, Math.ceil((timeline.duration + 1) * sampleRate), sampleRate);
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    for (const cue of opts.cues) SYNTHS[cue.id]?.(ctx as unknown as AudioContext, master, cue.t, cue);
    const data = (await ctx.startRendering()).getChannelData(0);
    const bytes = new Uint8Array(44 + data.length * 2);
    const view = new DataView(bytes.buffer);
    const str = (o: number, v: string) => [...v].forEach((ch, i) => view.setUint8(o + i, ch.charCodeAt(0)));
    str(0, 'RIFF');
    view.setUint32(4, 36 + data.length * 2, true);
    str(8, 'WAVEfmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    str(36, 'data');
    view.setUint32(40, data.length * 2, true);
    for (let i = 0; i < data.length; i++) view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 0x7fff, true);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

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
