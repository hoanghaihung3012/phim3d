# Mochi Muốn Bay 🍡☁️

Phim hoạt hình 3D ngắn (~95 giây) dựng bằng **Three.js + Vite + TypeScript**, chạy trên trình duyệt.
Kịch bản: `docs/script.md` (branch `claude/project-thread-i47943`).

## Chạy thử (Windows / macOS / Linux)

Cần Node.js 20+.

```bash
npm install
npm run dev        # mở http://localhost:5173
```

- **Space**: play / pause · **← / →**: lùi/tiến 1 frame (giữ Shift = 1 giây)
- Kéo thanh seek để nhảy tới bất kỳ giây nào. Mở `http://localhost:5173/?t=18` để vào thẳng giây 18.
- Nút **⏺ Xuất WebM**: render lại toàn bộ phim ở 1920×1080, 30 fps (kèm âm thanh) và tải file `.webm` về.
  Muốn MP4: `ffmpeg -i mochi-muon-bay.webm -c:v libx264 -pix_fmt yuv420p -c:a aac mochi.mp4`

Kiểm tra code: `npm run typecheck` · Build tĩnh: `npm run build` (ra thư mục `dist/`).

## Cấu trúc

```
src/
  main.ts               nối mọi thứ: stage, cast, timeline, HUD, recorder
  config/
    film.ts             độ phân giải, fps, bảng màu pastel
    assets.ts           MỌI đường dẫn audio/texture (không hard-code ở chỗ khác)
  core/
    Timeline.ts         keyframe theo thời gian tuyệt đối, seek được
    Playback.ts         play / pause / seek theo đồng hồ thật (chỉ dùng khi xem thử)
    Recorder.ts         ghi canvas + audio ra WebM, bước thời gian cố định 1/30s
    Stage.ts            renderer, ánh sáng mềm, bóng đổ, sương mù
    CameraRig.ts        camera keyframe được (position, target, fov, roll, shake)
    easing.ts           outBack, outElastic, step (cắt cảnh)...
    materials.ts        vật liệu "đất sét" mềm
  characters/
    Mochi.ts            squash & stretch giữ thể tích, chớp mắt, biểu cảm
    Cloud.ts            Bé Mây (placeholder)
  props/                Hill, Sky, TitleCard
  scenes/
    scene01Dream.ts     Cảnh 1 (0–14s)
    scene02Jump.ts      Cảnh 2 (14–30s) – "vertical slice" gag nhảy
    index.ts            danh sách cảnh theo thứ tự
  audio/
    cues.ts             mọi cue âm thanh theo thời điểm
    synth.ts            hiệu ứng tổng hợp bằng WebAudio (boing, bẹp, ting...)
    AudioManager.ts     phát cue; ưu tiên file thật trong assets.ts, không có thì dùng synth
```

## Cách hoạt động (ngắn gọn)

1. **Mọi thứ là hàm của thời gian `t`.** Mỗi cảnh gọi `tl.key(obj, 'prop', [[t, value, ease], ...])`
   với `t` là giây tuyệt đối trong phim (khớp bảng trong kịch bản). `timeline.evaluate(t)` đặt
   mọi thuộc tính cho đúng frame đó, không cộng dồn delta, nên seek tới đâu cũng ra đúng hình
   và xuất video ra từng frame giống hệt.
2. **Nhân vật chỉ có các số đơn giản** (`squash`, `eyeOpen`, `gaze`, `shake`...). Hàm `update(t)`
   biến chúng thành transform. Ví dụ squash: `scaleY = s`, `scaleX = scaleZ = 1/√s` để giữ thể tích,
   pivot ở đáy nên Mochi dẹt xuống mặt đất.
3. **Cắt cảnh camera**: dùng ease `'step'` trên keyframe, giữ giá trị cũ rồi nhảy ngay tại mốc đó.
4. **Âm thanh**: AudioManager phát cue khi thời gian chạy qua mốc của nó (khi seek thì không phát
   dồn). Thêm file thật: bỏ file vào `public/assets/audio/` và khai báo trong `config/assets.ts`
   với đúng `id` của cue.
5. **Xuất video**: thời gian đi theo bước cố định (frame / 30) nhưng vẫn chạy theo nhịp thời gian thực,
   vì MediaRecorder và WebAudio cần thời gian thật. File WebM từ trình duyệt không ghi sẵn
   thời lượng trong header; chuyển qua ffmpeg (lệnh ở trên) là có.

## Thêm cảnh mới

1. Tạo `src/scenes/scene03Balloons.ts` theo mẫu `scene02Jump.ts` (`start`, `end`, `build`).
2. Thêm vào `SCENES` trong `src/scenes/index.ts`.
3. Thêm cue âm thanh vào `src/audio/cues.ts`.
