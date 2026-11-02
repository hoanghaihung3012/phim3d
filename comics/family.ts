// Sample drawings for the "Nhà Táo" series idea. Scratch only; reuses the film's Sketch + Táo + Nấm.
import { Sketch, quad, ellipse, scallop, rand, type Pt } from '../src/film2d/doodle/Sketch';
import { COLORS, INK, LW, PAPER, FONT_FAMILY } from '../src/film2d/doodle/style';
import { Apple2D } from '../src/film2d/characters/Apple2D';
import { Mushroom2D } from '../src/film2d/characters/Mushroom2D';

type Eye = 'dot' | 'half' | 'closed' | 'happy' | 'shock' | 'big';
type Mouth = 'flat' | 'smile' | 'o' | 'wavy' | 'none' | 'grin';
let uid = 1000;
const nid = () => uid++;

function filled(sk: Sketch, pts: Pt[], fill: string, shade: string, off: Pt = [-20, -16], gap = true): void {
  const c = sk.ctx;
  const body = sk.wobble(pts, nid(), 1.6);
  c.save();
  sk.trace(body, true);
  c.fillStyle = shade;
  c.fill();
  c.clip();
  c.translate(off[0], off[1]);
  sk.trace(body, true);
  c.fillStyle = fill;
  c.fill();
  c.restore();
  const n = body.length;
  if (gap) sk.trace([...body.slice(Math.floor(n * 0.9)), ...body.slice(0, Math.floor(n * 0.86))], false);
  else sk.trace(body, true);
  c.lineWidth = sk.px(LW);
  c.strokeStyle = INK;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke();
}

function face(sk: Sketch, x: number, y: number, k: number, eyes: Eye, mouth: Mouth, blush: string, spread = 1): void {
  const c = sk.ctx;
  const ex = 62 * k * spread;
  const thin = LW * 0.75;
  c.globalAlpha = 0.55;
  for (const s of [-1, 1]) sk.blob(x + s * ex * 1.65, y + 46 * k, 28 * k, 15 * k, nid(), blush);
  c.globalAlpha = 1;
  for (const s of [-1, 1]) {
    const ox = x + s * ex;
    switch (eyes) {
      case 'dot': sk.blob(ox, y, 12 * k, 19 * k, nid(), INK); break;
      case 'big':
        sk.blob(ox, y, 17 * k, 24 * k, nid(), INK);
        sk.blob(ox + 5 * k, y - 8 * k, 5 * k, 6 * k, nid(), '#FFFFFF');
        break;
      case 'shock': sk.blob(ox, y - 4, 7 * k, 9 * k, nid(), INK); break;
      case 'half':
        c.save(); c.beginPath(); c.rect(ox - 30 * k, y - 1, 60 * k, 40 * k); c.clip();
        sk.blob(ox, y + 3 * k, 12 * k, 17 * k, nid(), INK); c.restore();
        sk.line([[ox - 21 * k, y - 1], [ox, y - 2], [ox + 21 * k, y - 1]], nid(), { width: thin, amp: 0.8 });
        break;
      case 'happy': sk.line(quad([ox - 18 * k, y + 8 * k], [ox, y - 18 * k], [ox + 18 * k, y + 8 * k], 6), nid(), { width: thin }); break;
      case 'closed': sk.line(quad([ox - 18 * k, y], [ox, y + 10 * k], [ox + 18 * k, y], 6), nid(), { width: thin }); break;
    }
  }
  const my = y + 44 * k;
  const mw = LW * 0.6;
  switch (mouth) {
    case 'flat': sk.line([[x - 13 * k, my], [x, my + 1], [x + 13 * k, my]], nid(), { width: mw, amp: 0.6 }); break;
    case 'smile': sk.line(quad([x - 15 * k, my - 3], [x, my + 14 * k], [x + 15 * k, my - 3], 6), nid(), { width: mw }); break;
    case 'grin':
      sk.shape([...quad([x - 22 * k, my - 4], [x, my - 8 * k], [x + 22 * k, my - 4], 5), ...quad([x + 22 * k, my - 4], [x, my + 30 * k], [x - 22 * k, my - 4], 6).slice(1, -1)], nid(), { fill: '#E2627A', width: mw, amp: 0.5 });
      break;
    case 'o': sk.shape(ellipse(x, my + 2, 8 * k, 10 * k, 12), nid(), { fill: '#C9536B', width: mw, amp: 0.4 }); break;
    case 'wavy': sk.line([[x - 16 * k, my + 3], [x - 8 * k, my - 3], [x, my + 3], [x + 8 * k, my - 3], [x + 16 * k, my + 3]], nid(), { width: mw, amp: 0.5 }); break;
    case 'none': break;
  }
}

function limbs(sk: Sketch, color: string, hipX: number, hipY: number, shX: number, shY: number, opts: { arm?: [number, number]; armLen?: number; legW?: number; armW?: number } = {}): void {
  for (const s of [-1, 1]) {
    const hip: Pt = [s * hipX, hipY];
    const foot: Pt = [s * (hipX + 4), -4];
    sk.tube(quad(hip, [(hip[0] + foot[0]) / 2, (hip[1] + foot[1]) / 2], foot, 5), nid(), opts.legW ?? 40, color);
  }
  const arm = opts.arm ?? [0.3, 0.3];
  const len = opts.armLen ?? 82;
  if (len > 0) arm.forEach((ang, i) => {
    const s = i === 0 ? -1 : 1;
    const sh: Pt = [s * shX, shY];
    const hand: Pt = [sh[0] + s * Math.sin(ang) * len, sh[1] + Math.cos(ang) * len];
    sk.tube(quad(sh, [(sh[0] + hand[0]) / 2 + s * 10, (sh[1] + hand[1]) / 2 + 6], hand, 6), nid(), opts.armW ?? 22, color);
  });
}

function hand(sk: Sketch, shX: number, shY: number, ang: number, len: number, color: string, w = 22): Pt {
  const hand: Pt = [shX + Math.sin(ang) * len, shY + Math.cos(ang) * len];
  sk.tube(quad([shX, shY], [(shX + hand[0]) / 2, (shY + hand[1]) / 2 + 8], hand, 6), nid(), w, color);
  return hand;
}

function roundBody(cx: number, cy: number, rx: number, ry: number, n = 64, flatBottom = 0.1, topDip = 0): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const s = Math.sin(a);
    let x = Math.cos(a) * rx;
    let y = s * ry;
    if (s > 0) y *= 1 - flatBottom * s * s;
    const d = (a + Math.PI / 2) / 0.35;
    const d2 = (a - Math.PI * 1.5) / 0.35;
    y += topDip * (Math.exp(-d * d) + Math.exp(-d2 * d2));
    pts.push([cx + x, cy + y]);
  }
  return pts;
}

function place(sk: Sketch, x: number, y: number, s: number, flip: number, fn: () => void): void {
  const c = sk.ctx;
  c.save();
  c.translate(x, y);
  c.scale(s * flip, s);
  fn();
  c.restore();
}

// ---- Family -----------------------------------------------------------------------------
const P = {
  pomelo: '#E4EE9C', pomeloShade: '#CCDB77', pomeloSpot: '#C2D36C',
  orange: '#FFC07A', orangeShade: '#F7A456', orangePore: '#EE9A4C',
  grape: '#CDB4FF', grapeShade: '#B096F2',
  jack: '#D7E08C', jackShade: '#BFCB6E', jackSpike: '#A9B85A',
  worm: '#C8EDB8', wormShade: '#AEDD9B',
  ladle: '#E6E4EE', wood: '#C79A6B', blushWarm: '#FF8E8E',
};

/** Bố Bưởi: big flattened pomelo, tiny nub, thick mustache, dad energy. */
export function dad(sk: Sketch, eyes: Eye = 'dot', mouth: Mouth = 'none', arm: [number, number] = [0.35, 0.35]): void {
  const R = 260;
  limbs(sk, P.pomelo, 70, -80, R * 0.95, -R * 0.75, { arm, armLen: 100, legW: 46, armW: 26 });
  filled(sk, roundBody(0, -60 - R * 0.86, R * 1.05, R * 0.86, 72, 0.12, 14), P.pomelo, P.pomeloShade, [-26, -20]);
  for (let i = 0; i < 9; i++) sk.blob(-180 + rand(i) * 360, -440 + rand(i + 50) * 300, 6, 5, nid(), P.pomeloSpot);
  // nub + leaf
  sk.tube([[0, -60 - R * 1.72], [4, -60 - R * 1.84]], nid(), 22, COLORS.stem);
  sk.shape([[6, -60 - R * 1.8], [60, -60 - R * 1.95], [96, -60 - R * 1.82], [50, -60 - R * 1.74]], nid(), { fill: COLORS.leaf });
  const fy = -60 - R * 0.95;
  face(sk, 0, fy, 1.1, eyes, mouth, P.blushWarm, 1.05);
  // mustache
  for (const s of [-1, 1]) {
    sk.shape([[0, fy + 40], [s * 30, fy + 28], [s * 70, fy + 36], [s * 88, fy + 62], [s * 52, fy + 58], [s * 20, fy + 54]], nid(), { fill: INK, width: LW * 0.5 });
  }
  // eyebrows
  for (const s of [-1, 1]) sk.line([[s * 40, fy - 44], [s * 72, fy - 50], [s * 100, fy - 42]], nid(), { width: LW * 1.3 });
}

/** Mẹ Cam: orange with pores, leaf-bow, ladle. */
export function mom(sk: Sketch, eyes: Eye = 'happy', mouth: Mouth = 'smile', ladleUp = 0): void {
  const R = 205;
  limbs(sk, P.orange, 52, -76, 0, 0, { arm: [0.3, 0], armLen: 0 });
  sk.ctx.save();
  // left arm normal
  hand(sk, -R * 0.92, -R * 0.75 - 50, -0.35, 84, P.orange);
  sk.ctx.restore();
  filled(sk, roundBody(0, -50 - R * 0.95, R, R * 0.95, 64, 0.08, 6), P.orange, P.orangeShade, [-22, -18]);
  for (let i = 0; i < 16; i++) {
    const a = rand(i + 7) * Math.PI * 2, r = 40 + rand(i + 90) * 130;
    const px = Math.cos(a) * r, py = -50 - R * 0.95 + Math.sin(a) * r * 0.9;
    if (Math.abs(px) < 110 && py > -300 && py < -170) continue;
    sk.blob(px, py, 4, 4, nid(), P.orangePore);
  }
  // leaf bow on top
  const ty = -50 - R * 1.9;
  for (const s of [-1, 1]) sk.shape([[0, ty + 6], [s * 50, ty - 34], [s * 86, ty - 6], [s * 50, ty + 26]], nid(), { fill: COLORS.leaf });
  sk.blob(0, ty + 4, 13, 13, nid(), COLORS.stem);
  face(sk, 0, -50 - R * 1.0, 1, eyes, mouth, COLORS.appleBlush);
  // ladle in right hand
  const h = hand(sk, R * 0.92, -R * 0.75 - 50, 0.4 + ladleUp * 2.4, 84, P.orange);
  const dir = ladleUp > 0.5 ? -1 : 1;
  sk.tube([[h[0], h[1]], [h[0] + 20, h[1] + dir * -150]], nid(), 14, P.ladle);
  sk.shape(ellipse(h[0] + 24, h[1] + dir * -180, 42, 30, 20), nid(), { fill: P.ladle });
}

/** Em Nho: one tiny grape on a twig, huge eyes, never talks except "ủa". */
export function baby(sk: Sketch, eyes: Eye = 'big', mouth: Mouth = 'o'): void {
  const R = 110;
  limbs(sk, P.grape, 30, -40, R * 0.88, -R * 0.9 - 30, { arm: [0.5, 0.5], armLen: 46, legW: 26, armW: 16 });
  filled(sk, roundBody(0, -30 - R, R * 0.92, R, 48, 0.05, 0), P.grape, P.grapeShade, [-12, -10]);
  sk.line(quad([-R * 0.45, -30 - R * 1.45], [-R * 0.6, -30 - R * 1.2], [-R * 0.55, -30 - R * 0.95], 5), nid(), { width: LW, color: '#FFFFFF' });
  sk.tube(quad([0, -30 - R * 1.95], [10, -30 - R * 2.25], [40, -30 - R * 2.35], 5), nid(), 12, COLORS.stem);
  face(sk, 0, -30 - R * 1.0, 0.62, eyes, mouth, COLORS.appleBlush, 1.15);
}

