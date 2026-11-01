/**
 * Real-time transport (play / pause / seek). It only produces a time value;
 * the Timeline turns that value into a frame. The Recorder bypasses this and
 * steps time in fixed 1/fps increments instead.
 */
export class Playback {
  private startWall = 0;
  private startTime = 0;
  private _time = 0;
  playing = false;

  constructor(public duration: number) {}

  get time() {
    return this._time;
  }

  play() {
    if (this._time >= this.duration) this._time = 0;
    this.startWall = performance.now();
    this.startTime = this._time;
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  seek(t: number) {
    this._time = Math.min(Math.max(t, 0), this.duration);
    this.startWall = performance.now();
    this.startTime = this._time;
  }

  /** Advance from the wall clock; returns current film time. */
  tick(now = performance.now()): number {
    if (this.playing) {
      this._time = this.startTime + (now - this.startWall) / 1000;
      if (this._time >= this.duration) {
        this._time = this.duration;
        this.playing = false;
      }
    }
    return this._time;
  }
}
