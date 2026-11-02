// Short acting clips for the 2D apple. Each clip maps local time (s) to a Pose.
// Expressions switch instantly (no tweening) to keep the stepped comedy timing.
// Táo talks very little but enjoys everything: the resting face is calm dots + a small smile.
import { restPose, type Pose } from './AppleDoodle';

export interface Action {
  id: string;
  label: string;
  key: string;
  duration: number;
  /** [startTime, text] captions shown under the character, like a comic panel. */
  captions: [number, string][];
  pose(t: number, T: number): Pose;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - (1 - x) * (1 - x);
const easeIn = (x: number) => x * x;
/** Parabolic hop: 0 at a and b, 1 at the middle. */
const hop = (t: number, a: number, b: number) => {
  const x = seg(t, a, b);
  return 4 * x * (1 - x);
};

/** Idle layer shared by everything: slow breathing, arm sway and blinking. T = absolute time. */
export function idle(T: number): Pose {
  const p = restPose();
  const breath = Math.sin(T * 2.2);
  p.sy = 1 + 0.018 * breath;
  p.sx = 1 - 0.01 * breath;
  p.armL = 0.25 + 0.05 * Math.sin(T * 1.7);
  p.armR = 0.25 + 0.05 * Math.sin(T * 1.7 + 1);
  p.leaf = 0.06 * Math.sin(T * 1.3);
  return p;
}

/** Blink for ~0.12 s every 3.4 s, only when the eyes are open dots. */
export function withBlink(p: Pose, T: number): Pose {
  if ((p.eyes === 'half' || p.eyes === 'dot') && T % 3.4 < 0.12) p.eyes = 'closed';
  return p;
}

export const ACTIONS: Action[] = [
  {
    id: 'calm', label: 'Bình thản', key: '1', duration: 3.5,
    captions: [[0, 'Đây là Táo.'], [1.6, 'Táo ít nói... nhưng cái gì cũng thấy vui.']],
    pose: (t, T) => {
      const p = idle(T);
      if (t > 2.4) { p.eyes = 'happy'; p.blush = 1.3; } // quietly pleased, nothing else happens
      return p;
    },
  },
  {
    id: 'side', label: 'Liếc', key: '2', duration: 3,
    captions: [[0.4, 'Táo không nói gì.'], [1.5, 'Táo chỉ liếc.']],
    pose: (t, T) => {
      const p = idle(T);
      if (t > 0.4) { p.lookX = 1; p.tilt = 0.035; }
      if (t > 1.5) { p.lookX = -1; p.tilt = -0.035; p.eyes = 'smug'; }
      if (t > 2.6) { p.lookX = 0; p.tilt = 0; p.eyes = 'dot'; }
      return p;
    },
  },
  {
    id: 'shock', label: 'Giật mình', key: '3', duration: 2.6,
    captions: [[0.15, 'Hử?!']],
    pose: (t, T) => {
      const p = idle(T);
      if (t < 0.15) return p;
      p.eyes = 'shock';
      p.mouth = 'o';
      p.leaf = 1.0;
      p.stem = 6;
      p.armL = p.armR = 2.5;
      p.lift = 70 * hop(t, 0.15, 0.45);
      if (t < 0.3) { p.sy = 1.12; p.sx = 0.92; p.liftL = p.liftR = 10; }
      else if (t > 0.45 && t < 0.58) { p.sy = 0.9; p.sx = 1.07; }
      if (t > 0.6) { p.fx.sweat = seg(t, 0.6, 2.2); p.armL = p.armR = 1.3; p.blush = 0.5; }
      return p;
    },
  },
  {
    id: 'smug', label: 'Nhếch mép', key: '4', duration: 2.8,
    captions: [[0.2, 'Táo có kế hoạch.']],
    pose: (t, T) => {
      const p = idle(T);
      if (t < 0.2) return p;
      p.eyes = 'smug';
      p.mouth = 'smirk';
      p.tilt = -0.07;
      p.lookX = 0.5;
      p.blush = 1.3;
      p.armR = 2.0 + 0.15 * Math.sin(t * 9); // little finger wag
      p.armL = 0.6;
      p.stem = 4 * Math.sin(t * 14);
      return p;
    },
  },
  {
    id: 'breeze', label: 'Hóng gió', key: '5', duration: 3.2,
    captions: [[0.6, 'Ờ. Mát.']],
    pose: (t, T) => {
      // A deep, happy breath of fresh air (eyes closed, smiling), not a sigh.
      const p = idle(T);
      p.eyes = 'happy';
      p.mouth = 'smile';
      const inhale = easeOut(seg(t, 0, 0.8));
      const relax = easeOut(seg(t, 0.8, 1.6));
      p.sy += 0.07 * inhale - 0.04 * relax;
      p.sx += -0.03 * inhale + 0.02 * relax;
      p.armL = p.armR = 0.25 + 0.35 * inhale - 0.2 * relax;
      p.leaf = 0.5 * Math.sin(t * 9) * seg(t, 0.4, 0.8);
      p.blush = 1.3;
      if (t > 2.4) { p.eyes = 'dot'; }
      return p;
    },
  },
  {
    id: 'run', label: 'Chạy', key: '6', duration: 3,
    captions: [[0.2, 'Táo chạy.'], [1.4, 'Không đi đâu cả.']],
    pose: (t, T) => {
      const p = idle(T);
      if (t < 0.2) return p;
      const w = t * 22;
      p.footL = 26 * Math.sin(w);
      p.footR = -26 * Math.sin(w);
      p.liftL = Math.max(0, 18 * Math.cos(w));
      p.liftR = Math.max(0, -18 * Math.cos(w));
      p.lift = 8 * Math.abs(Math.sin(w));
      p.tilt = 0.09;
      p.armL = 0.9 + 0.6 * Math.sin(w);
      p.armR = 0.9 - 0.6 * Math.sin(w);
      p.leaf = -0.5;
      p.fx.speed = 1;
      return p;
    },
  },
  {
    id: 'drop', label: 'Rơi CỘP', key: '7', duration: 3.6,
    captions: [[0.3, 'CỘP.'], [1.2, '...']],
    pose: (t, T) => {
      const p = idle(T);
      // Falls fast, no floating. Tiny squash on impact, then just stands there.
      p.lift = 760 * (1 - easeIn(seg(t, 0, 0.3)));
      if (t < 0.3) { p.eyes = 'dot'; p.mouth = 'none'; p.liftL = p.liftR = 14; p.leaf = 0.8; p.armL = p.armR = 2.2; }
      else if (t < 0.42) { p.sy = 0.9; p.sx = 1.06; p.armL = p.armR = 1.2; }
      if (t > 1.2) p.fx.dots = Math.floor((t - 1.2) / 0.35) + 1;
      return p;
    },
  },
  {
    id: 'happy', label: 'Vui (hiếm)', key: '8', duration: 3,
    captions: [[0, 'Táo vui.'], [1.5, '(Hiếm lắm. Chụp lại đi.)']],
    pose: (t, T) => {
      const p = idle(T);
      p.eyes = 'happy';
      p.mouth = 'smile';
      p.blush = 1.4;
      p.leaf = 0.5;
      p.lift = 36 * hop(t % 0.6, 0, 0.6) * (t < 1.8 ? 1 : 0);
      p.armL = 0.9;
      p.armR = 2.4 + 0.45 * Math.sin(t * 12);
      p.fx.sparkle = 0.6 + 0.4 * Math.abs(Math.sin(t * 5));
      return p;
    },
  },
];

/** Order used by the auto demo. */
export const DEMO_ORDER = ['calm', 'side', 'breeze', 'shock', 'smug', 'run', 'drop', 'happy'];