/** Ông Mít: tall bumpy jackfruit, white brows, cane, always half asleep. */
export function grandpa(sk: Sketch, eyes: Eye = 'closed', mouth: Mouth = 'flat'): void {
  const RX = 175, RY = 260;
  limbs(sk, P.jack, 48, -60, 0, 0, { arm: [0, 0], armLen: 0, legW: 38 });
  const cy = -50 - RY;
  // cane
  sk.tube([[RX + 70, cy + 40], [RX + 80, -4]], nid(), 18, P.wood);
  sk.tube(quad([RX + 70, cy + 40], [RX + 60, cy - 20], [RX + 20, cy + 10], 6), nid(), 18, P.wood);
  filled(sk, roundBody(0, cy, RX, RY, 72, 0.1, 0), P.jack, P.jackShade, [-20, -18]);
  for (let r = 0; r < 7; r++) for (let q = 0; q < 6; q++) {
    const x = -RX * 0.75 + q * (RX * 0.3) + (r % 2) * RX * 0.15, y = cy - RY * 0.8 + r * RY * 0.27;
    const nx = x / RX, ny = (y - cy) / RY;
    if (nx * nx + ny * ny > 0.72) continue;
    if (Math.abs(x) < 120 && y > cy - 90 && y < cy + 80) continue;
    sk.line([[x - 9, y + 5], [x, y - 6], [x + 9, y + 5]], nid(), { width: LW * 0.45, color: P.jackSpike, amp: 0.6 });
  }
  sk.tube([[0, cy - RY], [-6, cy - RY - 40]], nid(), 24, COLORS.stem);
  const fy = cy - 10;
  face(sk, 0, fy, 1, eyes, mouth, P.blushWarm, 1.05);
  for (const s of [-1, 1]) sk.shape([[s * 30, fy - 40], [s * 100, fy - 58], [s * 128, fy - 26], [s * 90, fy - 30]], nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  hand(sk, RX * 0.95, cy + 30, 0.9, 70, P.jack);
  hand(sk, -RX * 0.95, cy + 30, -0.3, 80, P.jack);
}

/** Sâu Sâu: the house worm-pet that lives in Táo's room. Táo is terrified of it. */
export function worm(sk: Sketch, eyes: Eye = 'dot', mouth: Mouth = 'smile'): void {
  const segs: [number, number, number][] = [[-150, -36, 36], [-95, -52, 42], [-40, -44, 46], [20, -60, 52]];
  for (const [x, y, r] of segs) filled(sk, ellipse(x, y - r + 36, r, r * 0.9, 28), P.worm, P.wormShade, [-6, -6], false);
  const [hx, hy, hr] = [90, -90, 66];
  filled(sk, ellipse(hx, hy - 20, hr, hr * 0.95, 32), P.worm, P.wormShade, [-10, -8], false);
  for (const s of [-1, 1]) {
    sk.line(quad([hx + s * 22, hy - 78], [hx + s * 30, hy - 120], [hx + s * 46, hy - 128], 5), nid(), { width: LW * 0.7 });
    sk.blob(hx + s * 46, hy - 128, 9, 9, nid(), INK);
  }
  face(sk, hx, hy - 30, 0.55, eyes, mouth, COLORS.appleBlush, 1.2);
}

// ---- Scene helpers ----------------------------------------------------------------------
function label(c: CanvasRenderingContext2D, x: number, y: number, title: string, sub: string): void {
  c.save();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.textAlign = 'center';
  c.fillStyle = INK;
  c.font = `44px ${FONT_FAMILY}`;
  c.fillText(title, x, y);
  c.font = `27px ${FONT_FAMILY}`;
  c.globalAlpha = 0.75;
  c.fillText(sub, x, y + 38);
  c.restore();
}

function text(c: CanvasRenderingContext2D, x: number, y: number, s: string, size = 40, align: CanvasTextAlign = 'center', rot = 0): void {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.textAlign = align;
  c.fillStyle = INK;
  c.font = `${size}px ${FONT_FAMILY}`;
  c.fillText(s, 0, 0);
  c.restore();
}

function ground(sk: Sketch, y: number, x0 = 40, x1 = 1880): void {
  sk.line([[x0, y], [(x0 + x1) / 2, y + 3], [x1, y]], nid(), { width: LW * 0.8, amp: 2 });
}

function bubble(sk: Sketch, x: number, y: number, w: number, h: number, tail: Pt): void {
  const pts = ellipse(x, y, w, h, 40);
  sk.shape([[x - w * 0.25, y + h * 0.7], tail, [x + w * 0.05, y + h * 0.8]], nid(), { fill: '#FFFFFF', width: LW * 0.7 });
  sk.shape(pts, nid(), { fill: '#FFFFFF', width: LW * 0.7 });
  sk.ctx.fillStyle = '#FFFFFF';
  sk.ctx.fillRect(x - w * 0.25 + 4, y + h * 0.55, w * 0.28, h * 0.3);
}

function frame(c: CanvasRenderingContext2D): Sketch {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = PAPER;
  c.fillRect(0, 0, 1920, 1080);
  const sk = new Sketch(c);
  sk.seed = 1;
  sk.setCamera(new DOMMatrix());
  uid = 1000;
  return sk;
}

function apple(x: number, y: number, s: number, set: Partial<Apple2D>): Apple2D {
  const a = new Apple2D();
  Object.assign(a, { x, y, scale: s, legs: 1, blink: 0, breath: 0 }, set);
  return a;
}

// 1) Lineup
export function lineup(c: CanvasRenderingContext2D): void {
  const sk = frame(c);
  const G = 800;
  text(c, 960, 110, 'NHÀ TÁO', 84);
  text(c, 960, 165, 'cả nhà mỗi người một loại quả. không ai thắc mắc.', 34);
  ground(sk, G);
  place(sk, 200, G, 0.55, 1, () => grandpa(sk));
  place(sk, 515, G, 0.55, 1, () => dad(sk, 'dot', 'none'));
  place(sk, 820, G, 0.58, 1, () => mom(sk, 'happy', 'smile'));
  apple(1110, G, 0.55, { eyes: 0, mouth: 0, armL: 0.15, armR: 0.15 }).draw(sk, 0);
  place(sk, 1340, G, 0.62, 1, () => baby(sk));
  place(sk, 1545, G, 0.45, 1, () => worm(sk));
  const m = new Mushroom2D();
  Object.assign(m, { x: 1780, y: G, scale: 0.5, blink: 0, breath: 0 });
  m.draw(sk, 0);
  label(c, 200, G + 70, 'Ông Mít', 'ngủ 23 tiếng/ngày');
  label(c, 515, G + 70, 'Bố Bưởi', 'da dày, lòng mềm');
  label(c, 820, G + 70, 'Mẹ Cam', 'đếm đến 3 là xong');
  label(c, 1110, G + 70, 'Táo Lém', '"Ờ."');
  label(c, 1330, G + 70, 'Em Nho', 'chỉ nói "ủa"');
  label(c, 1545, G + 70, 'Sâu Sâu', 'thú cưng (?)');
  label(c, 1780, G + 70, 'Nấm', 'hàng xóm, bạn thân');
}

// 2) Gag: dinner table. Everyone eats fruit... no. Everyone stares at the plate of rice.
export function dinner(c: CanvasRenderingContext2D): void {
  const sk = frame(c);
  const T = 760;
  // table
  place(sk, 960, T + 40, 0.62, 1, () => dad(sk, 'dot', 'none', [0.9, 0.9]));
  place(sk, 600, T + 40, 0.6, 1, () => mom(sk, 'half', 'flat', 0));
  apple(1310, T + 40, 0.58, { eyes: 0, mouth: 0, lookX: -1, armL: 0.8, armR: 0.8 }).draw(sk, 0);
  sk.shape([[260, T - 40], [1660, T - 40], [1640, T + 30], [280, T + 30]], nid(), { fill: '#F3D8AE' });
  sk.tube([[340, T + 30], [340, 1000]], nid(), 26, '#F3D8AE');
  sk.tube([[1580, T + 30], [1580, 1000]], nid(), 26, '#F3D8AE');
  // bowls
  for (const x of [600, 960, 1310]) {
    sk.shape([...quad([x - 50, T - 25], [x, T + 20], [x + 50, T - 25], 8)], nid(), { fill: '#FFFFFF' });
    sk.shape(scallop(x, T - 31, 40, 14, 6, 0.15, 40), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  }
  // the one apple on a plate in the middle... is a stranger apple
  sk.shape(ellipse(1130, T - 50, 70, 16, 24), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  sk.shape(roundBody(1130, T - 92, 44, 40, 32, 0.1, 6), nid(), { fill: COLORS.plainApple });
  sk.tube([[1130, T - 130], [1134, T - 148]], nid(), 8, COLORS.stem);
  // dots + sweat
  for (let i = 0; i < 3; i++) sk.blob(1250 + i * 26, 470, 7, 7, nid(), INK);
  text(c, 960, 140, 'Tập 1: "Món tráng miệng"', 56);
  text(c, 960, 205, 'Mẹ: "Tráng miệng hôm nay là... táo."   Táo: ". . ."', 36);
}

// 3) Gag: Táo vs Sâu Sâu, Em Nho reacts
export function wormGag(c: CanvasRenderingContext2D): void {
  const sk = frame(c);
  const G = 860;
  ground(sk, G);
  // Táo stiff, on tiptoe, on top of a stool
  sk.shape([[1080, G - 210], [1340, G - 210], [1330, G - 180], [1090, G - 180]], nid(), { fill: '#F3D8AE' });
  sk.tube([[1110, G - 180], [1100, G]], nid(), 20, '#F3D8AE');
  sk.tube([[1310, G - 180], [1320, G]], nid(), 20, '#F3D8AE');
  apple(1210, G - 205, 0.62, { eyes: 2, mouth: 5, armL: 2.6, armR: 2.6, sweat: 1, shake: 0 }).draw(sk, 0.3);
  place(sk, 620, G, 0.75, -1, () => worm(sk, 'happy', 'grin'));
  place(sk, 1620, G, 0.85, -1, () => baby(sk, 'dot', 'flat'));
  text(c, 1620, 560, 'ủa', 52);
  text(c, 520, 610, 'chào buổi sáng ♡', 36, 'center', -0.06);
  text(c, 960, 140, 'Tập 3: "Bạn cùng phòng"', 56);
}

// ======================= Comic strip demo =======================
const DUCK = { body: '#FFE27A', shade: '#F5CC4E', beak: '#FFA94D', beakShade: '#F08A2E' };

/** Vịt: round yellow duckling, wide flat bill, short legs with webbed feet, one curl of hair. Origin at feet. */
export function duck(sk: Sketch, eyes: Eye = 'dot', mouth: 'closed' | 'open' = 'closed', wing = 0.3): void {
  const cy = -140;
  // short legs + webbed feet
  for (const s of [-1, 1]) {
    const x = s * 36;
    sk.tube([[x, -40], [x, -14]], nid(), 13, DUCK.beak);
    sk.shape([[x, -20], [x + s * 6 + 30, -4], [x + 16, 2], [x, -4], [x - 16, 2], [x - s * 6 - 30, -4]], nid(), { fill: DUCK.beak, width: LW * 0.8, amp: 0.6 });
  }
  // tail tuft (left side)
  sk.shape([[-118, cy + 30], [-168, cy - 10], [-150, cy + 40], [-120, cy + 60]], nid(), { fill: DUCK.body });
  // wings
  for (const s of [-1, 1]) {
    const a = s === 1 ? wing : 0.3;
    const sh: Pt = [s * 120, cy + 20];
    const tip: Pt = [sh[0] + s * Math.sin(a) * 66, sh[1] + Math.cos(a) * 66];
    sk.shape([sh, [sh[0] + s * 28, sh[1] + 8], tip, [sh[0] - s * 4, sh[1] + 38]], nid(), { fill: DUCK.body });
  }
  filled(sk, roundBody(0, cy, 135, 122, 56, 0.15, 0), DUCK.body, DUCK.shade, [-14, -12]);
  // hair curl
  sk.line(quad([0, cy - 120], [-20, cy - 158], [14, cy - 164], 6), nid(), { width: LW * 0.9 });
  face(sk, 0, cy - 26, 0.85, eyes, 'none', COLORS.appleBlush, 1.25);
  // wide flat duck bill
  const by = cy + 12;
  if (mouth === 'open') {
    sk.shape(ellipse(0, by - 8, 50, 15, 24), nid(), { fill: DUCK.beak, width: LW * 0.75 });
    sk.shape([[-36, by + 4], [36, by + 4], [26, by + 26], [-26, by + 26]], nid(), { fill: DUCK.beakShade, width: LW * 0.75, amp: 0.6 });
  } else {
    sk.shape(ellipse(0, by, 50, 18, 24), nid(), { fill: DUCK.beak, width: LW * 0.75 });
    sk.line([[-38, by + 2], [0, by + 5], [38, by + 2]], nid(), { width: LW * 0.5, amp: 0.4 });
  }
}

/** Speech bubble whose tail opens into the balloon (no line across the joint). */
function say(sk: Sketch, cx: number, cy: number, lines: string[], tail: Pt, size = 34): void {
  const c = sk.ctx;
  c.save();
  c.font = `${size}px ${FONT_FAMILY}`;
  const w = Math.max(...lines.map((l) => c.measureText(l).width)) / 2 + 42;
  const h = (lines.length * size * 1.2) / 2 + 26;
  const body = sk.wobble(ellipse(cx, cy, w, h, 48), nid(), 1.4);
  const dx = tail[0] - cx, dy = tail[1] - cy;
  const ang = Math.atan2(dy, dx);
  const b1: Pt = [cx + Math.cos(ang - 0.18) * w * 0.85, cy + Math.sin(ang - 0.18) * h * 0.85];
  const b2: Pt = [cx + Math.cos(ang + 0.18) * w * 0.85, cy + Math.sin(ang + 0.18) * h * 0.85];
  const tl = sk.wobble([b1, [(b1[0] + tail[0]) / 2, (b1[1] + tail[1]) / 2], tail, [(b2[0] + tail[0]) / 2, (b2[1] + tail[1]) / 2], b2], nid(), 0.8);
  c.lineWidth = sk.px(LW * 1.3);
  c.strokeStyle = INK;
  c.lineJoin = 'round';
  c.lineCap = 'round';
  c.beginPath(); c.moveTo(tl[0][0], tl[0][1]); for (const p of tl.slice(1)) c.lineTo(p[0], p[1]); c.closePath(); c.stroke();
  sk.trace(body, true); c.stroke();
  c.fillStyle = '#FFFFFF';
  c.beginPath(); c.moveTo(tl[0][0], tl[0][1]); for (const p of tl.slice(1)) c.lineTo(p[0], p[1]); c.closePath(); c.fill();
  sk.trace(body, true); c.fill();
  c.fillStyle = INK;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  lines.forEach((l, i) => c.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * size * 1.2 + 2));
  c.restore();
}

function water(sk: Sketch, x0: number, x1: number, y: number, y1: number): void {
  const c = sk.ctx;
  const top: Pt[] = [];
  for (let x = x0; x <= x1; x += 20) top.push([x, y + 5 * Math.sin(x / 26)]);
  c.save();
  c.globalAlpha = 0.9;
  sk.trace([...top, [x1, y1], [x0, y1]], true);
  c.fillStyle = '#CFE9FF';
  c.fill();
  c.restore();
  sk.line(top, nid(), { width: LW * 0.8, amp: 1 });
  for (let i = 0; i < 5; i++) {
    const x = x0 + 60 + rand(i + 300) * (x1 - x0 - 120), yy = y + 40 + rand(i + 400) * (y1 - y - 60);
    sk.line([[x - 18, yy], [x - 6, yy - 6], [x + 6, yy], [x + 18, yy - 6]], nid(), { width: LW * 0.5, color: '#8EC3EE', amp: 0.6 });
  }
}

function nam(x: number, y: number, s: number, set: Partial<Mushroom2D>): Mushroom2D {
  const m = new Mushroom2D();
  Object.assign(m, { x, y, scale: s, blink: 0, breath: 0 }, set);
  return m;
}

const PW = 1000, PH = 520, TOP = 150;

export function strip(c: CanvasRenderingContext2D): void {
  c.canvas.width = PW;
  c.canvas.height = TOP + PH * 4 + 60;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF';
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 2;
  sk.setCamera(new DOMMatrix());
  uid = 3000;
  text(c, PW / 2, 80, 'ĐI BƠI', 44);
  text(c, PW - 30, c.canvas.height - 18, 'Táo Ờ', 26, 'right');
  sk.line([[PW / 2 - 150, 104], [PW / 2 + 150, 106]], nid(), { width: LW * 0.5, amp: 1.5 });
  const G = (i: number) => TOP + PH * i + PH - 40;

  // Panel backgrounds (poolside): rects match the crops used for the Facebook cut (comics/fb_rows.py).
  const PANELS: [number, number][] = [[175, 655], [670, 1190], [1300, 1735], [1800, 2250]];
  const SKY = '#D6EEFF', TILE = '#F6EBDA', TILE_LINE = '#E3D3BA', POOL = '#BFE3FF';
  const tiles = (x0: number, x1: number, y0: number, y1: number) => {
    c.fillStyle = TILE; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let x = x0 + 60; x < x1; x += 90) sk.line([[x, y0 + 4], [x - 6, y1]], nid(), { width: LW * 0.35, color: TILE_LINE, amp: 0.5 });
    sk.line([[x0, y0], [x1, y0]], nid(), { width: LW * 0.6, amp: 1 });
  };
  const sky = (y0: number, y1: number, clouds: Pt[]) => {
    c.fillStyle = SKY; c.fillRect(20, y0, PW - 40, y1 - y0);
    for (const [x, y] of clouds) sk.shape(scallop(x, y, 60, 26, 5, 0.18, 40), nid(), { fill: '#FFFFFF', width: LW * 0.5 });
  };
  const clipPanel = (i: number, fn: () => void) => {
    const [y0, y1] = PANELS[i];
    c.save(); sk.trace(rrectPts(20, y0, PW - 40, y1 - y0, 22), true); c.clip(); fn(); c.restore();
  };
  clipPanel(0, () => {
    sky(175, 655, [[120, 360]]);
    c.fillStyle = POOL; c.fillRect(20, G(0) - 110, PW - 40, 40);
    sk.line([[20, G(0) - 110], [PW - 20, G(0) - 110]], nid(), { width: LW * 0.5, amp: 1 });
    tiles(20, PW - 20, G(0) - 70, 655);
  });
  clipPanel(1, () => {
    sky(670, 1190, [[880, 720]]);
    c.fillStyle = POOL; c.fillRect(20, G(1) - 110, PW - 40, 40);
    sk.line([[20, G(1) - 110], [PW - 20, G(1) - 110]], nid(), { width: LW * 0.5, amp: 1 });
    tiles(20, PW - 20, G(1) - 70, 1190);
  });
  clipPanel(2, () => {
    sky(1300, 1735, [[520, 1350]]);
    c.fillStyle = POOL; c.fillRect(20, G(2) - 40, PW - 40, 1735 - (G(2) - 40));
  });
  clipPanel(3, () => {
    sky(1800, 2250, [[640, 1850]]);
    c.fillStyle = POOL; c.fillRect(470, G(3) - 30, PW - 490, 2250 - (G(3) - 30));
    tiles(20, 475, G(3) - 40, 2250);
  });

  // Panel 1: Vịt invites, Táo can't swim.
  let g = G(0);
  place(sk, 300, g, 0.62, 1, () => duck(sk, 'happy', 'open', -2.4));
  apple(690, g, 0.42, { eyes: 0, mouth: 0, lookX: -0.6 }).draw(sk, 0);
  say(sk, 270, g - 360, ['TÁO ƠI!', 'ĐI BƠI KHÔNG?'], [300, g - 260]);
  say(sk, 740, g - 370, ['TỚ KHÔNG', 'BIẾT BƠI.'], [700, g - 270]);

  // Panel 2: big sister Nấm, the know-it-all.
  g = G(1);
  nam(300, g, 0.78, { eyes: 1, mouth: 1, armR: 2.5, bendR: 0.4 }).draw(sk, 0);
  apple(700, g, 0.42, { eyes: 0, mouth: 0, lookX: -0.6 }).draw(sk, 0);
  say(sk, 330, g - 410, ['YÊN TÂM! TÁO NHẸ HƠN NƯỚC.', '1/4 QUẢ TÁO LÀ KHÔNG KHÍ ĐẤY.'], [330, g - 320], 30);
  say(sk, 770, g - 300, ['ỜM.'], [730, g - 230]);

  // Panel 3: it works. Táo floats; Sâu rides on top.
  g = G(2);
  const a3 = apple(580, g, 0.42, { eyes: 0, mouth: 0, legs: 0, arms: 0 });
  a3.draw(sk, 0);
  const headY = g - a3.stemTipHeight();
  place(sk, 540, headY + 30, 0.28, 1, () => worm(sk, 'dot', 'flat'));
  place(sk, 220, g + 12, 0.5, 1, () => duck(sk, 'happy', 'closed', -2.2));
  water(sk, 40, 960, g - 40, g + 40);
  say(sk, 230, g - 300, ['NỔI RỒI KÌA!'], [220, g - 200]);
  say(sk, 790, headY - 90, ['...'], [610, headY - 10]);

  // Panel 4: ...and keeps floating away.
  g = G(3);
  sk.line([[40, g - 40], [250, g - 38], [470, g - 40]], nid(), { width: LW * 0.8, amp: 1.5 });
  nam(150, g - 40, 0.55, { eyes: 3, mouth: 2 }).draw(sk, 0);
  place(sk, 340, g - 40, 0.42, 1, () => duck(sk, 'shock', 'open', 0.3));
  const a4 = apple(800, g - 12, 0.2, { eyes: 0, mouth: 0, legs: 0, arms: 0 });
  a4.draw(sk, 0);
  place(sk, 790, g - 12 - a4.stemTipHeight() + 14, 0.13, 1, () => worm(sk, 'dot', 'flat'));
  water(sk, 480, 960, g - 30, g + 30);
  say(sk, 300, g - 330, ['TÁO ĐI ĐÂU ĐẤY?'], [330, g - 200]);
  say(sk, 760, g - 250, ['TỚ VẪN KHÔNG', 'BIẾT BƠI.'], [795, g - 120], 30);
  for (const [x, y] of [[870, g - 50], [890, g - 30]] as Pt[]) sk.line([[x, y], [x + 34, y]], nid(), { width: LW * 0.5, amp: 0.5 });
  for (const [y0, y1] of PANELS) {
    sk.trace(sk.wobble(rrectPts(20, y0, PW - 40, y1 - y0, 22), nid(), 1), true);
    c.lineWidth = sk.px(LW * 1.4); c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke();
  }
}

// ======================= Strip #2: 4 wide framed panels =======================
function rrectPts(x: number, y: number, w: number, h: number, r: number, perCorner = 8): Pt[] {
  const pts: Pt[] = [];
  const cs: [number, number, number][] = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= perCorner; i++) {
    const a = a0 + (i / perCorner) * (Math.PI / 2);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

/** Pill-shaped speech box; tail opens into the box. */
function sayBox(sk: Sketch, cx: number, cy: number, lines: string[], tail: Pt | null, size = 36, fill = '#FFFFFF'): void {
  const c = sk.ctx;
  c.save();
  c.font = `${size}px ${FONT_FAMILY}`;
  const w = Math.max(...lines.map((l) => c.measureText(l).width)) + 64;
  const h = lines.length * size * 1.22 + 34;
  const body = sk.wobble(rrectPts(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 40)), nid(), 1.2);
  let tl: Pt[] = [];
  if (tail) {
    const bx = Math.max(cx - w / 2 + 50, Math.min(cx + w / 2 - 50, tail[0] + (cx - tail[0]) * 0.35));
    const by = tail[1] > cy ? cy + h / 2 - 6 : cy - h / 2 + 6;
    tl = sk.wobble([[bx - 18, by], tail, [bx + 18, by]], nid(), 0.6);
  }
  c.lineWidth = sk.px(LW * 1.2);
  c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round';
  const poly = (p: Pt[]) => { c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (const q of p.slice(1)) c.lineTo(q[0], q[1]); c.closePath(); };
  if (tl.length) { poly(tl); c.stroke(); }
  sk.trace(body, true); c.stroke();
  c.fillStyle = fill;
  if (tl.length) { poly(tl); c.fill(); }
  sk.trace(body, true); c.fill();
  c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
  lines.forEach((l, i) => c.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * size * 1.22 + 2));
  c.restore();
}

