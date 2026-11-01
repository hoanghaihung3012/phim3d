// Outdoor set in the comic-strip look (Táo #3): flat light-blue sky, white outline clouds,
// a rolling green hill, round trees on both sides and grass tufts.
import { Sketch, ellipse, quad, rand, scallop, type Pt } from '../doodle/Sketch';
import { LW } from '../doodle/style';

const C = {
  sky: '#CFEBFF',
  hill: '#BFE6A8',
  ground: '#CDEDB2',
  canopy: '#9ADB8F',
  canopyShade: '#86CC7C',
  trunk: '#C9A27A',
  cloud: '#FFFFFF',
  flower: ['#FFB3C6', '#FFF1A8', '#CDB4FF'],
};

export class Meadow2D {
  /** Wind pushes clouds faster (px per second). */
  cloudSpeed = 8;

  /** Sky fill in screen space (call before the camera is applied). */
  drawSky(sk: Sketch, width: number, height: number): void {
    const c = sk.ctx;
    c.fillStyle = sk.paint(C.sky);
    c.fillRect(0, 0, width, height);
  }

  /** World layers. */
  draw(sk: Sketch, t: number): void {
    const c = sk.ctx;
    // Clouds high up (the camera tilts up in the flying shots).
    for (let i = 0; i < 14; i++) {
      const span = 4400;
      const x = ((-2200 + rand(i) * span + t * this.cloudSpeed * (0.6 + rand(i + 4) * 0.6) + 2200) % span) - 2200;
      const y = -620 - rand(i + 20) * 1700;
      const w = 110 + rand(i + 40) * 90;
      sk.shape(scallop(x, y, w, w * 0.42, 5, 0.18, 48), 7600 + i, { fill: C.cloud, width: LW * 0.85 });
    }
    // Far hill.
    sk.shape(ellipse(-200, 60, 1700, 300, 48), 7620, { fill: C.hill });
    // Trees left and right.
    for (const [x, s, id] of [[-1080, 1.0, 7630], [1120, 1.15, 7640], [1500, 0.9, 7650]] as const) {
      sk.shape([[x - 40 * s, 0], [x - 30 * s, -260 * s], [x + 30 * s, -260 * s], [x + 40 * s, 0]], id, { fill: C.trunk });
      sk.shape(scallop(x, -400 * s, 230 * s, 210 * s, 7, 0.16, 56), id + 1, { fill: C.canopy });
      sk.shape(scallop(x + 70 * s, -330 * s, 120 * s, 90 * s, 5, 0.16, 40), id + 2, { fill: C.canopyShade, width: LW * 0.7 });
    }
    // Ground with a soft wavy horizon.
    const top: Pt[] = [];
    for (let i = 0; i <= 24; i++) {
      const x = -3000 + i * 250;
      top.push([x, -6 + 10 * Math.sin(i * 1.3)]);
    }
    c.fillStyle = sk.paint(C.ground);
    sk.trace(sk.wobble([...top, [3000, 1500], [-3000, 1500]], 7660, 1), true);
    c.fill();
    sk.line(top, 7661, { width: LW });
    // Grass tufts and a few flowers.
    for (let i = 0; i < 40; i++) {
      const x = -2400 + rand(i + 100) * 4800;
      const y = 40 + rand(i + 200) * 260;
      sk.line([[x - 12, y], [x - 6, y - 16], [x, y], [x + 6, y - 18], [x + 12, y]], 7670 + i, { width: LW * 0.5, amp: 0.5 });
      if (i % 5 === 0) sk.blob(x + 30, y - 6, 8, 8, 7720 + i, C.flower[i % 3]);
    }
  }
}

/** Diamond kite with a ribbon tail and a string to whoever holds it. */
export class Kite2D {
  x = 0;
  y = 0;
  rot = 0;
  scale = 1;
  visible = 1;
  /** Tail ribbon flutter amount. */
  flutter = 1;
  /** Where the string is held (set every frame by the episode), world coordinates. */
  holder: () => Pt = () => [this.x, this.y + 300];
  /** 1: the string continues past the holder down to a loose end at (endX, endY). */
  loose = 0;
  endX = 0;
  endY = 0;
  /** String sag (world units). */
  sag = 60;

