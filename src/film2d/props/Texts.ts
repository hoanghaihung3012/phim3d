// Hand-written words: sound-effect words placed in the world ("CỘP!"), bottom captions
// for Táo's lines (like a comic strip), the title and the end card. All are pure functions
// of film time, so seeking and export stay exact.
import { FILM } from '../../config/film';
import type { Sketch } from '../doodle/Sketch';
import { FONT_FAMILY, INK, PAPER } from '../doodle/style';

export interface WorldWord {
  t0: number;
  t1: number;
  text: string;
  /** World position (center). */
  x: number;
  y: number;
  /** Screen px. */
  size?: number;
  rot?: number;
}

export interface Caption {
  t0: number;
  t1: number;
  text: string;
}

export interface ScreenText {
  t0: number;
  t1: number;
  text: string;
  /** Fractions of the frame. */
  x: number;
  y: number;
  size: number;
  color?: string;
  /** Bounce in like the title card. */
  bounce?: boolean;
}

export class Texts {
  words: WorldWord[] = [];
  captions: Caption[] = [];
  screen: ScreenText[] = [];
  /** Set when the frame is faded to black, so captions switch to light ink. */
  dark = false;

  /** Words in the world: drawn in screen space at the projected point so size is constant. */
  drawWorld(sk: Sketch, t: number): void {
    const c = sk.ctx;
    for (const w of this.words) {
      if (t < w.t0 || t >= w.t1) continue;
      const p = sk.camera.transformPoint(new DOMPoint(w.x, w.y));
      // Pop in: slightly bigger on the first drawing.
      const pop = t - w.t0 < 1 / 12 ? 1.25 : 1;
      this.word(sk, w.text, p.x, p.y, (w.size ?? 64) * pop, w.rot ?? -0.06, true);
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  drawScreen(sk: Sketch, t: number): void {
    const c = sk.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    for (const cap of this.captions) {
      if (t < cap.t0 || t >= cap.t1) continue;
      this.word(sk, cap.text, FILM.width / 2, FILM.height * 0.9, 54, 0, false, this.dark ? PAPER : INK);
    }
    for (const s of this.screen) {
      if (t < s.t0 || t >= s.t1) continue;
      let size = s.size;
      if (s.bounce) {
        const k = t - s.t0;
        size *= k < 0.25 ? 0.6 + (k / 0.25) * 0.6 : k < 0.45 ? 1.2 - ((k - 0.25) / 0.2) * 0.25 : 0.95 + Math.min(0.05, (k - 0.45) * 0.2);
      }
      this.word(sk, s.text, s.x * FILM.width, s.y * FILM.height, size, s.bounce ? -0.04 : 0, true, s.color);
    }
  }

  private word(sk: Sketch, text: string, x: number, y: number, size: number, rot: number, outline: boolean, color = INK): void {
    const c = sk.ctx;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(x + sk.jitter(text.length, 1) * 1.5, y + sk.jitter(text.length, 2) * 1.5);
    c.rotate(rot + sk.jitter(text.length, 3) * 0.008);
    c.font = `${Math.round(size)}px ${FONT_FAMILY}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    if (outline) {
      c.lineWidth = size * 0.18;
      c.strokeStyle = color === INK ? PAPER : INK;
      c.strokeText(text, 0, 0);
    }
    c.fillStyle = color;
    c.fillText(text, 0, 0);
    c.restore();
  }
}
