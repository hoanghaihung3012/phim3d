// Hand-lettered page title: "CHUYỆN NHÀ" in ink over a small "TÁO" in apple red,
// both with a thick white rim and an ink outline so they read on the sky.
import type { Sketch } from '../../film2d/doodle/Sketch';
import { FONT_FAMILY } from '../../film2d/doodle/style';

const APPLE_RED = '#FF6B6B';

function word(sk: Sketch, text: string, x: number, y: number, size: number, fill: string, rot: number): void {
  const c = sk.ctx;
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.font = `${size}px ${FONT_FAMILY}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.lineJoin = 'round';
  c.strokeStyle = sk.ink;
  c.lineWidth = size * 0.26;
  c.strokeText(text, 0, 0);
  c.strokeStyle = '#FFFFFF';
  c.lineWidth = size * 0.13;
  c.strokeText(text, 0, 0);
  c.fillStyle = fill;
  c.fillText(text, 0, 0);
  c.restore();
}

/** Draws the title centered at (x, y) in screen pixels. */
export function drawTitle(sk: Sketch, x: number, y: number, scale = 1): void {
  word(sk, 'CHUYỆN NHÀ', x, y - 52 * scale, 92 * scale, sk.ink, -0.03);
  word(sk, 'TÁO', x + 10 * scale, y + 56 * scale, 128 * scale, APPLE_RED, 0.04);
}
