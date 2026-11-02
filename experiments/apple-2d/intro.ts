// "Táo chào mọi người": a short self-introduction clip built from the acting clips in actions.ts.
// Each step plays one action; captions and duration can be overridden per step.
import type { Cue } from '../../src/audio/cues';
import { ACTIONS, type Action } from './actions';

export interface IntroStep {
  action: Action;
  start: number;
  duration: number;
  captions: [number, string][];
}

const PLAN: { id: string; duration?: number; captions?: [number, string][] }[] = [
  { id: 'hello' },
  { id: 'calm', captions: [[0.3, 'Táo ít nói.'], [1.7, '...lâu lâu mới cười.']] },
  { id: 'happy', duration: 2.4, captions: [[0.2, '(Đó. Vừa cười đó.)']] },
  { id: 'sigh' },
  { id: 'bye' },
];

const byId = new Map(ACTIONS.map((a) => [a.id, a]));
let at = 0;
export const INTRO: IntroStep[] = PLAN.map((p) => {
  const action = byId.get(p.id);
  if (!action) throw new Error(`Unknown action "${p.id}"`);
  const step = { action, start: at, duration: p.duration ?? action.duration, captions: p.captions ?? action.captions };
  at += step.duration;
  return step;
});
export const INTRO_DURATION = at;

const startOf = (id: string) => INTRO.find((s) => s.action.id === id)!.start;

/** Placeholder voice + sfx (synths from src/audio/synth.ts). */
export const INTRO_CUES: Cue[] = [
  { id: 'sfx_o', t: startOf('hello') + 0.5, volume: 0.8 },
  { id: 'sfx_o', t: startOf('hello') + 1.7, volume: 0.7, pitch: 1.15 },
  { id: 'sfx_ting', t: startOf('happy') + 0.2, volume: 0.4 },
  { id: 'sfx_haizz', t: startOf('sigh') + 0.6, duration: 1.2, volume: 0.7 },
  { id: 'sfx_o', t: startOf('bye') + 0.3, volume: 0.8 },
];

/** Step and local time at clip time t (clamped to the clip). */
export function stepAt(t: number): { step: IntroStep; local: number } {
  const tt = Math.min(Math.max(t, 0), INTRO_DURATION - 1e-3);
  const step = INTRO.find((s) => tt < s.start + s.duration) ?? INTRO[INTRO.length - 1];
  return { step, local: tt - step.start };
}