const NIGHT = { bg: '#5E6578', glow: '#7C849A', table: '#3B3F4C', tableTop: '#4A4F5E', lamp: '#FFE7A3' };
const W2 = 1200, PH2 = 430, GAP = 26;

function nightBg(sk: Sketch, w: number, h: number): void {
  const c = sk.ctx;
  c.fillStyle = NIGHT.bg; c.fillRect(0, 0, w, h);
  c.fillStyle = NIGHT.glow;
  c.beginPath(); c.ellipse(w / 2, h * 0.95, w * 0.42, h * 0.9, 0, 0, Math.PI * 2); c.fill();
}

function lamp(sk: Sketch, x: number, y: number): void {
  const c = sk.ctx;
  c.save(); c.globalAlpha = 0.3; c.fillStyle = '#FFF6D0';
  c.beginPath(); c.arc(x, y - 120, 95, 0, Math.PI * 2); c.fill(); c.restore();
  sk.shape([[x - 40, y], [x + 40, y], [x + 34, y - 16], [x - 34, y - 16]], nid(), { fill: '#C9CEDB', width: LW * 0.8 });
  sk.tube([[x, y - 16], [x - 10, y - 90], [x + 20, y - 130]], nid(), 10, '#C9CEDB');
  sk.shape([[x - 10, y - 150], [x + 60, y - 120], [x + 40, y - 96], [x - 20, y - 128]], nid(), { fill: '#FFD27A', width: LW * 0.8 });
}

function table(sk: Sketch, w: number, h: number, top: number): void {
  const c = sk.ctx;
  c.fillStyle = NIGHT.table; c.fillRect(0, top, w, h - top);
  c.fillStyle = NIGHT.tableTop; c.fillRect(0, top, w, 18);
  sk.line([[0, top], [w / 2, top + 2], [w, top]], nid(), { width: LW * 0.8, amp: 1 });
}

function book(sk: Sketch, x: number, y: number): void {
  sk.shape([[x - 90, y - 10], [x, y + 8], [x, y + 70], [x - 90, y + 50]], nid(), { fill: '#FFFFFF', width: LW * 0.8 });
  sk.shape([[x + 90, y - 10], [x, y + 8], [x, y + 70], [x + 90, y + 50]], nid(), { fill: '#F4F1FF', width: LW * 0.8 });
  for (let i = 0; i < 3; i++) sk.line([[x - 72, y + 14 + i * 14], [x - 16, y + 26 + i * 14]], nid(), { width: LW * 0.35, color: '#B7BCCB', amp: 0.4 });
}

function doctorGear(sk: Sketch): void {
  // local coords of the apple body (origin at apple bottom)
  const metal = '#8C93A6';
  sk.tube(quad([-150, -120], [-120, -40], [0, -50], 6), nid(), 9, metal);
  sk.tube(quad([150, -120], [120, -40], [0, -50], 6), nid(), 9, metal);
  sk.tube(quad([0, -50], [70, -60], [100, -95], 5), nid(), 9, metal);
  sk.shape(ellipse(104, -104, 26, 22, 18), nid(), { fill: '#DDE2EC', width: LW * 0.8 });
  sk.line(quad([-215, -270], [0, -330], [215, -270], 8), nid(), { width: LW * 1.6 });
  sk.shape(ellipse(-80, -330, 46, 46, 24), nid(), { fill: '#E9EDF5' });
  sk.blob(-80, -330, 14, 14, nid(), metal);
  sk.line(quad([-108, -352], [-100, -365], [-82, -368], 4), nid(), { width: LW * 0.6, color: '#FFFFFF' });
}

function panelFrame(sk: Sketch, y: number, draw: () => void): void {
  const c = sk.ctx;
  const x0 = 20, w = W2 - 40;
  const pts = rrectPts(x0, y, w, PH2, 22);
  c.save();
  sk.trace(pts, true); c.clip();
  sk.setCamera(new DOMMatrix().translate(x0, y));
  draw();
  c.restore();
  sk.setCamera(new DOMMatrix());
  sk.trace(sk.wobble(pts, nid(), 1), true);
  c.lineWidth = sk.px(LW * 1.4); c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke();
}

