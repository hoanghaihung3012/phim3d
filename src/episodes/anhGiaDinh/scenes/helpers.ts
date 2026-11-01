import type { Pt } from '../../../film2d/doodle/Sketch';
import type { Keyer } from '../../../film2d/Keyer';
import type { FaceEye, FaceMouth } from '../../../film2d/characters/face';
import type { Cue } from '../../../audio/cues';
import type { Bubble, Bubbles } from '../../../film2d/props/Bubbles';
import type { EpisodeCast } from '../cast';

export { cut, pan, shake } from '../../../film2d/scenes/helpers';

/** Voices of the placeholder babble synth (src/audio/synth.ts: sfx_babble_<voice>). */
export type Voice = 'ba' | 'me' | 'nam' | 'tao' | 'vit' | 'none';

/**
 * Placeholder babble on/off. Turned off when real recorded voices are mixed in afterwards
 * (scripts/mix-dub.mjs), so the bubbles and mouth flaps stay but the synth babble goes.
 */
let babbleEnabled = true;
export function setBabble(on: boolean): void {
  babbleEnabled = on;
}

interface Speaker {
  headTop(): Pt;
}

/** Anything with keyable eyes/mouth indices and the names they index. */
interface Face {
  eyes: number;
  mouth: number;
  readonly eyeSet: readonly string[];
  readonly mouthSet: readonly string[];
}

/** Switches a character's expression instantly (by name). */
export function face(k: Keyer, t: number, who: Face, eyes?: FaceEye, mouth?: FaceMouth): void {
  const props: { eyes?: number; mouth?: number } = {};
  if (eyes) props.eyes = who.eyeSet.indexOf(eyes);
  if (mouth) props.mouth = who.mouthSet.indexOf(mouth);
  k.set(t, who, props);
}

/**
 * A line of dialogue: a speech bubble pointing at the speaker plus a babble sound cue,
 * and optionally the speaker's `talk` channel flapping the mouth while it lasts.
 */
export function say(
  k: Keyer,
  cast: { bubbles: Bubbles; cues: Cue[] },
  who: Speaker | null,
  voice: Voice,
  t0: number,
  t1: number,
  text: string,
  opts: Partial<Omit<Bubble, 't0' | 't1' | 'text' | 'at'>> & { mouthOf?: { talk: number } } = {},
): void {
  const { mouthOf, ...bubble } = opts;
  cast.bubbles.add({ t0, t1, text, at: () => (who ? who.headTop() : [0, 0]), ...bubble });
  const syllables = text.replace(/[^\p{L}]+/gu, ' ').trim().split(' ').filter(Boolean).length;
  if (voice !== 'none' && syllables > 0) {
    const dur = Math.min(t1 - t0 - 0.2, Math.max(0.25, syllables * 0.17));
    if (babbleEnabled) cast.cues.push({ id: `sfx_babble_${voice}`, t: t0 + 0.05, duration: dur, volume: bubble.shout ? 1 : 0.75 });
    if (mouthOf) k.set(t0, mouthOf, { talk: 1 }).set(t0 + 0.05 + dur, mouthOf, { talk: 0 });
  }
}

/** Camera flash at t: white burst that fades quickly, plus the shutter sound. */
export function flash(k: Keyer, cast: EpisodeCast, t: number): void {
  k.set(t, cast.fx, { flash: 1 }).to(t + 1 / 12, t + 0.4, cast.fx, { flash: 0 }, 'outQuad');
  cast.cues.push({ id: 'sfx_shutter', t, volume: 0.9 });
}

/** Shows polaroid number `index` from t0 to t1. */
export function polaroid(k: Keyer, cast: EpisodeCast, index: number, t0: number, t1: number, tilt: number): void {
  k.set(t0, cast.fx, { photo: index, photoTilt: tilt, photoScale: 0.8 });
  k.to(t0, t0 + 0.3, cast.fx, { photoScale: 1 }, 'outBack');
  k.set(t1, cast.fx, { photo: 0 });
  cast.cues.push({ id: 'sfx_poof', t: t0, volume: 0.5 });
}
