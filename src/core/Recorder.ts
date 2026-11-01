import { FILM } from '../config/film';

export interface RecorderHooks {
  /** Render exactly the frame for time t (seconds). */
  renderAt: (t: number) => void;
  /** Called before the first frame (e.g. switch to export resolution, unlock audio). */
  onStart?: () => void | Promise<void>;
  /** Called after the last frame, success or not. */
  onFinish?: () => void;
  onProgress?: (t: number, duration: number) => void;
  /** Optional audio to mux into the video. */
  audioStream?: () => MediaStream | undefined;
}

/**
 * Records the canvas to WebM with MediaRecorder.
 *
 * Time is fixed-step (t = frame / fps) so every frame is deterministic, but
 * frames are paced against the wall clock because MediaRecorder timestamps
 * frames in real time (and live WebAudio has to play in real time to be
 * captured). If the browser cannot keep up, frames are still exact; only the
 * pacing slips, and the output stays in sync with audio cues.
 */
export class Recorder {
  recording = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly hooks: RecorderHooks,
  ) {}

  private pickMime(): string {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
  }

  async record(duration: number, fileName = 'mochi-muon-bay.webm'): Promise<Blob> {
    if (this.recording) throw new Error('Recorder is already running');
    this.recording = true;
    try {
      await this.hooks.onStart?.();
      const stream = this.canvas.captureStream(FILM.fps);
      const audio = this.hooks.audioStream?.();
      audio?.getAudioTracks().forEach((track) => stream.addTrack(track));

      const mimeType = this.pickMime();
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: 12_000_000,
      });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      const stopped = new Promise<void>((resolve) => (recorder.onstop = () => resolve()));

      // Render frame 0 before starting so the first captured frame is correct.
      this.hooks.renderAt(0);
      recorder.start(1000);

      const totalFrames = Math.ceil(duration * FILM.fps);
      const startWall = performance.now();
      for (let frame = 0; frame <= totalFrames; frame++) {
        const t = frame / FILM.fps;
        const due = startWall + (frame * 1000) / FILM.fps;
        // Always yield to the event loop, even when behind schedule:
        // MediaRecorder and captureStream need it to grab and encode frames.
        const wait = Math.max(0, due - performance.now());
        await new Promise((r) => setTimeout(r, wait));
        this.hooks.renderAt(t);
        this.hooks.onProgress?.(t, duration);
      }

      recorder.stop();
      await stopped;
      // Stop only the canvas track; the audio track belongs to AudioManager and is reused.
      stream.getVideoTracks().forEach((track) => track.stop());

      const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
      download(blob, fileName);
      return blob;
    } finally {
      this.recording = false;
      this.hooks.onFinish?.();
    }
  }
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
