// Acting clips for Nấm. Each clip sets fields on a freshly reset Mushroom2D for local time t.
import { MUSH_EYES, MUSH_MOUTHS, type Mushroom2D } from '../../src/film2d/characters/Mushroom2D';

export interface Action {
  id: string;
  label: string;
  key: string;
  duration: number;
  captions: [number, string][];
  apply(m: Mushroom2D, t: number): void;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const hop = (t: number, a: number, b: number) => {
  const x = seg(t, a, b);
  return 4 * x * (1 - x);
};
const eyes = (m: Mushroom2D, e: (typeof MUSH_EYES)[number]) => (m.eyes = MUSH_EYES.indexOf(e));
const mouth = (m: Mushroom2D, e: (typeof MUSH_MOUTHS)[number]) => (m.mouth = MUSH_MOUTHS.indexOf(e));

export const ACTIONS: Action[] = [
  {
    id: 'hello', label: 'Chào', key: '1', duration: 3.4,
    captions: [[0, 'Đây là Nấm.'], [1.5, 'Nấm hiền, hay ngại, hay hắt xì.']],
    apply(m, t) {
      if (t < 0.8) return;
      eyes(m, 'happy');
      mouth(m, 'smile');
      m.armR = 1.8;
      m.bendR = -0.3 + 0.6 * Math.sin(t * 12); // waving outside the cap rim
      m.capTilt = 0.06;
      m.tilt = -0.03;
    },
  },
  {
    id: 'happy', label: 'Vui', key: '2', duration: 2.8,
    captions: [[0.1, 'Yay!']],
    apply(m, t) {
      eyes(m, 'happy');
      mouth(m, 'grin');
      m.blush = 1.4;
      m.sparkle = 1;
      m.armL = m.armR = 2.0;
      m.bendL = m.bendR = -0.6;
      const k = t % 0.7;
      m.y = -60 * hop(k, 0, 0.55);
      if (k < 0.1) { m.sy = 0.88; m.sx = 1.08; }
      else if (k < 0.3) { m.sy = 1.08; m.sx = 0.95; m.capSquash = 1.08; }
      else if (k > 0.55 && k < 0.65) { m.sy = 0.9; m.capSquash = 0.9; }
      m.liftL = m.liftR = m.y < -10 ? 12 : 0;
    },
  },
  {
    id: 'shock', label: 'Giật mình', key: '3', duration: 2.6,
    captions: [[0.15, 'Á!']],
    apply(m, t) {
      if (t < 0.15) return;
      eyes(m, 'shock');
      mouth(m, 'o');
      m.armL = m.armR = 2.0;
      m.bendL = m.bendR = -0.6;
      // The cap stays on: it just stretches tall for a beat.
      m.capSquash = t < 0.6 ? 1.18 : t < 0.7 ? 0.92 : 1;
      m.y = -30 * hop(t, 0.15, 0.4);
      if (t > 0.7) { m.sweat = seg(t, 0.7, 2.2); m.armL = m.armR = 1.1; }
    },
  },
  {
    id: 'shy', label: 'Ngại', key: '4', duration: 3,
    captions: [[0.3, 'Nấm ngại...']],
    apply(m, t) {
      if (t < 0.3) return;
      eyes(m, 'closed');
      mouth(m, 'wavy');
      m.blush = 1.8;
      m.capDown = 38; // pulls the cap down over the eyes
      m.capTilt = -0.08;
      m.lookX = -1;
      m.armL = m.armR = 0.7;
      m.bendL = m.bendR = 1.4; // fiddling fingers in front
      m.tilt = 0.04 * Math.sin(t * 3);
      if (t > 1.6) { eyes(m, 'dot'); m.capDown = 26; }
      m.heart = t > 1.8 ? 1 : 0;
    },
  },
  {
    id: 'sneeze', label: 'Hắt xì', key: '5', duration: 3.2,
    captions: [[0.1, 'Hắt...'], [1.1, 'XÌ!']],
    apply(m, t) {
      if (t < 1.1) {
        // Wind-up: squint, lean back, cap creeping up.
        const k = seg(t, 0, 1.0);
        eyes(m, t > 0.4 ? 'closed' : 'half');
        mouth(m, 'o');
        m.tilt = -0.08 * k;
        m.capSquash = 1 + 0.08 * k;
        m.sy = 1 + 0.06 * k;
        return;
      }
      eyes(m, 'closed');
      mouth(m, 'grin');
      m.tilt = t < 1.3 ? 0.12 : 0;
      m.sy = t < 1.25 ? 0.86 : 1;
      m.sx = t < 1.25 ? 1.1 : 1;
      m.capSquash = t < 1.25 ? 1.2 : t < 1.4 ? 0.9 : 1;
      m.spores = seg(t, 1.1, 2.4) * 0.999;
      if (t > 2.2) { eyes(m, 'dot'); mouth(m, 'flat'); m.blush = 1.5; }
    },
  },
  {
    id: 'sleepy', label: 'Buồn ngủ', key: '6', duration: 3.6,
    captions: [[0.5, 'Nấm buồn ngủ.']],
    apply(m, t) {
      eyes(m, t < 0.8 ? 'half' : 'closed');
      mouth(m, 'o');
      m.capTilt = 0.22 * seg(t, 0, 1.2);
      m.tilt = 0.06 * Math.sin(t * 1.6);
      m.armL = m.armR = 0.05;
      m.zzz = t > 1.0 ? 1 + Math.floor((t - 1.0) / 0.5) : 0;
      if (t > 3.0) { eyes(m, 'shock'); mouth(m, 'flat'); m.capTilt = 0; m.zzz = 0; } // jolts awake
    },
  },
  {
    id: 'confused', label: 'Bối rối', key: '7', duration: 3,
    captions: [[0.3, 'Hở?']],
    apply(m, t) {
      if (t < 0.3) return;
      mouth(m, 'wavy');
      m.question = 1;
      m.lookX = t < 1.2 ? -1 : t < 2.0 ? 1 : 0;
      m.armR = 2.1;
      m.bendR = 1.0 + 0.25 * Math.sin(t * 16); // scratching under the cap rim
      m.capTilt = -0.05 + 0.03 * Math.sin(t * 16);
      m.tilt = 0.05;
    },
  },
  {
    id: 'run', label: 'Chạy', key: '8', duration: 2.6,
    captions: [[0.2, 'Lạch bạch lạch bạch.']],
    apply(m, t) {
      if (t < 0.2) return;
      eyes(m, 'dot');
      mouth(m, 'o');
      m.run = 1;
      m.tilt = 0.08;
      m.armL = 0.9 + 0.7 * Math.sin(t * 20);
      m.armR = 0.9 - 0.7 * Math.sin(t * 20);
      m.capTilt = -0.06;
    },
  },
];

export const DEMO_ORDER = ['hello', 'happy', 'shock', 'shy', 'sneeze', 'sleepy', 'confused', 'run'];