export function strip2(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 3;
  sk.setCamera(new DOMMatrix());
  uid = 5000;
  const w = W2 - 40, T = PH2 - 70;
  const py = (i: number) => GAP + i * (PH2 + GAP);
  const namX = 290, taoX = 860;

  // 1. Nấm reads a fact out loud.
  panelFrame(sk, py(0), () => {
    nightBg(sk, w, PH2); lamp(sk, w / 2 + 10, T + 6);
    nam(namX, T + 30, 0.8, { eyes: 0, mouth: 0, lookX: 0.4, armL: 0.9, armR: 0.9, bendL: 0.8, bendR: 0.8 }).draw(sk, 0);
    apple(taoX, T + 40, 0.5, { eyes: 0, mouth: 0, lookX: -0.6, arms: 0 }).draw(sk, 0);
    table(sk, w, PH2, T);
    book(sk, namX, T - 20);
    place(sk, 650, T + 8, 0.28, -1, () => worm(sk, 'dot', 'flat'));
    sayBox(sk, 520, 64, ['SÁCH NÓI: "MỖI NGÀY MỘT QUẢ TÁO,', 'KHỎI CẦN GẶP BÁC SĨ!"'], [380, 150], 32);
    sayBox(sk, 1000, 110, ['Ờ.'], [930, 170], 36);
  });

  // 2. She looks at him a bit too long.
  panelFrame(sk, py(1), () => {
    nightBg(sk, w, PH2); lamp(sk, w / 2 + 10, T + 6);
    nam(namX, T + 30, 0.8, { eyes: 4, mouth: 3, lookX: 1, armL: 0.3, armR: 0.3 }).draw(sk, 0);
    apple(taoX, T + 40, 0.5, { eyes: 1, mouth: 0, lookX: -1, arms: 0, sweat: 1 }).draw(sk, 0.4);
    table(sk, w, PH2, T);
    place(sk, 650, T + 8, 0.28, -1, () => worm(sk, 'dot', 'flat'));
    sayBox(sk, 400, 70, ['DẠO NÀY CHỊ HAY MỆT LẮM…'], [330, 140], 34);
    sayBox(sk, 700, 200, ['...'], [670, T - 60], 30);
  });

  // 3. Cutaway: what Nấm is picturing.
  panelFrame(sk, py(2), () => {
    const cx = sk.ctx;
    cx.fillStyle = '#FFEFF3'; cx.fillRect(0, 0, w, PH2);
    for (let i = 0; i < 14; i++) sk.blob(rand(i + 700) * w, rand(i + 800) * PH2, 5, 5, nid(), '#FFC7D6');
    sk.line([[0, PH2 - 50], [w, PH2 - 48]], nid(), { width: LW * 0.6, color: '#F2B6C6', amp: 1 });
    nam(230, PH2 - 10, 0.85, { eyes: 1, mouth: 1, blush: 1.4, armL: 2.6, bendL: 1.2, heart: 1 }).draw(sk, 0);
    // thought cloud
    for (const [x, y, r] of [[400, 260, 12], [440, 220, 18]] as [number, number, number][]) sk.shape(ellipse(x, y, r, r, 14), nid(), { fill: '#FFFFFF', width: LW * 0.7 });
    sk.shape(scallop(760, 205, 290, 160, 11, 0.1, 120), nid(), { fill: '#FFFFFF' });
    // plate + fork + knife + Táo as dessert
    sk.shape(ellipse(760, 300, 170, 34, 32), nid(), { fill: '#F4F6FB' });
    sk.shape(ellipse(760, 296, 120, 22, 28), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
    sk.tube([[560, 330], [560, 160]], nid(), 10, '#C9CEDB');
    for (const dx of [-12, 0, 12]) sk.line([[560 + dx, 160], [560 + dx, 125]], nid(), { width: LW * 0.8 });
    sk.tube([[960, 330], [960, 150]], nid(), 12, '#C9CEDB');
    sk.shape([[952, 210], [952, 120], [978, 150], [972, 210]], nid(), { fill: '#E9EDF5', width: LW * 0.7 });
    apple(760, 300, 0.42, { eyes: 0, mouth: 0, legs: 0, arms: 0 }).draw(sk, 0);
    sayBox(sk, 920, 385, ['MỘT QUẢ THÔI MÀ…'], null, 30, '#FFFFFF');
  });

  // 4. Punchline: Táo is now a doctor.
  panelFrame(sk, py(3), () => {
    nightBg(sk, w, PH2); lamp(sk, w / 2 + 10, T + 6);
    nam(namX, T + 30, 0.8, { eyes: 0, mouth: 2, lookX: 0.8 }).draw(sk, 0);
    const s = 0.5;
    apple(taoX, T + 40, s, { eyes: 0, mouth: 0, lookX: -0.5, arms: 0 }).draw(sk, 0);
    place(sk, taoX, T + 40 - 50 * s, s, 1, () => doctorGear(sk));
    table(sk, w, PH2, T);
    place(sk, 650, T + 8, 0.28, -1, () => worm(sk, 'dot', 'flat'));
    sayBox(sk, 960, 70, ['EM LÀ BÁC SĨ.'], [900, 130], 36);
    sayBox(sk, 430, 110, ['À…'], [380, 170], 36);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO Ờ #2 · BÁC SĨ', 26, 'right');
}

// ======================= Táo sticker set =======================
type StickerDef = { name: string; label: string; set: Partial<Apple2D>; extra?: (sk: Sketch, a: Apple2D) => void; t?: number };

function zzz(sk: Sketch): void {
  const c = sk.ctx;
  c.save(); c.fillStyle = INK; c.font = `bold 44px ${FONT_FAMILY}`;
  c.fillText('z', 360, 150); c.font = `bold 56px ${FONT_FAMILY}`; c.fillText('Z', 395, 105); c.restore();
}

function raisedArm(sk: Sketch, a: Apple2D, lean = 0): void {
  place(sk, a.x, a.y - 50 * a.scale, a.scale, 1, () => {
    sk.tube(quad([175, -150], [250 + lean * 20, -200], [255 + lean * 40, -300], 6), nid(), 22, COLORS.apple, 1);
  });
}

export const STICKERS: StickerDef[] = [
  { name: 'o', label: 'Ờ.', set: { eyes: 0, mouth: 0 } },
  { name: 'ha', label: 'HẢ?', set: { eyes: 2, mouth: 2, armL: 0.6, armR: 0.6 } },
  { name: 'haizz', label: 'HAIZZ…', set: { eyes: 4, mouth: 5, sigh: 0.35, tilt: -0.08 } },
  { name: 'ok', label: 'OK', set: { eyes: 3, mouth: 4, armR: Math.PI, sparkle: 1 }, extra: (sk, a) => raisedArm(sk, a) },
  { name: 'chao', label: 'CHÀO NHA', set: { eyes: 3, mouth: 4, armR: Math.PI, armL: 0.3, tilt: -0.06 }, extra: (sk, a) => raisedArm(sk, a, 1) },
  { name: 'ngu', label: 'NGỦ ĐÂY', set: { eyes: 4, mouth: 1, tilt: 0.12, armL: 0.1, armR: 0.1 }, extra: (sk) => zzz(sk) },
  { name: 'that-a', label: 'THẬT À?', set: { eyes: 5, mouth: 3, lookX: 0.6 } },
  { name: 'cham', label: '...', set: { eyes: 1, mouth: 0, dots: 3 } },
  { name: 'cam-on', label: 'CẢM ƠN', set: { eyes: 3, mouth: 4, blush: 1.6, sparkle: 1, armL: 1.2, armR: 1.2 } },
  { name: 'chay', label: 'CHẠY ĐÂY', set: { eyes: 1, mouth: 2, run: 1, speed: 1, tilt: 0.12, armL: 1.6, armR: 2.2 }, t: 0.07 },
  { name: 'toang', label: 'TOANG RỒI', set: { eyes: 2, mouth: 5, sweat: 1, armL: 2.5, armR: 2.5 } },
  { name: 'bac-si', label: 'EM LÀ BÁC SĨ', set: { eyes: 0, mouth: 0 }, extra: (sk, a) => place(sk, a.x, a.y - 50 * a.scale, a.scale, 1, () => doctorGear(sk)) },
];

function drawStickerArt(c: CanvasRenderingContext2D, d: StickerDef): void {
  const sk = new Sketch(c);
  sk.seed = 4;
  sk.setCamera(new DOMMatrix());
  uid = 7000;
  const a = apple(256, 405, 0.56, d.set);
  a.draw(sk, d.t ?? 0);
  d.extra?.(sk, a);
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.font = `60px ${FONT_FAMILY}`;
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  let size = 60;
  while (c.measureText(d.label).width > 420 && size > 30) { size -= 4; c.font = `${size}px ${FONT_FAMILY}`; }
  c.lineJoin = 'round';
  c.lineWidth = 14; c.strokeStyle = '#FFFFFF'; c.strokeText(d.label, 256, 480);
  c.fillStyle = INK; c.fillText(d.label, 256, 480);
}

/** Renders one 512x512 die-cut sticker (white border around everything, soft shadow). */
export function sticker(d: StickerDef): HTMLCanvasElement {
  const S = 512;
  const art = document.createElement('canvas'); art.width = S; art.height = S;
  drawStickerArt(art.getContext('2d')!, d);
  // white silhouette
  const sil = document.createElement('canvas'); sil.width = S; sil.height = S;
  const sc = sil.getContext('2d')!;
  sc.drawImage(art, 0, 0); sc.globalCompositeOperation = 'source-in'; sc.fillStyle = '#FFFFFF'; sc.fillRect(0, 0, S, S);
  const out = document.createElement('canvas'); out.width = S; out.height = S;
  const oc = out.getContext('2d')!;
  // shrink a bit so the border never clips
  oc.translate(S / 2, S / 2); oc.scale(0.92, 0.92); oc.translate(-S / 2, -S / 2);
  const r = 13;
  oc.save();
  oc.shadowColor = 'rgba(40,44,60,0.25)'; oc.shadowBlur = 10; oc.shadowOffsetY = 4;
  for (let i = 0; i < 32; i++) { const ang = (i / 32) * Math.PI * 2; oc.drawImage(sil, Math.cos(ang) * r, Math.sin(ang) * r); }
  oc.restore();
  for (let i = 0; i < 32; i++) { const ang = (i / 32) * Math.PI * 2; oc.drawImage(sil, Math.cos(ang) * r, Math.sin(ang) * r); }
  oc.drawImage(art, 0, 0);
  // center the content in the 512 square (with a margin)
  const px = oc.getImageData(0, 0, S, S).data;
  let x0 = S, y0 = S, x1 = 0, y1 = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (px[(y * S + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const fin = document.createElement('canvas'); fin.width = S; fin.height = S;
  const k = Math.min((S - 24) / (x1 - x0 + 1), (S - 24) / (y1 - y0 + 1));
  const w = (x1 - x0 + 1) * k, h = (y1 - y0 + 1) * k;
  fin.getContext('2d')!.drawImage(out, x0, y0, x1 - x0 + 1, y1 - y0 + 1, (S - w) / 2, (S - h) / 2, w, h);
  return fin;
}

// ======================= Strip #3: contest (wide / 2 close-ups / wide) =======================
function frameAt(sk: Sketch, x: number, y: number, w: number, h: number, draw: (w: number, h: number) => void): void {
  const c = sk.ctx;
  const pts = rrectPts(x, y, w, h, 18);
  c.save();
  sk.trace(pts, true); c.clip();
  sk.setCamera(new DOMMatrix().translate(x, y));
  draw(w, h);
  c.restore();
  sk.setCamera(new DOMMatrix());
  sk.trace(sk.wobble(pts, nid(), 1), true);
  c.lineWidth = sk.px(LW * 1.3); c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke();
}

function park(sk: Sketch, w: number, h: number, ground: number): void {
  const c = sk.ctx;
  c.fillStyle = '#C9EBFF'; c.fillRect(0, 0, w, h);
  for (const [x, y, rx] of [[120, 70, 70], [760, 50, 90]] as [number, number, number][]) sk.shape(scallop(x, y, rx, rx * 0.45, 5, 0.18, 48), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  // trees
  for (const [x, r] of [[40, 120], [900, 140], [w - 10, 110]] as [number, number][]) {
    sk.tube([[x, ground], [x, ground - r * 1.2]], nid(), 34, '#C79A6B');
    sk.shape(scallop(x, ground - r * 1.6, r, r * 0.8, 7, 0.16, 60), nid(), { fill: '#9ADB8F' });
  }
  sk.shape(scallop(w / 2, ground - 20, w * 0.55, 60, 14, 0.12, 120), nid(), { fill: '#B5E3A1', width: LW * 0.7 });
  c.fillStyle = '#CBEBB0'; c.fillRect(0, ground, w, h - ground);
  sk.line([[0, ground], [w / 2, ground + 3], [w, ground]], nid(), { width: LW * 0.8, amp: 1.5 });
  for (let i = 0; i < 12; i++) {
    const x = rand(i + 900) * w, y = ground + 20 + rand(i + 950) * (h - ground - 30);
    sk.line([[x - 8, y], [x - 3, y - 12], [x, y], [x + 4, y - 14], [x + 8, y]], nid(), { width: LW * 0.4, color: '#7FBF6E', amp: 0.4 });
  }
}

function mic(sk: Sketch, x: number, y: number, ang = -0.4): void {
  const hx = x + Math.sin(ang) * 70, hy = y - Math.cos(ang) * 70;
  sk.tube([[x, y], [hx, hy]], nid(), 14, '#3B3F4C');
  sk.shape(ellipse(hx, hy, 22, 22, 18), nid(), { fill: '#C9CEDB' });
  sk.line([[hx - 14, hy - 4], [hx + 14, hy - 4]], nid(), { width: LW * 0.35, color: '#8C93A6' });
  sk.line([[hx - 14, hy + 6], [hx + 14, hy + 6]], nid(), { width: LW * 0.35, color: '#8C93A6' });
}

function tension(sk: Sketch, w: number, h: number, bg: string, cx: number, cy: number): void {
  const c = sk.ctx;
  c.fillStyle = bg; c.fillRect(0, 0, w, h);
  c.save(); c.globalAlpha = 0.35;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + rand(i + 1200) * 0.1, r0 = 200 + rand(i + 1300) * 60;
    sk.line([[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * 700, cy + Math.sin(a) * 700]], nid(), { width: LW * 0.5, color: '#FFFFFF', amp: 0.3 });
  }
  c.restore();
}

function drop(sk: Sketch, x: number, y: number, s = 1): void {
  sk.shape([[x, y - 26 * s], [x + 12 * s, y - 2 * s], [x + 10 * s, y + 12 * s], [x, y + 18 * s], [x - 10 * s, y + 12 * s], [x - 12 * s, y - 2 * s]], nid(), { fill: '#A9DBFF', width: LW * 0.6, amp: 0.4 });
}

function medal(sk: Sketch, x: number, y: number): void {
  sk.line([[x - 18, y - 40], [x, y], [x + 18, y - 40]], nid(), { width: LW * 0.8, color: '#FF8C82' });
  sk.shape(ellipse(x, y + 14, 20, 20, 18), nid(), { fill: '#FFD86B', width: LW * 0.7 });
  sk.blob(x, y + 14, 6, 6, nid(), '#F5B93C');
}

export function strip3(c: CanvasRenderingContext2D): void {
  const W = 1000, M = 20, G3 = 22;
  const h1 = 470, h2 = 400, h3 = 470;
  c.canvas.width = W;
  c.canvas.height = M + h1 + G3 + h2 + G3 + h3 + 60;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 5;
  sk.setCamera(new DOMMatrix());
  uid = 9000;
  const fw = W - 2 * M;

  // 1. The contest has been going on for two hours.
  frameAt(sk, M, M, fw, h1, (w, h) => {
    const gy = h - 50;
    park(sk, w, h, gy - 40);
    nam(140, gy + 10, 0.62, { eyes: 1, mouth: 1, armR: 1.4 }).draw(sk, 0);
    mic(sk, 250, gy - 55, -0.15);
    place(sk, 760, gy + 10, 0.32, -1, () => worm(sk, 'dot', 'flat'));
    place(sk, 420, gy + 8, 0.55, 1, () => duck(sk, 'closed', 'closed', 0.3));
    apple(600, gy + 8, 0.42, { eyes: 0, mouth: 0, lookX: -0.8, flip: -1 }).draw(sk, 0);
    sayBox(sk, 560, 92, ['THƯA CẢ NHÀ! CUỘC THI "AI IM LÂU NHẤT"', 'ĐÃ KÉO DÀI 2 TIẾNG. CHƯA AI MỞ MIỆNG!'], [250, 190], 28);
  });

  // 2a. Close-up: Vịt is about to burst.
  const y2 = M + h1 + G3, w2 = (fw - G3) / 2;
  frameAt(sk, M, y2, w2, h2, (w, h) => {
    tension(sk, w, h, '#FFE7A8', w / 2, h / 2);
    place(sk, w / 2 + 10, h + 140, 1.75, 1, () => duck(sk, 'closed', 'closed', 0.3));
    drop(sk, w / 2 + 160, 120, 1.3); drop(sk, w / 2 - 170, 150, 1);
    sayBox(sk, 200, 52, ['(SẮP KHÔNG NHỊN NỔI…)'], null, 26);
  });

  // 2b. Close-up: Táo is perfectly fine.
  frameAt(sk, M + w2 + G3, y2, w2, h2, (w, h) => {
    tension(sk, w, h, '#FFD9D4', w / 2 - 20, h / 2 + 40);
    apple(w / 2 - 20, h + 50, 1.25, { eyes: 0, mouth: 0, legs: 0, arms: 0 }).draw(sk, 0);
    for (const [x, y, r] of [[w - 120, 150, 8], [w - 100, 120, 12]] as [number, number, number][]) sk.shape(ellipse(x, y, r, r, 12), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
    sk.shape(scallop(w - 140, 62, 120, 42, 7, 0.14, 60), nid(), { fill: '#FFFFFF', width: LW * 0.8 });
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `26px ${FONT_FAMILY}`; sk.ctx.textAlign = 'center';
    sk.ctx.fillText('TỐI NAY ĂN GÌ NHỈ', w - 140, 72); sk.ctx.restore();
  });

  // 3. Twist: the one who never talks wins.
  const y3 = y2 + h2 + G3;
  frameAt(sk, M, y3, fw, h3, (w, h) => {
    const gy = h - 50;
    park(sk, w, h, gy - 40);
    nam(170, gy + 10, 0.62, { eyes: 1, mouth: 1, armR: 1.4 }).draw(sk, 0);
    mic(sk, 280, gy - 55, -0.15);
    place(sk, 420, gy + 8, 0.55, 1, () => duck(sk, 'shock', 'open', -2.4));
    apple(620, gy + 8, 0.42, { eyes: 0, mouth: 0, lookX: 0.6, flip: -1 }).draw(sk, 0);
    place(sk, 820, gy + 10, 0.32, -1, () => worm(sk, 'dot', 'flat'));
    sk.shape([[768, gy - 52], [772, gy - 82], [784, gy - 64], [796, gy - 88], [806, gy - 64], [818, gy - 82], [820, gy - 52]], nid(), { fill: '#FFD86B', width: LW * 0.7, amp: 0.4 });
    for (let i = 0; i < 6; i++) sk.blob(700 + rand(i + 1500) * 220, 120 + rand(i + 1600) * 120, 7, 7, nid(), ['#FFB3C6', '#FFE58A', '#CDB4FF'][i % 3]);
    sayBox(sk, 230, 80, ['SÂU THẮNG!'], [220, 200], 34);
    sayBox(sk, 470, 190, ['CÁI GÌ CƠ?!'], [440, 290], 32);
    sayBox(sk, 690, 110, ['Ờ.'], [650, 230], 34);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W - 24, c.canvas.height - 20, 'TÁO #3 · AI IM LÂU NHẤT', 26, 'right');
}

// ======================= Parents (humans) =======================
const HUM = {
  skin: '#FFE6D5', skinShade: '#F7D2BD',
  dadHair: '#4A4F63', shirt: '#CDE8B5', shirtShade: '#B3D998', pants: '#A99C8C', shoe: '#5C5248',
  momHair: '#8A5A44', momHairShade: '#74493A', dress: '#AFCBFF', dressShade: '#8FB2F2', collar: '#FFFFFF', momShoe: '#5B7BD6', bow: '#7FA8F0',
};

function hands(sk: Sketch, pts: Pt[]): void { for (const [x, y] of pts) sk.shape(ellipse(x, y, 17, 17, 14), nid(), { fill: HUM.skin, width: LW * 0.8 }); }

/** Ba: tall, slim, neat side-swept hair, light shirt, navy trousers. Origin at feet. */
export function dad2(sk: Sketch, eyes: Eye = 'dot', mouth: Mouth = 'smile', wave = false): void {
  // legs + shoes
  for (const s of [-1, 1]) {
    sk.tube([[s * 30, -250], [s * 32, -26]], nid(), 40, HUM.pants);
    sk.shape(ellipse(s * 40, -14, 34, 16, 18), nid(), { fill: HUM.shoe, width: LW * 0.8 });
  }
  // arms (behind torso)
  const handL: Pt = [-100, -250];
  const handR: Pt = wave ? [150, -560] : [100, -250];
  sk.tube(quad([-70, -440], [-100, -350], handL, 6), nid(), 32, HUM.shirt);
  sk.tube(quad([70, -440], wave ? [140, -470] : [100, -350], handR, 6), nid(), 32, HUM.shirt);
  hands(sk, [handL, handR]);
  // torso (shirt tucked in)
  filled(sk, rrectPts(-78, -470, 156, 240, 42, 6), HUM.shirt, HUM.shirtShade, [-10, -6], false);
  sk.line([[-78, -250], [0, -246], [78, -250]], nid(), { width: LW * 0.7 });
  sk.shape([[-22, -470], [0, -438], [22, -470]], nid(), { fill: HUM.skin, width: LW * 0.7 });
  sk.line([[0, -436], [0, -270]], nid(), { width: LW * 0.4, color: '#93C27A' });
  for (const y of [-410, -360, -310]) sk.blob(0, y, 4, 4, nid(), '#93C27A');
  sk.shape(rrectPts(26, -420, 34, 30, 6, 3), nid(), { fill: '#B3D998', width: LW * 0.5 });
  // head
  const hy = -570;
  filled(sk, ellipse(0, hy, 100, 94, 40), HUM.skin, HUM.skinShade, [-8, -6], false);
  // hair: plain short cut, a bit messy, one cowlick
  sk.shape([[-104, hy - 2], [-102, hy - 56], [-70, hy - 94], [-20, hy - 110], [40, hy - 106], [86, hy - 80], [106, hy - 30], [104, hy - 2], [88, hy - 36], [70, hy - 44], [56, hy - 30], [40, hy - 52], [16, hy - 40], [-6, hy - 58], [-30, hy - 42], [-56, hy - 56], [-80, hy - 34]], nid(), { fill: HUM.dadHair });
  sk.line(quad([10, hy - 106], [0, hy - 140], [30, hy - 146], 5), nid(), { width: LW * 1.1 });
  // ears
  for (const s of [-1, 1]) sk.shape(ellipse(s * 100, hy + 6, 14, 20, 12), nid(), { fill: HUM.skin, width: LW * 0.7 });
  face(sk, 0, hy + 10, 0.8, eyes, mouth, COLORS.appleBlush, 0.95);
}

/** Mẹ: shorter, round face, wavy bob with a bow, A-line dress with a round white collar. */
export function mom2(sk: Sketch, eyes: Eye = 'happy', mouth: Mouth = 'smile', wave = false): void {
  const hy = -455;
  // back hair
  sk.shape([[-108, hy - 10], [-116, hy + 90], [-112, hy + 200], [-96, hy + 236], [-60, hy + 222], [60, hy + 222], [96, hy + 236], [112, hy + 200], [116, hy + 90], [108, hy - 10], [80, hy - 80], [0, hy - 104], [-80, hy - 80]], nid(), { fill: HUM.momHair });
  // legs + shoes
  for (const s of [-1, 1]) {
    sk.tube([[s * 26, -110], [s * 28, -24]], nid(), 26, HUM.skin);
    sk.shape(ellipse(s * 32, -14, 26, 14, 16), nid(), { fill: HUM.momShoe, width: LW * 0.8 });
  }
  // arms
  const handL: Pt = [-108, -230];
  const handR: Pt = wave ? [140, -440] : [108, -230];
  sk.tube(quad([-52, -340], [-90, -290], handL, 6), nid(), 24, HUM.skin);
  sk.tube(quad([52, -340], wave ? [120, -360] : [90, -290], handR, 6), nid(), 24, HUM.skin);
  hands(sk, [handL, handR]);
  // dress
  const dress: Pt[] = [[-50, -362], [50, -362], [70, -300], [138, -100], ...quad([138, -100], [0, -78], [-138, -100], 8).slice(1, -1), [-138, -100], [-70, -300]];
  filled(sk, dress, HUM.dress, HUM.dressShade, [-10, -6], false);
  for (let i = 0; i < 5; i++) sk.blob(-84 + i * 42, -150 + (i % 2) * 18, 6, 6, nid(), '#FFFFFF');
  // round collar
  for (const s of [-1, 1]) sk.shape([[0, -360], [s * 50, -362], [s * 44, -334], [s * 14, -330]], nid(), { fill: HUM.collar, width: LW * 0.7 });
  // head + fringe
  filled(sk, ellipse(0, hy, 94, 88, 40), HUM.skin, HUM.skinShade, [-8, -6], false);
  sk.shape([[-98, hy + 10], [-96, hy - 50], [-50, hy - 92], [20, hy - 98], [80, hy - 70], [100, hy - 10], [70, hy - 36], [40, hy - 52], [10, hy - 40], [-20, hy - 54], [-50, hy - 40], [-80, hy - 20]], nid(), { fill: HUM.momHair });
  // bow
  const bx = 70, by = hy - 76;
  for (const s of [-1, 1]) sk.shape([[bx, by], [bx + s * 34, by - 20], [bx + s * 36, by + 18]], nid(), { fill: HUM.bow, width: LW * 0.7 });
  sk.shape(ellipse(bx, by, 10, 10, 10), nid(), { fill: HUM.bow, width: LW * 0.7 });
  face(sk, 0, hy + 10, 0.9, eyes, mouth, '#FF7F97', 0.85);
}

export function family2(c: CanvasRenderingContext2D): void {
  c.canvas.width = 1600; c.canvas.height = 900;
  const sk = frame(c);
  const G = 740;
  text(c, 800, 90, 'NHÀ TÁO', 70);
  text(c, 800, 140, 'phác thảo Ba & Mẹ', 30);
  ground(sk, G, 60, 1540);
  place(sk, 330, G, 0.92, 1, () => dad2(sk, 'dot', 'smile', true));
  place(sk, 640, G, 0.92, 1, () => mom2(sk, 'happy', 'smile'));
  nam(920, G, 0.68, { eyes: 1, mouth: 1, blink: 0 }).draw(sk, 0);
  apple(1170, G, 0.46, { eyes: 0, mouth: 0, lookX: -0.4 }).draw(sk, 0);
  place(sk, 1370, G, 0.36, -1, () => worm(sk, 'dot', 'flat'));
  label(c, 330, G + 70, 'Ba', 'cao, gầy, hiền');
  label(c, 640, G + 70, 'Mẹ', 'tóc dài, mê màu xanh dương');
  label(c, 920, G + 70, 'Nấm', 'chị');
  label(c, 1170, G + 70, 'Táo', '"Ờ."');
  label(c, 1370, G + 70, 'Sâu', '"..."');
}

// ======================= Strip #4: "Từ mai" (same frame twice, props show time passing) =======================
function door(sk: Sketch, x: number, top: number, bottom: number): void {
  sk.shape(rrectPts(x, top, 110, bottom - top, 10, 3), nid(), { fill: '#F5C66A' });
  sk.blob(x + 88, (top + bottom) / 2, 8, 8, nid(), INK);
}

function clock(sk: Sketch, x: number, y: number, ring = false): void {
  if (ring) for (const s of [-1, 1]) for (let i = 0; i < 2; i++) sk.line(quad([x + s * (70 + i * 18), y - 50 - i * 10], [x + s * (84 + i * 18), y - 10], [x + s * (70 + i * 18), y + 30 + i * 10], 5), nid(), { width: LW * 0.6, color: '#FFFFFF' });
  for (const s of [-1, 1]) sk.shape(ellipse(x + s * 34, y - 50, 18, 14, 14), nid(), { fill: '#FF8C82', width: LW * 0.7 });
  for (const s of [-1, 1]) sk.line([[x + s * 30, y + 40], [x + s * 42, y + 58]], nid(), { width: LW * 0.8 });
  sk.shape(ellipse(x, y, 52, 52, 28), nid(), { fill: '#FF8C82' });
  sk.shape(ellipse(x, y, 38, 38, 24), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  sk.line([[x, y], [x, y - 26]], nid(), { width: LW * 0.6 });
  sk.line([[x, y], [x + 2, y + 24]], nid(), { width: LW * 0.5 });
}

function calendar(sk: Sketch, x: number, y: number, crossed: number): void {
  sk.shape(rrectPts(x - 70, y - 70, 140, 140, 10, 3), nid(), { fill: '#FFFFFF', width: LW * 0.8 });
  sk.shape(rrectPts(x - 70, y - 70, 140, 34, 8, 3), nid(), { fill: '#FF8C82', width: LW * 0.8 });
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) {
    const i = r * 5 + q, cx = x - 52 + q * 26, cy = y - 18 + r * 22;
    if (i < crossed) { sk.line([[cx - 8, cy - 7], [cx + 8, cy + 7]], nid(), { width: LW * 0.4, color: '#E2627A', amp: 0.3 }); sk.line([[cx + 8, cy - 7], [cx - 8, cy + 7]], nid(), { width: LW * 0.4, color: '#E2627A', amp: 0.3 }); }
    else sk.blob(cx, cy, 3, 3, nid(), '#B7BCCB');
  }
}

function cobweb(sk: Sketch, x: number, y: number, r: number): void {
  for (let i = 0; i <= 4; i++) { const a = (i / 4) * (Math.PI / 2); sk.line([[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], nid(), { width: LW * 0.3, color: '#FFFFFF', amp: 0.3 }); }
  for (const k of [0.35, 0.65, 0.95]) { const pts: Pt[] = []; for (let i = 0; i <= 4; i++) { const a = (i / 4) * (Math.PI / 2); pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]); } sk.line(pts, nid(), { width: LW * 0.3, color: '#FFFFFF', amp: 0.3 }); }
}

function headband(sk: Sketch): void {
  sk.tube(quad([-205, -250], [0, -300], [205, -250], 8), nid(), 34, '#FFFFFF');
  sk.line(quad([-205, -250], [0, -300], [205, -250], 8), nid(), { width: LW * 0.6, color: '#7FA8F0' });
  sk.tube([[200, -250], [250, -210]], nid(), 16, '#FFFFFF');
  sk.tube([[200, -250], [255, -270]], nid(), 16, '#FFFFFF');
}

function puff(sk: Sketch, x: number, y: number, s = 1): void {
  sk.shape(scallop(x, y, 26 * s, 20 * s, 5, 0.25, 30), nid(), { fill: '#FFFFFF', width: LW * 0.7 });
}

function room(sk: Sketch, w: number, h: number, crossed: number, dusty: boolean): void {
  nightBg(sk, w, h);
  door(sk, 40, 150, h + 10);
  // shelf + clock + calendar on the right
  calendar(sk, 1050, 140, crossed);
  sk.shape(rrectPts(800, 270, 300, 22, 6, 2), nid(), { fill: '#C79A6B', width: LW * 0.8 });
  clock(sk, 900, 210);
  if (dusty) { cobweb(sk, 852, 160, 56); headbandOnShelf(sk, 1040, 268); }
}

function headbandOnShelf(sk: Sketch, x: number, y: number): void {
  sk.shape(ellipse(x, y - 10, 50, 12, 20), nid(), { fill: '#FFFFFF', width: LW * 0.7 });
  sk.line(quad([x - 46, y - 10], [x, y - 2], [x + 46, y - 10], 6), nid(), { width: LW * 0.5, color: '#7FA8F0' });
  cobweb(sk, x - 50, y - 60, 46);
}

export function strip4(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 3 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 6;
  sk.setCamera(new DOMMatrix());
  uid = 11000;
  const w = W2 - 40;
  const py = (i: number) => GAP + i * (PH2 + GAP);

  const sisterScene = (crossed: number, dusty: boolean, lines: string[], taoLine: string, taoMouth: number) => {
    room(sk, w, PH2, crossed, dusty);
    nam(330, PH2 + 10, 0.8, { eyes: 1, mouth: 1, armR: 2.3, bendR: 0.5, capLift: 4 }).draw(sk, 0);
    puff(sk, 180, 170, 1); puff(sk, 480, 150, 1.2);
    apple(620, PH2 + 50, 0.5, { eyes: 0, mouth: taoMouth, lookX: -0.8 }).draw(sk, 0);
    sayBox(sk, 560, 64, lines, [400, 150], 30);
    if (taoLine) sayBox(sk, 760, 240, [taoLine], [690, 290], 30);
  };

  // 1. The plan.
  panelFrame(sk, py(0), () => sisterScene(0, false, ['TỪ MAI CHỊ EM MÌNH DẬY 5 GIỜ', 'TẬP THỂ DỤC! CHỊ HỨA!'], 'Ờ.', 0));

  // 2. 5:00 a.m. Táo is ready. Nấm is not.
  panelFrame(sk, py(1), () => {
    const cx = sk.ctx;
    cx.fillStyle = '#FFE3C9'; cx.fillRect(0, 0, w, PH2);
    // window with sunrise
    sk.shape(rrectPts(70, 50, 220, 170, 12, 3), nid(), { fill: '#FFD6A5' });
    sk.shape(ellipse(180, 210, 50, 50, 24), nid(), { fill: '#FFB561', width: LW * 0.6 });
    sk.line([[70, 135], [290, 135]], nid(), { width: LW * 0.7 }); sk.line([[180, 50], [180, 220]], nid(), { width: LW * 0.7 });
    sk.shape(rrectPts(70, 50, 220, 170, 12, 3), nid(), { width: LW });
    // bed with sleeping Nấm (lying on her side, tucked in)
    sk.shape(rrectPts(600, PH2 - 50, 520, 80, 10, 3), nid(), { fill: '#C79A6B' });
    sk.shape(ellipse(1020, PH2 - 70, 90, 30, 24), nid(), { fill: '#FFFFFF' });
    nam(760, PH2 - 105, 0.62, { eyes: 2, mouth: 3, tilt: 1.57, blink: 0, breath: 0 }).draw(sk, 0);
    sk.shape(rrectPts(610, PH2 - 140, 182, 100, 24, 4), nid(), { fill: '#AFCBFF' });
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `bold 44px ${FONT_FAMILY}`; sk.ctx.fillText('Z', 960, 110); sk.ctx.font = `bold 32px ${FONT_FAMILY}`; sk.ctx.fillText('z', 925, 150); sk.ctx.restore();
    // Táo ready with headband, alarm ringing
    const s = 0.5;
    apple(440, PH2 - 30, s, { eyes: 0, mouth: 0, lookX: 0.8 }).draw(sk, 0);
    place(sk, 440, PH2 - 30 - 50 * s, s, 1, () => headband(sk));
    clock(sk, 250, PH2 - 75, true);
    sayBox(sk, 200, 262, ['RENG RENG!'], null, 30, '#FFF1B8');
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `30px ${FONT_FAMILY}`; sk.ctx.textAlign = 'right'; sk.ctx.fillText('5:00 SÁNG', w - 30, 50); sk.ctx.restore();
  });

  // 3. Same scene, a month later.
  panelFrame(sk, py(2), () => sisterScene(20, true, ['TỪ MAI CHỊ EM MÌNH DẬY 5 GIỜ', 'TẬP THỂ DỤC! LẦN NÀY CHỊ HỨA THẬT!'], 'Ờ.', 0));

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO Ờ #3 · TỪ MAI', 26, 'right');
}

// ======================= Strip #5: "Điểm kém" =======================
function phoneOnDesk(sk: Sketch, x: number, y: number, dusty: boolean): void {
  sk.shape(rrectPts(x - 130, y, 260, 26, 6, 2), nid(), { fill: '#C79A6B', width: LW * 0.8 });
  sk.tube([[x - 110, y + 26], [x - 110, y + 200]], nid(), 18, '#C79A6B');
  sk.tube([[x + 110, y + 26], [x + 110, y + 200]], nid(), 18, '#C79A6B');
  // phone on a little stand
  sk.shape([[x - 30, y], [x + 30, y], [x + 10, y - 30], [x - 10, y - 30]], nid(), { fill: '#8C93A6', width: LW * 0.6 });
  sk.shape(rrectPts(x - 52, y - 150, 104, 130, 14, 4), nid(), { fill: '#3B3F4C' });
  const c = sk.ctx;
  if (dusty) {
    c.fillStyle = '#2E313C'; c.fillRect(x - 40, y - 138, 80, 106);
    cobweb(sk, x - 40, y - 138, 70);
    cobweb(sk, x + 44, y - 32, 40);
  } else {
    c.fillStyle = '#BFE3A2'; c.fillRect(x - 40, y - 138, 80, 106);
    c.save(); c.fillStyle = '#E2627A'; c.font = `bold 22px ${FONT_FAMILY}`; c.textAlign = 'center'; c.fillText('THUA', x, y - 80); c.restore();
    sk.line([[x - 20, y - 60], [x + 20, y - 60]], nid(), { width: LW * 0.4, color: '#7FBF6E' });
  }
}

function testPaper(sk: Sketch, x: number, y: number, rot = 0.15): void {
  const c = sk.ctx;
  c.save(); c.translate(x, y); c.rotate(rot);
  sk.shape(rrectPts(-50, -70, 100, 140, 6, 2), nid(), { fill: '#FFFFFF', width: LW * 0.7 });
  for (let i = 0; i < 4; i++) sk.line([[-34, -30 + i * 20], [20, -30 + i * 20]], nid(), { width: LW * 0.3, color: '#B7BCCB', amp: 0.3 });
  c.fillStyle = '#E2627A'; c.font = `bold 46px ${FONT_FAMILY}`; c.textAlign = 'center'; c.fillText('2', 22, -26);
  sk.shape(ellipse(22, -42, 28, 28, 18), nid(), { width: LW * 0.4, amp: 0.6 });
  c.restore();
}

function angryBrows(sk: Sketch, x: number, y: number, k: number): void {
  for (const s of [-1, 1]) sk.line([[x + s * 70 * k, y - 34 * k], [x + s * 22 * k, y - 18 * k]], nid(), { width: LW * 1.1 });
}

export function strip5(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 3 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 7;
  sk.setCamera(new DOMMatrix());
  uid = 13000;
  const w = W2 - 40;
  const py = (i: number) => GAP + i * (PH2 + GAP);

  const rant = (lines: string[], dusty: boolean, taoMouth: number, taoLine = '') => {
    nightBg(sk, w, PH2);
    door(sk, 40, 150, PH2 + 10);
    phoneOnDesk(sk, 960, PH2 - 150, dusty);
    const ns = 0.8, nx = 320, ny = PH2 + 10;
    nam(nx, ny, ns, { eyes: 0, mouth: 2, armR: 1.6, bendR: 0.3 }).draw(sk, 0);
    angryBrows(sk, nx, ny - 102 * ns, ns);
    puff(sk, 150, 200, 1); puff(sk, 500, 150, 1.1);
    testPaper(sk, 500, PH2 - 150);
    apple(660, PH2 + 50, 0.5, { eyes: 0, mouth: taoMouth, lookX: -0.8 }).draw(sk, 0);
    if (taoLine) sayBox(sk, 790, 205, [taoLine], [700, 255], 30);
    else { sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `28px ${FONT_FAMILY}`; sk.ctx.fillText('?', 720, 210); sk.ctx.fillText('?', 745, 190); sk.ctx.restore(); }
    sayBox(sk, 620, 74, lines, [430, 160], 31);
  };

  // 1. The accusation.
  panelFrame(sk, py(0), () => rant(['BA MẸ LÚC NÀO CŨNG NGHĨ TỤI MÌNH', 'ĐIỂM KÉM LÀ TẠI ĐIỆN THOẠI..'], false, 0));

  // 2. The plan: put the phone away and study hard.
  panelFrame(sk, py(1), () => {
    nightBg(sk, w, PH2);
    const T = PH2 - 70;
    lamp(sk, 420, T + 6);
    apple(720, T + 40, 0.55, { eyes: 1, mouth: 0, lookX: -0.3, lookY: 0.6, arms: 0 }).draw(sk, 0);
    table(sk, w, PH2, T);
    for (let i = 0; i < 4; i++) sk.shape(rrectPts(500, T - 30 - i * 28, 110, 28, 4, 2), nid(), { fill: ['#AFCBFF', '#FFFFFF', '#CDE8B5', '#FFC2D1'][i], width: LW * 0.7 });
    book(sk, 720, T - 28);
    sayBox(sk, 300, 90, ['VẬY NÊN CẤT ĐIỆN THOẠI ĐI', 'VÀ HỌC THẬT CHĂM CHỈ,'], [380, 190], 31);
  });

  // 3. Same scene, weeks later: the real reason.
  panelFrame(sk, py(2), () => rant(['ĐỂ CHỨNG MINH LÀ KHÔNG CÓ ĐIỆN THOẠI', 'TỤI MÌNH VẪN ĐIỂM KÉM.'], true, 0, 'Ờ.'));

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'Táo Ờ', 26, 'right');
}

// ======================= Strip #6: "Thèm gì" (with Ba & Mẹ) =======================
function livingRoom(sk: Sketch, w: number, h: number): void {
  const c = sk.ctx;
  c.fillStyle = '#FFF3E4'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) sk.blob(30 + (i % 13) * 90 + (Math.floor(i / 13) % 2) * 45, 40 + Math.floor(i / 13) * 70, 4, 4, nid(), '#F4DCC2');
  // window + frame on the wall
  sk.shape(rrectPts(w - 230, 30, 180, 140, 10, 3), nid(), { fill: '#C9EBFF' });
  sk.line([[w - 140, 30], [w - 140, 170]], nid(), { width: LW * 0.7 });
  sk.shape(rrectPts(70, 40, 110, 80, 6, 2), nid(), { fill: '#FFE7A3' });
  sk.shape(scallop(125, 85, 30, 18, 5, 0.2, 30), nid(), { fill: '#9ADB8F', width: LW * 0.5 });
  c.fillStyle = '#E8D3B8'; c.fillRect(0, h - 60, w, 60);
}

function sofaBack(sk: Sketch, x0: number, x1: number, top: number, seat: number): void {
  sk.shape(rrectPts(x0, top, x1 - x0, seat - top + 40, 30, 5), nid(), { fill: '#AFCBFF' });
}
function sofaFront(sk: Sketch, x0: number, x1: number, seat: number, h: number): void {
  sk.shape(rrectPts(x0 - 20, seat, x1 - x0 + 40, h - seat + 20, 18, 4), nid(), { fill: '#8FB2F2' });
  for (const x of [x0 - 30, x1 - 30]) sk.shape(rrectPts(x, seat - 70, 60, h - seat + 90, 24, 4), nid(), { fill: '#9DBCF5' });
}

function durian(sk: Sketch, x: number, y: number, r: number): void {
  const pts: Pt[] = [];
  const n = 36;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const k = i % 2 ? 1 : 1.16; pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * 0.9 * k]); }
  sk.shape(pts, nid(), { fill: '#C9DB6A', amp: 0.8 });
  for (let i = 0; i < 6; i++) { const a = rand(i + 2000) * Math.PI * 2, d = rand(i + 2100) * r * 0.6; sk.line([[x + Math.cos(a) * d - 6, y + Math.sin(a) * d + 4], [x + Math.cos(a) * d, y + Math.sin(a) * d - 6], [x + Math.cos(a) * d + 6, y + Math.sin(a) * d + 4]], nid(), { width: LW * 0.4, color: '#9DAE45', amp: 0.3 }); }
  sk.tube([[x, y - r * 0.9], [x + 6, y - r * 1.2]], nid(), 10, COLORS.stem);
  face(sk, x, y - 6, 0.5, 'half', 'flat', COLORS.appleBlush, 1.4);
}

export function strip6(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 8;
  sk.setCamera(new DOMMatrix());
  uid = 15000;
  const w = W2 - 40, H = PH2;
  const py = (i: number) => GAP + i * (PH2 + GAP);
  const seat = H - 70, sx0 = 330, sx1 = 830;

  const family = (opts: { dadEyes: Eye; dadMouth: Mouth; momEyes: Eye; momMouth: Mouth; sweat: boolean; namEyes: number; namMouth: number; taoEyes: number }) => {
    livingRoom(sk, w, H);
    place(sk, 230, H + 120, 0.6, 1, () => dad2(sk, opts.dadEyes, opts.dadMouth));
    place(sk, 940, H + 110, 0.62, -1, () => mom2(sk, opts.momEyes, opts.momMouth));
    sofaBack(sk, sx0, sx1, seat - 150, seat);
    nam(470, seat + 10, 0.55, { eyes: opts.namEyes, mouth: opts.namMouth, lookX: -0.4, armL: 2.4, bendL: 0.4 }).draw(sk, 0);
    apple(690, seat + 10, 0.36, { eyes: opts.taoEyes, mouth: 0, lookX: 0.6 }).draw(sk, 0);
    sofaFront(sk, sx0, sx1, seat, H);
    place(sk, 820, seat - 70, 0.22, -1, () => worm(sk, 'dot', 'flat'));
    if (opts.sweat) { drop(sk, 300, 120, 1.1); drop(sk, 880, 150, 1.1); }
  };

  // 1. Nấm asks the big question.
  panelFrame(sk, py(0), () => {
    family({ dadEyes: 'dot', dadMouth: 'smile', momEyes: 'happy', momMouth: 'smile', sweat: false, namEyes: 0, namMouth: 2, taoEyes: 0 });
    sayBox(sk, 560, 70, ['BA MẸ ƠI! SAO CON LÀ CÂY NẤM,', 'CÒN EM LÀ QUẢ TÁO VẬY?'], [480, 190], 31);
  });

  // 2. Awkward silence.
  panelFrame(sk, py(1), () => {
    family({ dadEyes: 'shock', dadMouth: 'flat', momEyes: 'dot', momMouth: 'wavy', sweat: true, namEyes: 0, namMouth: 3, taoEyes: 1 });
    sayBox(sk, 150, 60, ['...'], [200, 110], 30);
    sayBox(sk, 1010, 60, ['...'], [960, 120], 30);
  });

  // 3. Mẹ explains, dreamily.
  panelFrame(sk, py(2), () => {
    const cx = sk.ctx;
    cx.fillStyle = '#E3EEFF'; cx.fillRect(0, 0, w, H);
    nam(150, 200, 0.32, { eyes: 1, mouth: 0, blink: 0 }).draw(sk, 0);
    apple(330, 170, 0.2, { eyes: 3, mouth: 4, blink: 0 }).draw(sk, 0);
    apple(140, 380, 0.2, { eyes: 3, mouth: 4, blink: 0 }).draw(sk, 0);
    nam(330, 390, 0.32, { eyes: 1, mouth: 0, blink: 0 }).draw(sk, 0);
    for (const [x, y] of [[240, 90], [250, 290], [430, 260]] as Pt[]) sk.blob(x, y, 6, 6, nid(), '#AFCBFF');
    place(sk, 620, H + 420, 1.3, 1, () => mom2(sk, 'happy', 'smile'));
    sayBox(sk, 900, 150, ['HỒI MANG BẦU CHỊ,', 'MẸ THÈM NẤM.', 'HỒI MANG BẦU EM,', 'MẸ THÈM TÁO.'], [780, 260], 31);
  });

  // 4. Ba's quiet relief.
  panelFrame(sk, py(3), () => {
    livingRoom(sk, w, H);
    place(sk, 280, H + 300, 1.0, 1, () => dad2(sk, 'dot', 'wavy', true));
    drop(sk, 150, 90, 1.3); drop(sk, 420, 70, 1);
    // thought: a durian
    for (const [x, y, r] of [[470, 200, 9], [500, 170, 13]] as [number, number, number][]) sk.shape(ellipse(x, y, r, r, 12), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
    sk.shape(scallop(600, 110, 100, 70, 7, 0.14, 60), nid(), { fill: '#FFFFFF' });
    durian(sk, 600, 112, 46);
    sk.line([[545, 65], [655, 160]], nid(), { width: LW * 0.8, color: '#E2627A' });
    sk.line([[655, 65], [545, 160]], nid(), { width: LW * 0.8, color: '#E2627A' });
    apple(930, H - 10, 0.42, { eyes: 0, mouth: 0, lookX: -0.8 }).draw(sk, 0);
    place(sk, 1060, H - 10, 0.25, -1, () => worm(sk, 'dot', 'flat'));
    sayBox(sk, 330, 330, ['MAY MÀ HỒI ĐÓ MẸ', 'KHÔNG THÈM SẦU RIÊNG…'], null, 30);
    sayBox(sk, 960, 140, ['Ờ.'], [930, 220], 34);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO Ờ #1 · THÈM GÌ', 26, 'right');
}

// ======================= Strip #7: "Chia bánh" (Táo's clever line) =======================
function woodTable(sk: Sketch, w: number, h: number, top: number): void {
  sk.shape(rrectPts(-20, top, w + 40, h - top + 30, 12, 3), nid(), { fill: '#E0B98A' });
  sk.line([[0, top + 22], [w, top + 24]], nid(), { width: LW * 0.5, color: '#C79A6B', amp: 1 });
}

function cake(sk: Sketch, x: number, y: number, r: number, split = 0): void {
  const half = (dx: number, side: number) => {
    const c = sk.ctx;
    c.save();
    c.beginPath(); side < 0 ? c.rect(x - r * 2, y - r * 2, r * 2 + dx * 0, r * 4) : c.rect(x, y - r * 2, r * 2, r * 4); c.clip();
    c.translate(dx, 0);
    sk.shape([[x - r, y - r * 0.45], [x - r, y + r * 0.2], ...quad([x - r, y + r * 0.2], [x, y + r * 0.6], [x + r, y + r * 0.2], 8).slice(1, -1), [x + r, y + r * 0.2], [x + r, y - r * 0.45]], nid(), { fill: '#FFF4E2' });
    sk.shape(ellipse(x, y - r * 0.45, r, r * 0.35, 32), nid(), { fill: '#FFC2D1' });
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; sk.blob(x + Math.cos(a) * r * 0.6, y - r * 0.45 + Math.sin(a) * r * 0.2, 7, 5, nid(), '#FFFFFF'); }
    c.restore();
  };
  if (split) { half(-split, -1); half(split, 1); sk.shape(ellipse(x - split, y - r * 0.82, 14, 13, 14), nid(), { fill: '#FF6B7A', width: LW * 0.6 }); }
  else { half(0, -1); half(0, 1); sk.shape(ellipse(x, y - r * 0.82, 14, 13, 14), nid(), { fill: '#FF6B7A', width: LW * 0.6 }); }
  sk.blob(x - (split ? split : 0), y - r * 0.98, 6, 4, nid(), COLORS.leaf);
}

function ruler(sk: Sketch, x: number, y: number, len: number, rot: number): void {
  const c = sk.ctx;
  c.save(); c.translate(x, y); c.rotate(rot);
  sk.shape(rrectPts(-len / 2, -16, len, 32, 4, 2), nid(), { fill: '#FFE58A', width: LW * 0.7 });
  for (let i = 0; i <= 20; i++) { const tx = -len / 2 + 8 + i * ((len - 16) / 20); sk.line([[tx, -16], [tx, i % 5 ? -6 : 2]], nid(), { width: LW * 0.3, amp: 0.2 }); }
  c.restore();
}

export function strip7(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 9;
  sk.setCamera(new DOMMatrix());
  uid = 17000;
  const w = W2 - 40, H = PH2, T = H - 90;
  const py = (i: number) => GAP + i * (PH2 + GAP);

  // 1. Mẹ brings a cake; Nấm claims the bigger half.
  panelFrame(sk, py(0), () => {
    livingRoom(sk, w, H);
    nam(250, T + 5, 0.72, { eyes: 1, mouth: 1, armR: 2.6, bendR: 0.3 }).draw(sk, 0);
    apple(520, T + 40, 0.42, { eyes: 0, mouth: 0, lookX: 0.4, arms: 0 }).draw(sk, 0);
    place(sk, 900, T + 230, 0.8, -1, () => mom2(sk, 'happy', 'smile'));
    woodTable(sk, w, H, T);
    cake(sk, 700, T + 10, 80);
    sayBox(sk, 840, 60, ['BÁNH ĐÂY! HAI ĐỨA CHIA NHAU NHA.'], [880, 110], 28);
    sayBox(sk, 300, 70, ['CHỊ LỚN HƠN,', 'CHỊ PHẢI ĐƯỢC PHẦN TO!'], [250, 150], 30);
  });

  // 2. Táo's clever line.
  panelFrame(sk, py(1), () => {
    tension(sk, w, H, '#FFE3DE', 560, H + 40);
    nam(220, H - 20, 0.9, { eyes: 3, mouth: 2, lookX: 0.8 }).draw(sk, 0);
    apple(600, H + 40, 0.75, { eyes: 0, mouth: 0, lookX: -0.4, legs: 0, arms: 0 }).draw(sk, 0);
    sayBox(sk, 860, 110, ['VẬY CHỊ CẮT ĐI.', 'EM CHỌN TRƯỚC.'], [740, 200], 36);
    sayBox(sk, 440, 70, ['!!!'], [350, 140], 32);
  });

  // 3. Nấm cuts with extreme precision while Ba & Mẹ watch.
  panelFrame(sk, py(2), () => {
    livingRoom(sk, w, H);
    place(sk, 820, T + 260, 0.8, 1, () => dad2(sk, 'shock', 'o'));
    place(sk, 1010, T + 230, 0.8, -1, () => mom2(sk, 'shock', 'o'));
    nam(330, T + 15, 0.72, { eyes: 0, mouth: 3, armR: 1.3, bendR: 0.2, sweat: 1 }).draw(sk, 0);
    angryBrows(sk, 330, T + 15 - 102 * 0.72, 0.72);
    woodTable(sk, w, H, T);
    cake(sk, 560, T + 10, 90);
    ruler(sk, 560, T - 40, 260, 0);
    sk.line([[560, T - 120], [560, T + 60]], nid(), { width: LW * 0.4, color: '#E2627A', amp: 0.2 });
    sk.ctx.save(); sk.ctx.fillStyle = '#E2627A'; sk.ctx.font = `24px ${FONT_FAMILY}`; sk.ctx.textAlign = 'center';
    sk.ctx.fillText('10,00 CM', 490, T - 80); sk.ctx.fillText('10,00 CM', 630, T - 80); sk.ctx.restore();
    drop(sk, 200, 120, 1); drop(sk, 450, 100, 0.9);
    sayBox(sk, 310, 60, ['ĐỂ… CHỊ… ĐO… LẠI…'], null, 28);
  });

  // 4. Mẹ learns the trick.
  panelFrame(sk, py(3), () => {
    livingRoom(sk, w, H);
    place(sk, 300, H + 330, 1.0, 1, () => dad2(sk, 'dot', 'wavy'));
    drop(sk, 170, 110, 1.2);
    place(sk, 640, H + 270, 1.0, -1, () => mom2(sk, 'happy', 'smile'));
    woodTable(sk, w, H, H - 50);
    cake(sk, 900, H - 70, 60, 14);
    apple(1060, H - 10, 0.3, { eyes: 0, mouth: 0, lookX: -0.8, legs: 0 }).draw(sk, 0);
    sayBox(sk, 300, 60, ['THẾ LƯƠNG THÁNG NÀY…'], [290, 130], 28);
    sayBox(sk, 760, 80, ['ANH CHIA ĐI.', 'EM CHỌN TRƯỚC.'], [650, 150], 32);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO #7 · CHIA BÁNH', 26, 'right');
}

// ======================= Strip #8: "Hũ kẹo" (Táo the detective) =======================
function wrapper(sk: Sketch, x: number, y: number, s = 1, col = '#FFB3C6'): void {
  sk.shape([[x - 30 * s, y - 16 * s], [x - 12 * s, y - 6 * s], [x - 12 * s, y + 6 * s], [x - 30 * s, y + 16 * s]], nid(), { fill: col, width: LW * 0.6, amp: 0.4 });
  sk.shape([[x + 30 * s, y - 16 * s], [x + 12 * s, y - 6 * s], [x + 12 * s, y + 6 * s], [x + 30 * s, y + 16 * s]], nid(), { fill: col, width: LW * 0.6, amp: 0.4 });
  sk.shape(ellipse(x, y, 16 * s, 12 * s, 14), nid(), { fill: col, width: LW * 0.6, amp: 0.4 });
}

function jar(sk: Sketch, x: number, y: number, empty: boolean): void {
  sk.shape(rrectPts(x - 50, y - 120, 100, 120, 24, 4), nid(), { fill: '#EAF4FF' });
  sk.shape(rrectPts(x - 40, y - 140, 80, 26, 6, 2), nid(), { fill: '#FF8C82', width: LW * 0.8 });
  sk.line(quad([x - 34, y - 100], [x - 38, y - 60], [x - 30, y - 24], 5), nid(), { width: LW * 0.6, color: '#FFFFFF' });
  if (empty) sk.blob(x + 10, y - 14, 5, 4, nid(), '#FFB3C6');
}

export function strip8(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 10;
  sk.setCamera(new DOMMatrix());
  uid = 19000;
  const w = W2 - 40, H = PH2, F = H - 30;
  const py = (i: number) => GAP + i * (PH2 + GAP);
  const namCap = (x: number, y: number, s: number) => wrapper(sk, x + 60 * s, y - 350 * s, s * 1.4);

  // 1. Ba finds the empty jar; Nấm blames Sâu.
  panelFrame(sk, py(0), () => {
    livingRoom(sk, w, H);
    place(sk, 230, H + 200, 0.75, 1, () => dad2(sk, 'shock', 'o', true));
    jar(sk, 345, 262, true);
    nam(620, F, 0.62, { eyes: 0, mouth: 1, armR: 1.5, bendR: 0 }).draw(sk, 0);
    namCap(620, F, 0.62);
    place(sk, 830, F, 0.32, -1, () => worm(sk, 'dot', 'flat'));
    apple(1010, F, 0.42, { eyes: 0, mouth: 0, lookX: -0.8 }).draw(sk, 0);
    sayBox(sk, 300, 60, ['AI ĂN HẾT HŨ KẸO CỦA BA?!'], [260, 120], 30);
    sayBox(sk, 820, 110, ['SÂU ĐÓ BA!'], [690, 190], 32);
    sayBox(sk, 730, 300, ['...'], [795, 345], 26);
  });

  // 2. Táo, calmly.
  panelFrame(sk, py(1), () => {
    tension(sk, w, H, '#E3EEFF', 600, H + 40);
    apple(600, H + 40, 0.75, { eyes: 0, mouth: 0, legs: 0, arms: 0 }).draw(sk, 0);
    sayBox(sk, 880, 110, ['SÂU KHÔNG CÓ RĂNG.'], [760, 190], 38);
  });

  // 3. Nấm doubles down; Táo points at the evidence.
  panelFrame(sk, py(2), () => {
    livingRoom(sk, w, H);
    nam(330, F + 10, 0.85, { eyes: 3, mouth: 2, sweat: 1 }).draw(sk, 0);
    wrapper(sk, 385, F + 10 - 300, 1.3);
    sk.shape(ellipse(385, F + 10 - 300, 64, 64, 40), nid(), { width: LW * 0.8, amp: 1 });
    apple(920, F + 10, 0.5, { eyes: 0, mouth: 0, lookX: -0.8, armL: 1.6 }).draw(sk, 0);
    sayBox(sk, 620, 250, ['…THÌ NÓ NGẬM!'], [450, 300], 30);
    sayBox(sk, 880, 70, ['CÒN VỎ KẸO TRÊN ĐẦU CHỊ', 'CHẮC SÂU DÁN LÊN?'], [910, 170], 28);
  });

  // 4. Verdict.
  panelFrame(sk, py(3), () => {
    livingRoom(sk, w, H);
    // Nấm in the corner, facing the wall
    nam(120, F, 0.55, { eyes: 2, mouth: 4, flip: -1 }).draw(sk, 0);
    namCap(120, F, 0.55);
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `26px ${FONT_FAMILY}`; sk.ctx.fillText('(bị phạt úp mặt vào tường)', 30, 172); sk.ctx.restore();
    place(sk, 560, H + 200, 0.75, 1, () => dad2(sk, 'happy', 'smile', true));
    wrapper(sk, 672, 200, 0.9, '#FFF1A8');
    apple(860, F, 0.42, { eyes: 0, mouth: 0, lookX: -0.6 }).draw(sk, 0);
    place(sk, 1030, F, 0.32, -1, () => worm(sk, 'happy', 'smile'));
    sayBox(sk, 470, 70, ['CÁI KẸO CUỐI NÀY THƯỞNG…'], [520, 120], 28);
    sayBox(sk, 960, 160, ['CHO SÂU Ạ.', 'NÓ BỊ OAN.'], [900, 240], 28);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO #8 · HŨ KẸO', 26, 'right');
}

// ======================= Strip #9: "Thi chạy" (with Vịt) =======================
function hill(sk: Sketch, w: number, h: number, topY: number, x0: number, bottomY: number): (x: number) => number {
  const c = sk.ctx;
  c.fillStyle = '#C9EBFF'; c.fillRect(0, 0, w, h);
  for (const [x, y, rx] of [[1010, 60, 70]] as [number, number, number][]) sk.shape(scallop(x, y, rx, rx * 0.45, 5, 0.18, 48), nid(), { fill: '#FFFFFF', width: LW * 0.6 });
  const gy = (x: number) => (x < x0 ? topY : topY + (x - x0) * (bottomY - topY) / (w - x0));
  const pts: Pt[] = [];
  for (let x = -10; x <= w + 10; x += 40) pts.push([x, gy(x)]);
  sk.trace([...pts, [w + 10, h + 10], [-10, h + 10]], true);
  c.fillStyle = '#CBEBB0'; c.fill();
  sk.line(pts, nid(), { width: LW * 0.8, amp: 1.2 });
  for (let i = 0; i < 10; i++) { const x = rand(i + 2600) * w, y = gy(x) + 20 + rand(i + 2700) * 60; sk.line([[x - 8, y], [x - 3, y - 12], [x, y], [x + 4, y - 14], [x + 8, y]], nid(), { width: LW * 0.4, color: '#7FBF6E', amp: 0.4 }); }
  return gy;
}

function flag(sk: Sketch, x: number, y: number, col = '#FF8C82'): void {
  sk.tube([[x, y], [x, y - 110]], nid(), 8, '#C79A6B');
  sk.shape([[x, y - 110], [x + 60, y - 92], [x, y - 72]], nid(), { fill: col, width: LW * 0.7 });
}

function speedLines(sk: Sketch, x: number, y: number, dir: number, n = 4, len = 90): void {
  for (let i = 0; i < n; i++) sk.line([[x, y + i * 22 - n * 11], [x - dir * (len - i * 12), y + i * 22 - n * 11]], nid(), { width: LW * 0.6, amp: 1 });
}

export function strip9(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 11;
  sk.setCamera(new DOMMatrix());
  uid = 21000;
  const w = W2 - 40, H = PH2;
  const py = (i: number) => GAP + i * (PH2 + GAP);

  // 1. The challenge, on top of the hill.
  panelFrame(sk, py(0), () => {
    const gy = hill(sk, w, H, 250, 420, 425);
    nam(100, gy(100), 0.5, { eyes: 1, mouth: 1 }).draw(sk, 0);
    place(sk, 240, gy(240), 0.45, 1, () => duck(sk, 'happy', 'open', -2.4));
    apple(360, gy(360), 0.32, { eyes: 0, mouth: 0, lookX: -0.6 }).draw(sk, 0);
    flag(sk, 1060, gy(1060), '#FFD86B');
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `24px ${FONT_FAMILY}`; sk.ctx.textAlign = 'center'; sk.ctx.fillText('ĐÍCH', 1060, gy(1060) - 130); sk.ctx.restore();
    sayBox(sk, 470, 58, ['THI CHẠY XUỐNG CHÂN ĐỒI!', 'AI THUA PHẢI KHAO KEM!'], [275, 130], 30);
    sayBox(sk, 540, 255, ['Ờ.'], [450, 205], 30);
    sayBox(sk, 95, 46, ['3… 2… 1!'], [100, 90], 22);
  });

  // 2. Vịt sprints; Táo hasn't moved.
  panelFrame(sk, py(1), () => {
    const gy = hill(sk, w, H, 250, 420, 425);
    apple(300, gy(300), 0.32, { eyes: 0, mouth: 0, lookX: 0.8 }).draw(sk, 0);
    place(sk, 760, gy(760), 0.5, 1, () => duck(sk, 'closed', 'open', -2.6));
    speedLines(sk, 650, gy(760) - 80, 1);
    drop(sk, 840, gy(760) - 190, 1);
    sayBox(sk, 640, 90, ['HAHA! TÁO CÒN ĐỨNG ĐÓ KÌA!'], [740, 170], 30);
  });

  // 3. Táo tucks in and rolls.
  panelFrame(sk, py(2), () => {
    const gy = hill(sk, w, H, 250, 420, 425);
    place(sk, 560, gy(560), 0.5, 1, () => duck(sk, 'shock', 'open', 0.3));
    const ax = 860, s = 0.4, r = 205 * s;
    apple(ax, gy(ax) - 40 * s - 12, s, { eyes: 0, mouth: 0, legs: 0, arms: 0, blink: 0, pivot: 2, tilt: 2.2 }).draw(sk, 0);
    void r;
    for (const k of [0, 1]) sk.line(quad([ax - 150 - k * 40, gy(ax) - 140 + k * 30], [ax - 110 - k * 40, gy(ax) - 170 + k * 30], [ax - 70 - k * 40, gy(ax) - 150 + k * 30], 6), nid(), { width: LW * 0.6 });
    speedLines(sk, ax - 110, gy(ax) - 70, 1, 3, 120);
    sk.ctx.save(); sk.ctx.fillStyle = INK; sk.ctx.font = `bold 46px ${FONT_FAMILY}`; sk.ctx.translate(ax + 40, gy(ax) - 170); sk.ctx.rotate(0.15); sk.ctx.fillText('LĂN~', 0, 0); sk.ctx.restore();
    sayBox(sk, 380, 90, ['Ơ?!'], [530, 200], 34);
  });

  // 4. Finish line: Táo's clever line.
  panelFrame(sk, py(3), () => {
    const c2 = sk.ctx;
    c2.fillStyle = '#C9EBFF'; c2.fillRect(0, 0, w, H);
    const G = H - 50;
    c2.fillStyle = '#CBEBB0'; c2.fillRect(0, G, w, H - G);
    sk.line([[0, G], [w / 2, G + 3], [w, G]], nid(), { width: LW * 0.8, amp: 1.2 });
    flag(sk, 780, G, '#FFD86B');
    apple(900, G, 0.42, { eyes: 0, mouth: 0, lookX: -0.8 }).draw(sk, 0);
    place(sk, 330, G, 0.55, 1, () => duck(sk, 'closed', 'open', 0.3));
    drop(sk, 220, G - 220, 1.1); drop(sk, 440, G - 240, 0.9);
    sayBox(sk, 280, 80, ['SAO CẬU NHANH VẬY?!'], [320, 160], 30);
    sayBox(sk, 830, 90, ['CẬU CHẠY BẰNG CHÂN.', 'TỚ CHẠY BẰNG TRỌNG LỰC.'], [880, 200], 31);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO #9 · THI CHẠY', 26, 'right');
}

// ======================= #11 Táo bón =======================
const PET = {
  hen: '#FFFFFF', henShade: '#EDE7DC', comb: '#FF6B6B', beak: '#FFC24D',
  dog: '#F2D2A6', dogShade: '#E2BC88', ear: '#A9744A',
  cat: '#C9CED8', catShade: '#B2B8C4', catEar: '#FFC2CC',
};

/** Gà: round white hen, red comb + wattle, little yellow beak. Origin at feet. */
function hen(sk: Sketch, eyes: Eye = 'dot', mouth: 'closed' | 'open' = 'closed', wing = 0.3): void {
  const cy = -130;
  for (const s of [-1, 1]) {
    sk.tube([[s * 30, -30], [s * 30, -6]], nid(), 9, '#FFB547');
    sk.line([[s * 30 - 18, -2], [s * 30, -8], [s * 30 + 18, -2]], nid(), { width: LW * 0.7, color: '#E8952A' });
  }
  sk.shape([[-100, cy + 10], [-160, cy - 50], [-150, cy + 10], [-170, cy + 20], [-110, cy + 50]], nid(), { fill: PET.hen });
  for (const s of [-1, 1]) {
    const a = s === 1 ? wing : 0.3;
    const sh: Pt = [s * 105, cy + 10];
    const tip: Pt = [sh[0] + s * Math.sin(a) * 60, sh[1] + Math.cos(a) * 60];
    sk.shape([sh, [sh[0] + s * 26, sh[1] + 6], tip, [sh[0] - s * 4, sh[1] + 34]], nid(), { fill: PET.hen });
  }
  sk.shape(scallop(0, cy - 112, 40, 20, 3, 0.35, 30), nid(), { fill: PET.comb });
  filled(sk, roundBody(0, cy, 118, 112, 56, 0.15, 0), PET.hen, PET.henShade, [-12, -10]);
  face(sk, 0, cy - 30, 0.8, eyes, 'none', COLORS.appleBlush, 1.15);
  const by = cy + 2;
  if (mouth === 'open') {
    sk.shape([[-16, by - 6], [16, by - 6], [0, by + 6]], nid(), { fill: PET.beak, width: LW * 0.7, amp: 0.4 });
    sk.shape([[-12, by + 10], [12, by + 10], [0, by + 26]], nid(), { fill: PET.beak, width: LW * 0.7, amp: 0.4 });
  } else sk.shape([[-18, by - 6], [18, by - 6], [0, by + 18]], nid(), { fill: PET.beak, width: LW * 0.7, amp: 0.4 });
  sk.shape(ellipse(4, by + 38, 10, 14, 14), nid(), { fill: PET.comb, width: LW * 0.6 });
}

/** Chó: round beige puppy, floppy brown ears, black nose, waggy tail. Origin at feet. */
function dog(sk: Sketch, eyes: Eye = 'dot', mouth: Mouth = 'none'): void {
  const cy = -135;
  limbs(sk, PET.dog, 50, -40, 0, 0, { armLen: 0, legW: 34 });
  sk.tube(quad([110, cy + 50], [160, cy + 20], [170, cy - 30], 6), nid(), 22, PET.dog);
  filled(sk, roundBody(0, cy, 125, 115, 56, 0.15, 0), PET.dog, PET.dogShade, [-12, -10]);
  for (const s of [-1, 1]) sk.shape([[s * 80, cy - 100], [s * 150, cy - 60], [s * 150, cy + 20], [s * 120, cy + 30], [s * 100, cy - 50]], nid(), { fill: PET.ear });
  face(sk, 0, cy - 28, 0.8, eyes, mouth, COLORS.appleBlush, 1.1);
  sk.shape(ellipse(0, cy - 12, 16, 11, 14), nid(), { fill: INK, width: LW * 0.5 });
}

/** Mèo: round grey kitty, pointy ears, whiskers, curly tail. Origin at feet. */
function cat(sk: Sketch, eyes: Eye = 'dot', mouth: Mouth = 'none'): void {
  const cy = -130;
  limbs(sk, PET.cat, 45, -40, 0, 0, { armLen: 0, legW: 32 });
  sk.tube(quad([-110, cy + 60], [-180, cy + 20], [-160, cy - 50], 6), nid(), 20, PET.cat);
  for (const s of [-1, 1]) {
    sk.shape([[s * 40, cy - 100], [s * 100, cy - 175], [s * 115, cy - 70]], nid(), { fill: PET.cat });
    sk.shape([[s * 58, cy - 104], [s * 96, cy - 150], [s * 103, cy - 86]], nid(), { fill: PET.catEar, width: LW * 0.5 });
  }
  filled(sk, roundBody(0, cy, 120, 110, 56, 0.15, 0), PET.cat, PET.catShade, [-12, -10]);
  face(sk, 0, cy - 28, 0.8, eyes, mouth, COLORS.appleBlush, 1.1);
  sk.shape([[-9, cy - 16], [9, cy - 16], [0, cy - 7]], nid(), { fill: '#FF9FB0', width: LW * 0.45, amp: 0.3 });
  for (const s of [-1, 1]) for (const k of [-1, 1]) sk.line([[s * 60, cy + 10 + k * 8], [s * 120, cy + 4 + k * 20]], nid(), { width: LW * 0.4, amp: 0.4 });
}

function bedroom(sk: Sketch, w: number, h: number, floor: number): void {
  const c = sk.ctx;
  c.fillStyle = '#FFF4DC'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#F3D8AE'; c.fillRect(0, floor, w, h - floor);
  sk.line([[0, floor], [w / 2, floor + 2], [w, floor]], nid(), { width: LW * 0.8, amp: 1 });
}

/** Bed with duck tucked in; returns nothing. x = bed centre, floor y. */
function bedWithDuck(sk: Sketch, x: number, floor: number, s: number, eyes: Eye, mouth: 'closed' | 'open', thermo: boolean): void {
  // headboard
  sk.shape(rrectPts(x - 250, floor - 300, 40, 300, 14, 3), nid(), { fill: '#C79A6B' });
  // mattress
  sk.shape(rrectPts(x - 230, floor - 120, 480, 70, 16, 3), nid(), { fill: '#FFFFFF' });
  sk.tube([[x + 230, floor - 60], [x + 230, floor]], nid(), 22, '#C79A6B');
  // pillow
  sk.shape(scallop(x - 150, floor - 140, 70, 30, 4, 0.12, 30), nid(), { fill: '#DDEBFF', width: LW * 0.8 });
  // duck sitting up, upper body only visible
  const dy = floor - 105;
  place(sk, x - 120, dy, s, 1, () => duck(sk, eyes, mouth, 0.3));
  // towel on head
  sk.shape(rrectPts(x - 120 - 52 * s * 2.2, dy - 262 * s, 104 * s * 2.2, 40 * s, 10, 2), nid(), { fill: '#BFE3FF', width: LW * 0.8 });
  if (thermo) {
    const bx = x - 120 + 50 * s, by = dy - 128 * s;
    sk.tube([[bx, by], [bx + 70, by - 18]], nid(), 9, '#FFFFFF');
    sk.blob(bx + 72, by - 18, 7, 7, nid(), '#FF6B6B');
  }
  // blanket covers lower body
  sk.shape([[x - 215, floor - 112], [x - 120, floor - 120], [x + 30, floor - 128], [x + 160, floor - 124], [x + 250, floor - 112], [x + 250, floor - 60], [x - 215, floor - 60]], nid(), { fill: '#9CC9FF' });
  for (let i = 0; i < 3; i++) sk.line([[x - 60 + i * 110, floor - 118], [x - 50 + i * 110, floor - 70]], nid(), { width: LW * 0.4, color: '#6FA6E8', amp: 0.6 });
}

function bowl(sk: Sketch, x: number, y: number, s = 1): void {
  sk.shape([...quad([x - 46 * s, y - 20 * s], [x, y + 30 * s], [x + 46 * s, y - 20 * s], 8)], nid(), { fill: '#FFFFFF' });
  sk.shape(ellipse(x, y - 22 * s, 46 * s, 10 * s, 20), nid(), { fill: '#FFF2C9', width: LW * 0.6 });
  for (const k of [-1, 0, 1]) sk.line([[x + k * 16, y - 40 * s], [x + k * 16 + 6, y - 58 * s], [x + k * 16, y - 76 * s]], nid(), { width: LW * 0.4, color: '#B8BCC8', amp: 0.6 });
}

function spoon(sk: Sketch, from: Pt, to: Pt): void {
  sk.tube([from, to], nid(), 9, '#E6E4EE');
  sk.shape(ellipse(to[0], to[1], 18, 11, 16), nid(), { fill: '#E6E4EE', width: LW * 0.6 });
  sk.shape(ellipse(to[0], to[1] - 2, 11, 5, 12), nid(), { fill: '#FFF2C9', width: LW * 0.3 });
}

/** World position of Apple2D hand for arm angle ang on side (-1 left, 1 right). */
function appleHand(x: number, y: number, s: number, side: number, ang: number): Pt {
  const lx = side * 205 * 0.88 + side * Math.sin(ang) * 82, ly = -205 * 0.62 + Math.cos(ang) * 82 - 50;
  return [x + lx * s, y + ly * s];
}

export function strip11(c: CanvasRenderingContext2D): void {
  c.canvas.width = W2;
  c.canvas.height = GAP + 4 * (PH2 + GAP) + 50;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  const sk = new Sketch(c);
  sk.seed = 13;
  sk.setCamera(new DOMMatrix());
  uid = 23000;
  const w = W2 - 40, H = PH2;
  const py = (i: number) => GAP + i * (PH2 + GAP);
  const F = H - 40;

  // 1. Vịt sick in bed; Táo arrives with a bowl.
  panelFrame(sk, py(0), () => {
    bedroom(sk, w, H, F);
    door(sk, 1000, 90, F);
    bedWithDuck(sk, 380, F, 0.5, 'closed', 'closed', true);
    drop(sk, 365, F - 215, 0.9);
    const ax = 860, s = 0.36, ang = 2.0;
    const hd = appleHand(ax, F, s, -1, ang);
    apple(ax, F, s, { eyes: 0, mouth: 0, lookX: -0.8, armL: ang }).draw(sk, 0);
    bowl(sk, hd[0] - 10, hd[1] - 6, 0.8);
    sayBox(sk, 270, 70, ['TỚ ỐM RỒI…', 'KHÔNG CẦM MUỖNG NỔI.'], [250, 160], 28);
    sayBox(sk, 830, 70, ['ĐỂ TỚ BÓN CHO.'], [860, 190], 30);
  });

  // 2. Táo spoon-feeds; Vịt opens wide.
  panelFrame(sk, py(1), () => {
    bedroom(sk, w, H, F);
    bedWithDuck(sk, 420, F, 0.62, 'closed', 'open', false);
    const ax = 830, s = 0.42, ang = 2.1;
    const hd = appleHand(ax, F, s, -1, ang);
    apple(ax, F, s, { eyes: 0, mouth: 0, lookX: -1, armL: ang }).draw(sk, 0);
    spoon(sk, hd, [318, F - 105 - 122 * 0.62]);
    bowl(sk, 960, F - 20, 0.9);
    sayBox(sk, 700, 70, ['HÁ MIỆNG RA. A~'], [790, 180], 30);
    sayBox(sk, 160, 80, ['A~'], [250, 170], 30);
  });

  // 3. Gà, Chó, Mèo burst in.
  panelFrame(sk, py(2), () => {
    bedroom(sk, w, H, F);
    door(sk, 40, 90, F);
    place(sk, 260, F, 0.55, 1, () => hen(sk, 'shock', 'open', -2.4));
    place(sk, 520, F, 0.6, 1, () => dog(sk, 'shock', 'o'));
    place(sk, 790, F, 0.55, 1, () => cat(sk, 'shock', 'o'));
    speedLines(sk, 150, F - 100, 1, 3, 70);
    sayBox(sk, 560, 75, ['TRỜI ƠI!', 'VỊT BỊ TÁO BÓN KÌA!!'], [520, 190], 34);
    drop(sk, 900, F - 230, 1); drop(sk, 170, F - 240, 0.9);
  });

  // 4. Táo corrects the grammar.
  panelFrame(sk, py(3), () => {
    bedroom(sk, w, H, F);
    bedWithDuck(sk, 330, F, 0.5, 'happy', 'open', false);
    const ax = 700, s = 0.36;
    apple(ax, F, s, { eyes: 0, mouth: 0, lookX: 1 }).draw(sk, 0);
    place(sk, 870, F, 0.38, -1, () => hen(sk, 'dot', 'closed'));
    place(sk, 990, F, 0.4, -1, () => dog(sk, 'dot', 'flat'));
    place(sk, 1100, F, 0.38, -1, () => cat(sk, 'dot', 'flat'));
    for (let i = 0; i < 3; i++) sk.blob(940 + i * 40, F - 190, 6, 6, nid(), INK);
    sayBox(sk, 700, 75, ['VỊT KHÔNG BỊ TÁO BÓN.', 'VỊT ĐƯỢC TÁO BÓN.'], [690, 200], 31);
    sayBox(sk, 170, 70, ['A~ NỮA!'], [230, 160], 26);
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
  text(c, W2 - 30, c.canvas.height - 18, 'TÁO #11 · TÁO BÓN', 26, 'right');
}
