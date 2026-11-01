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
    captions: [[0.2, 'Chào cả nhà! Mình là Nấm!'], [1.8, '(Nấm cao hơn Táo. Nấm rất tự hào.)']],
    apply(m, t) {
      if (t < 0.2) return;
      eyes(m, 'happy');
      mouth(m, 'grin');
      m.armL = m.armR = 1.9;
      m.bendL = -0.3 + 0.6 * Math.sin(t * 12 + 1);
      m.bendR = -0.3 + 0.6 * Math.sin(t * 12);
      m.y = -20 * hop(t % 0.8, 0, 0.4);
      m.blush = 1.3;
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
    id: 'chatty', label: 'Nói nhiều', key: '3', duration: 3.6,
    captions: [[0.1, 'Nè nè, biết gì chưa...'], [1.3, '...rồi còn chuyện này nữa nè...'], [2.5, '...mà khoan, chuyện kia đã!']],
    apply(m, t) {
      eyes(m, Math.floor(t / 0.9) % 2 ? 'happy' : 'dot');
      m.talk = 1;
      m.lookX = 1;
      m.tilt = 0.04;
      m.armL = 1.2 + 0.5 * Math.sin(t * 7);
      m.armR = 1.5 + 0.5 * Math.sin(t * 7 + 2);
      m.bendL = 0.6;
      m.bendR = -0.4;
      m.blush = 1.2;
    },
  },
  {
    id: 'smart', label: 'Thông thái', key: '4', duration: 3.8,
    captions: [[0.3, 'Thật ra thì...'], [1.3, 'nấm không phải là thực vật đâu nha.'], [2.8, '(Nấm học giỏi lắm.)']],
    apply(m, t) {
      if (t < 0.3) return;
      m.glasses = 1;
      m.brows = 2;
      eyes(m, 'half');
      mouth(m, t > 1.3 && t < 2.6 ? 'grin' : 'smile');
      m.talk = t > 1.3 && t < 2.6 ? 1 : 0;
      // One finger up, very professor-like.
      m.armR = 2.3;
      m.bendR = 1.6;
      m.armL = 0.5;
      m.bendL = 1.3;
      m.tilt = -0.03;
      m.bulb = t > 0.6 ? 1 : 0;
    },
  },
  {
    id: 'fierce', label: 'Dữ', key: '5', duration: 3.4,
    captions: [[0.1, 'HỪ!'], [1.7, 'Hihi, giỡn thôi.']],
    apply(m, t) {
      if (t < 1.6) {
        m.brows = 1;
        eyes(m, 'dot');
        mouth(m, 'frown');
        m.anger = 1;
        m.blush = 0.4;
        m.tilt = 0.06;
        m.capTilt = 0.08;
        m.armL = m.armR = 0.7;
        m.bendL = m.bendR = 1.5; // fists on hips
        // Stomp stomp.
        const k = t % 0.4;
        m.liftR = k < 0.2 ? 24 : 0;
        if (k >= 0.2 && k < 0.27) { m.sy = 0.92; m.sx = 1.05; }
        return;
      }
      // ...and instantly back to sunny.
      eyes(m, 'happy');
      mouth(m, 'grin');
      m.blush = 1.5;
      m.armR = 1.9;
      m.bendR = -0.3 + 0.5 * Math.sin(t * 12);
    },
  },
  {
    id: 'clueless', label: 'Vô tri', key: '6', duration: 3.6,
    captions: [[0.2, 'Nấm đang suy nghĩ...'], [1.8, '...Nấm quên mất mình đang nghĩ gì.']],
    apply(m, t) {
      m.blink = 0;
      eyes(m, 'dot');
      mouth(m, 'o');
      m.lookY = -0.6;
      m.lookX = t < 1.8 ? 0.5 : 0;
      m.armL = m.armR = 0.05;
      m.capTilt = -0.04;
      if (t > 1.8) { m.question = 1; mouth(m, 'flat'); m.lookY = 0; }
      if (t > 3.0) { eyes(m, 'happy'); mouth(m, 'grin'); m.question = 0; } // whatever, still happy
    },
  },
  {
    id: 'sneeze', label: 'Hắt xì', key: '7', duration: 3.2,
    captions: [[0.1, 'Hắt...'], [1.1, 'XÌ!']],
    apply(m, t) {
      if (t < 1.1) {
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
      if (t > 2.2) { eyes(m, 'happy'); mouth(m, 'grin'); m.blush = 1.5; }
    },
  },
  {
    id: 'run', label: 'Chạy', key: '8', duration: 2.6,
    captions: [[0.2, 'Lạch bạch lạch bạch!']],
    apply(m, t) {
      if (t < 0.2) return;
      eyes(m, 'happy');
      mouth(m, 'grin');
      m.run = 1;
      m.tilt = 0.08;
      m.armL = 0.9 + 0.7 * Math.sin(t * 20);
      m.armR = 0.9 - 0.7 * Math.sin(t * 20);
      m.capTilt = -0.06;
    },
  },
];

export const DEMO_ORDER = ['hello', 'happy', 'chatty', 'smart', 'fierce', 'clueless', 'sneeze', 'run'];
