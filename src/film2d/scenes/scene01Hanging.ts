import type { Scene2D } from '../cast';
import { cut, pan } from './helpers';

/** Scene 1 "Treo lủng lẳng" (0:00 - 0:14): a quiet, calmly content apple on the tree, Bé Mây floats by. */
export const scene01Hanging: Scene2D = {
  id: 'scene01',
  title: 'Cảnh 1: Treo lủng lẳng',
  start: 0,
  end: 14,
  build(k, { apple, tree, cloud, cam, texts }) {
    const [ax, ay] = tree.anchor();
    // Initial state: Táo hangs by its stem from the branch, no legs. Quiet, content face.
    k.set(0, apple, {
      x: ax, y: ay + apple.stemTipHeight(), pivot: 1, legs: 0, sway: 1, visible: 1,
    });
    k.face(0, apple, 'dot', 'flat');
    k.set(0, cloud, { visible: 0, x: -900, y: -1000, scale: 0.6, eyes: 0, wave: 0 });

    // 0-4: wide shot, slow dolly toward the tree, title bounces in.
    cut(k, 0, cam, 140, -470, 0.85);
    pan(k, 0, 4, cam, 170, -420, 1.0);
    texts.screen.push({ t0: 0.4, t1: 3.8, text: 'Táo Muốn Bay', x: 0.5, y: 0.1, size: 110, bounce: true });

    // 4-9: medium shot on Táo. Eyes closed, enjoying the breeze without a smile; the leaf flutters.
    cut(k, 4, cam, ax, ay + 60, 2.4);
    k.face(6.0, apple, 'closed', 'flat');
    k.set(6.0, apple, { leaf: 0.4, flap: 1 });
    k.face(8.0, apple, 'dot', 'flat');
    k.set(8.0, apple, { leaf: 0, flap: 0 });

    // 9-14: pull back. Bé Mây floats by, waves, rises out of frame.
    cut(k, 9, cam, 150, -640, 1.1);
    k.set(9, cloud, { visible: 1 });
    k.to(9, 10.6, cloud, { x: 120, y: -1010 }, 'outQuad');
    k.set(10.4, cloud, { eyes: 1, wave: 1 });
    k.set(11.8, cloud, { wave: 0 });
    k.to(11.8, 13.6, cloud, { x: 420, y: -1500 }, 'inQuad');
    k.set(13.6, cloud, { visible: 0, eyes: 0 });
    k.set(10.0, apple, { lookX: -0.6, lookY: -1 });

    // Táo: shock (instantly), then smug: it has a plan.
    k.face(11.0, apple, 'shock', 'o');
    k.set(11.0, apple, { leaf: 1.0, stem: 6, sweat: 0.01 });
    k.to(11.0, 12.4, apple, { sweat: 1 }, 'linear');
    k.set(12.4, apple, { sweat: 0 });
    texts.captions.push({ t0: 11.0, t1: 12.2, text: 'Hử?' });

    cut(k, 12.6, cam, ax, ay + 60, 2.4);
    k.face(12.6, apple, 'smug', 'smirk');
    k.set(12.6, apple, { leaf: 0.3, stem: 0, lookX: 1, lookY: -0.4, blush: 1.4 });
  },
};
