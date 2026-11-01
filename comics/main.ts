// Browser entry: renders the drawings named in window.NAMES (default: all strips + stickers) into window.OUT as PNG data URLs.
import * as F from './family';

type Draw = (c: CanvasRenderingContext2D) => void;
const DRAWINGS: Record<string, Draw> = {
  lineup: F.lineup, dinner: F.dinner, wormGag: F.wormGag, family2: F.family2,
  'tao-truyen-1-di-boi': F.strip, 'tao-truyen-2-bac-si': F.strip2, 'tao-truyen-3-ai-im-lau-nhat': F.strip3,
  'tao-truyen-4-tu-mai': F.strip4, 'tao-truyen-5-diem-kem': F.strip5, 'tao-truyen-1-them-gi': F.strip6,
  'tao-truyen-7-chia-banh': F.strip7, 'tao-truyen-8-hu-keo': F.strip8, 'tao-truyen-9-thi-chay': F.strip9,
  'tao-truyen-11-tao-bon': F.strip11,
};

(async () => {
  const w = window as any;
  try {
    const f = new FontFace('Itim', Uint8Array.from(atob(w.FONT), (ch) => ch.charCodeAt(0)));
    await f.load();
    document.fonts.add(f);
  } catch (e) { console.log('font fail', e); }
  const names: string[] = w.NAMES?.length ? w.NAMES : [...Object.keys(DRAWINGS).filter((n) => n.startsWith('tao-truyen')), 'stickers'];
  const out: Record<string, string> = {};
  for (const name of names) {
    if (name === 'stickers') {
      F.STICKERS.forEach((d, i) => { out['sticker-' + String(i + 1).padStart(2, '0') + '-' + d.name] = F.sticker(d).toDataURL('image/png'); });
      continue;
    }
    const fn = DRAWINGS[name];
    if (!fn) { console.log('unknown drawing', name); continue; }
    const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080;
    fn(cv.getContext('2d')!);
    out[name] = cv.toDataURL('image/png');
  }
  w.OUT = out;
})();
