// Facebook Page posts for "Chuyện nhà Táo", drawn at upload size (1080x1350).
// scripts/export-fb-post.mjs grabs the canvases as PNG.
import { Sketch } from '../../film2d/doodle/Sketch';
import { FONT_FAMILY, FONT_URL } from '../../film2d/doodle/style';
import { drawHello } from './hello';
import { POST } from './sizes';
import './page.css';

declare global {
  interface Window {
    __posts?: { ready: Promise<boolean>; canvases: Record<string, HTMLCanvasElement> };
  }
}

const POSTS: Record<string, (sk: Sketch) => void> = { hello: drawHello };

const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = FONT_URL;
document.head.appendChild(font);

const canvases: Record<string, HTMLCanvasElement> = {};
for (const id of Object.keys(POSTS)) {
  const el = document.getElementById(id) as HTMLCanvasElement;
  el.width = POST.width;
  el.height = POST.height;
  canvases[id] = el;
}
const render = () => {
  for (const [id, draw] of Object.entries(POSTS)) draw(new Sketch(canvases[id].getContext('2d')!));
};
render();

const ready = document.fonts
  .load(`40px ${FONT_FAMILY}`)
  .then(() => {
    render();
    return document.fonts.check(`40px ${FONT_FAMILY}`);
  })
  .catch(() => false);
window.__posts = { ready, canvases };
