// Facebook Page images for "Chuyện nhà Táo": profile picture + cover photo.
// The page draws both at upload size and can overlay the Facebook crop guides
// (?guides). scripts/export-fb.mjs grabs the clean canvases as PNG.
import { Sketch } from '../../film2d/doodle/Sketch';
import { FONT_FAMILY, FONT_URL } from '../../film2d/doodle/style';
import { drawCover } from './cover';
import { drawGuides } from './guides';
import { drawProfile } from './profile';
import { COVER, PROFILE } from './sizes';
import './page.css';

declare global {
  interface Window {
    __posters?: { ready: Promise<boolean>; profile: HTMLCanvasElement; cover: HTMLCanvasElement };
  }
}

function canvas(id: string, w: number, h: number): HTMLCanvasElement {
  const el = document.getElementById(id) as HTMLCanvasElement;
  el.width = w;
  el.height = h;
  return el;
}

function render(profile: HTMLCanvasElement, cover: HTMLCanvasElement): void {
  drawProfile(new Sketch(profile.getContext('2d')!));
  drawCover(new Sketch(cover.getContext('2d')!));
  const showGuides = (document.getElementById('guides') as HTMLInputElement | null)?.checked ?? false;
  for (const [id, kind] of [['profile-guides', 'profile'], ['cover-guides', 'cover']] as const) {
    const g = document.getElementById(id) as HTMLCanvasElement;
    const ctx = g.getContext('2d')!;
    ctx.clearRect(0, 0, g.width, g.height);
    if (showGuides) drawGuides(ctx, kind);
  }
}

const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = FONT_URL;
document.head.appendChild(font);

const profile = canvas('profile', PROFILE.width, PROFILE.height);
const cover = canvas('cover', COVER.width, COVER.height);
canvas('profile-guides', PROFILE.width, PROFILE.height);
canvas('cover-guides', COVER.width, COVER.height);
const guides = document.getElementById('guides') as HTMLInputElement | null;
if (guides) {
  guides.checked = new URLSearchParams(location.search).has('guides');
  guides.addEventListener('change', () => render(profile, cover));
}
render(profile, cover);

const ready = document.fonts
  .load(`40px ${FONT_FAMILY}`)
  .then(() => {
    render(profile, cover);
    return document.fonts.check(`40px ${FONT_FAMILY}`);
  })
  .catch(() => false);
window.__posters = { ready, profile, cover };
