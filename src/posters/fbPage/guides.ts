// Overlay showing what Facebook crops or covers (not part of the exported images).
import { COVER, PROFILE } from './sizes';

export function drawGuides(c: CanvasRenderingContext2D, kind: 'profile' | 'cover'): void {
  c.save();
  if (kind === 'profile') {
    const r = PROFILE.circleR;
    // Darken the corners Facebook cuts away.
    c.fillStyle = 'rgba(20, 22, 30, 0.55)';
    c.beginPath();
    c.rect(0, 0, PROFILE.width, PROFILE.height);
    c.arc(r, r, r, 0, Math.PI * 2, true);
    c.fill();
    c.setLineDash([10, 8]);
    c.strokeStyle = 'rgba(255, 80, 80, 0.9)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(r, r, PROFILE.safeR, 0, Math.PI * 2);
    c.stroke();
  } else {
    const { width: W, height: H, mobile, profileOverlap } = COVER;
    c.fillStyle = 'rgba(20, 22, 30, 0.45)';
    c.fillRect(0, 0, mobile.x0, H);
    c.fillRect(mobile.x1, 0, W - mobile.x1, H);
    c.fillStyle = 'rgba(255, 80, 80, 0.35)';
    for (const z of [profileOverlap.desktop, profileOverlap.mobile]) c.fillRect(z.x0, z.y0, z.x1 - z.x0, H - z.y0);
    c.font = '22px system-ui, sans-serif';
    c.fillStyle = '#fff';
    c.fillText('chỉ hiện trên máy tính', 20, 36);
    c.fillText('vùng ảnh đại diện che', 20, H - 20);
  }
  c.restore();
}