  draw(sk: Sketch, t: number): void {
    if (this.visible < 0.5) return;
    const c = sk.ctx;
    const camera = sk.camera;
    // String(s) in world space.
    const tie = new DOMMatrix().translate(this.x, this.y).rotate((this.rot * 180) / Math.PI).scale(this.scale).transformPoint(new DOMPoint(0, 20));
    const [hx, hy] = this.holder();
    sk.setCamera(camera);
    sk.line(quad([tie.x, tie.y], [(tie.x + hx) / 2 + this.sag * 0.3, (tie.y + hy) / 2 + this.sag], [hx, hy], 10), 7800, { width: LW * 0.4, amp: 0.6 });
    if (this.loose > 0.5) {
      sk.line(quad([hx, hy], [(hx + this.endX) / 2 - 30, (hy + this.endY) / 2 + 40], [this.endX, this.endY], 10), 7801, { width: LW * 0.4, amp: 0.6 });
    }
    c.save();
    c.setTransform(camera.multiply(new DOMMatrix().translate(this.x, this.y).rotate((this.rot * 180) / Math.PI).scale(this.scale)));
    // Ribbon tail with three bows.
    const tail: Pt[] = [];
    for (let i = 0; i <= 10; i++) tail.push([22 * Math.sin(t * 7 + i * 0.8) * this.flutter * (i / 10), 120 + i * 24]);
    sk.line(tail, 7802, { width: LW * 0.5 });
    for (let i = 0; i < 3; i++) {
      const [bx, by] = tail[3 + i * 3];
      const col = ['#FFB3C6', '#A9DBFF', '#CDB4FF'][i];
      sk.shape([[bx, by], [bx - 20, by - 12], [bx - 20, by + 12]], 7803 + i, { fill: col, width: LW * 0.55, amp: 0.4 });
      sk.shape([[bx, by], [bx + 20, by - 12], [bx + 20, by + 12]], 7806 + i, { fill: col, width: LW * 0.55, amp: 0.4 });
    }
    // Diamond: two halves, cross sticks, a little smiley.
    sk.shape([[0, -120], [80, -14], [0, 124], [-80, -14]], 7810, { fill: '#FFE16B' });
    sk.shape([[0, -120], [80, -14], [-80, -14]], 7811, { fill: '#FFC24D', width: LW * 0.8 });
    sk.line([[0, -120], [0, 124]], 7812, { width: LW * 0.5 });
    sk.line([[-80, -14], [80, -14]], 7813, { width: LW * 0.5 });
    sk.blob(-22, 20, 6, 8, 7814, '#3A3F4E');
    sk.blob(22, 20, 6, 8, 7815, '#3A3F4E');
    sk.line(quad([-14, 42], [0, 54], [14, 42], 5), 7816, { width: LW * 0.5 });
    c.restore();
  }
}

/** Wind made visible: curly swoosh lines and a few leaves blowing across the shot. */
export class Wind2D {
  /** 0 calm .. 1 strong. */
  strength = 0;
  /** +1 blows to the right, -1 to the left. */
  dir = 1;

  draw(sk: Sketch, t: number, cx: number, cy: number, spanX: number, spanY: number): void {
    if (this.strength <= 0.05) return;
    const c = sk.ctx;
    const speed = 900 * this.strength;
    c.globalAlpha = Math.min(1, this.strength * 1.4);
    for (let i = 0; i < 7; i++) {
      const L = 2 * spanX + 600;
      const p = (((t * speed + rand(i + 300) * L) % L) + L) % L;
      const x = cx + this.dir * (p - L / 2);
      const y = cy + (rand(i + 310) - 0.5) * spanY;
      const w = 160 + rand(i + 320) * 120;
      const pts: Pt[] = [];
      for (let k = 0; k <= 8; k++) pts.push([x - this.dir * (w * k) / 8, y + Math.sin(k * 0.9 + i) * 10]);
      // A little curl at the head.
      pts.unshift([x + this.dir * 24, y - 22], [x + this.dir * 34, y - 6]);
      sk.line(pts, 7850 + i, { width: LW * 0.5, amp: 0.6 });
      if (i % 2 === 0) {
        const lx = x - this.dir * w * 0.5;
        const ly = y + 40 + 16 * Math.sin(t * 9 + i);
        c.save();
        c.translate(lx, ly);
        c.rotate(t * 6 * this.dir + i);
        sk.shape([[-18, 0], [0, -9], [18, 0], [0, 9]], 7870 + i, { fill: '#9ADB8F', width: LW * 0.5, amp: 0.3 });
        c.restore();
      }
    }
    c.globalAlpha = 1;
  }
}
