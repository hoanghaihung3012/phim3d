import type { EaseName } from '../core/easing';
import type { Timeline } from '../core/Timeline';
import { EYES, MOUTHS, type Apple2D, type Eye, type Mouth } from './characters/Apple2D';

type Props<T> = Partial<Record<keyof T & string, number>>;

/**
 * Friendlier keyframing on top of Timeline for scenes built in time order.
 * - set(t, obj, {...}): values switch instantly at t (stepped, the deadpan default).
 * - to(t0, t1, obj, {...}, ease): move from the current value at t0 to the new value at t1.
 * It remembers each property's latest value, so a scene never has to repeat "from" values,
 * and every property gets a key at time 0 so earlier frames keep the initial value.
 */
export class Keyer {
  private last = new Map<object, Record<string, number>>();

  constructor(readonly tl: Timeline) {}

  private current(obj: object, prop: string): number {
    let rec = this.last.get(obj);
    if (!rec) {
      rec = {};
      this.last.set(obj, rec);
    }
    if (!(prop in rec)) {
      const v = (obj as Record<string, unknown>)[prop];
      if (typeof v !== 'number') throw new Error(`Property "${prop}" is not numeric`);
      rec[prop] = v;
      this.tl.key(obj as Record<string, number>, prop, [[0, v]]);
    }
    return rec[prop];
  }

  set<T extends object>(t: number, obj: T, props: Props<T>): this {
    for (const [prop, v] of Object.entries(props) as [string, number][]) {
      if (t <= 0 && !(prop in (this.last.get(obj) ?? {}))) {
        // Initial value: becomes the time-0 key itself.
        (obj as Record<string, number>)[prop] = v;
        this.current(obj, prop);
        continue;
      }
      this.current(obj, prop);
      this.tl.key(obj as Record<string, number>, prop, [[t, v, 'step']]);
      this.last.get(obj)![prop] = v;
    }
    return this;
  }

  to<T extends object>(t0: number, t1: number, obj: T, props: Props<T>, ease: EaseName = 'inOutSine'): this {
    for (const [prop, v] of Object.entries(props) as [string, number][]) {
      const from = this.current(obj, prop);
      this.tl.key(obj as Record<string, number>, prop, [
        [t0, from, 'step'],
        [t1, v, ease],
      ]);
      this.last.get(obj)![prop] = v;
    }
    return this;
  }

  /** Current (latest keyed) value of a property. */
  get<T extends object>(obj: T, prop: keyof T & string): number {
    return this.current(obj, prop);
  }

  /** Switch Táo's expression instantly. */
  face(t: number, apple: Apple2D, eyes: Eye, mouth?: Mouth): this {
    const props: Props<Apple2D> = { eyes: EYES.indexOf(eyes) };
    if (mouth) props.mouth = MOUTHS.indexOf(mouth);
    return this.set(t, apple, props);
  }
}
