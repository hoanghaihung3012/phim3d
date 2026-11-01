# Táo Muốn Bay 🍎☁️

Phim hoạt hình ngắn (~100 giây) **2D nét vẽ tay**: giấy trắng, nét xám đen dày bo tròn, tô màu phẳng,
mắt chấm, má hồng, chữ viết tay cho tiếng động ("CỘP.", "BÉP!") và lời thoại. Vẽ bằng Canvas 2D,
trình chiếu qua **Three.js** (CanvasTexture), dựng bằng **Vite + TypeScript**, chạy trên trình duyệt.
Kịch bản: `docs/script.md` (branch `claude/project-thread-i47943`).

## Chạy thử (Windows / macOS / Linux)

Cần Node.js 20+.

```bash
npm install
npm run dev        # mở http://localhost:5173
```

- **Space**: play / pause · **← / →**: lùi/tiến 1 hình vẽ (giữ Shift = 1 giây)
- Kéo thanh seek để nhảy tới bất kỳ giây nào. Mở `http://localhost:5173/?t=18` để vào thẳng giây 18.
- Nút **⏺ Xuất WebM**: render lại toàn bộ phim ở 1920×1080 (kèm âm thanh) và tải file `.webm` về.
- **Xuất MP4 trực tiếp** (không cần ghi thời gian thực, cần `ffmpeg` và Playwright + Chromium):
  `npm run build:preview` rồi `npm run export:mp4 -- tao-muon-bay.mp4`. Script mở bản preview trong
  Chromium ẩn, chụp từng hình vẽ (12/giây), render âm thanh offline, rồi ghép bằng ffmpeg (H.264 + AAC, 30 fps).

Kiểm tra code: `npm run typecheck` · Build tĩnh: `npm run build` (ra `dist/`)
· Preview 1 file HTML để chia sẻ: `npm run build:preview` → `dist-preview/index.preview.html`.

**Clip mới: "Ảnh gia đình"** (~63 giây, cả nhà Táo: Ba, Mẹ, chị Nấm, Sâu, Vịt): mở
`http://localhost:5173/anh-gia-dinh.html`. Kịch bản và cách xuất MP4: `docs/episodes/anh-gia-dinh.md`.

Bản 3D cũ vẫn chạy ở `film3d.html` (code trong `src/core`, `src/characters`, `src/props`, `src/scenes`).
Bản thử nhân vật 2D đầu tiên: `experiments/apple-2d/`.

## Cấu trúc phim 2D

```
src/
  main.ts                 khởi động phim 2D
  film2d/
    boot.ts               timeline + HUD + recorder; vẽ "on twos" 12 hình/giây
    Stage2D.ts            canvas 1920x1080 -> CanvasTexture trên plane Three.js
    Camera2D.ts           camera 2D (x, y, zoom, rot, shake), có parallax cho nền
    Keyer.ts              k.set(t, obj, {...}) đổi tức thì · k.to(t0, t1, obj, {...}, ease) chuyển động
    drawFrame.ts          vẽ 1 khung hình theo thứ tự lớp
    cast.ts               danh sách diễn viên/đạo cụ + kiểu Scene2D
    cues.ts               mọi cue âm thanh của phim 2D
    doodle/
      Sketch.ts           nét vẽ tay: rung nét (line boil), tube viền, blob, scallop
      style.ts            màu giấy, mực, độ dày nét, font Itim, bảng màu
    characters/           Apple2D (Táo Lém), Cloud2D (Bé Mây), Sparrow2D (Sẻ Bông)
    props/                Tree2D, Ground2D, Sky2D, Balloons2D, Seesaw2D, Texts (chữ, phụ đề, title)
    scenes/               scene01Hanging ... scene06Ending (thời gian tuyệt đối theo kịch bản)
  core/                   Timeline, Playback, Recorder, easing (dùng chung với bản 3D)
  audio/                  AudioManager + synth (hiệu ứng tổng hợp bằng WebAudio)
  config/                 film.ts (độ phân giải, fps), assets.ts (MỌI đường dẫn file)
```

## Cách hoạt động (ngắn gọn)

1. **Mọi thứ là hàm của thời gian `t`.** Mỗi cảnh khai báo keyframe theo giây tuyệt đối (khớp bảng
   trong kịch bản) qua `Keyer`. `timeline.evaluate(t)` đặt mọi thuộc tính cho đúng khung đó, nên seek
   tới đâu cũng ra đúng hình và xuất video ra từng frame giống hệt.
2. **Nhân vật chỉ là các con số** (`eyes`, `mouth`, `leaf`, `legs`, `sx/sy`, `tilt`...). Biểu cảm là chỉ số
   trong `EYES` / `MOUTHS`, đổi tức thì bằng `k.face(t, apple, 'smug', 'smirk')` cho đúng kiểu hài mặt đơ.
3. **Cảm giác vẽ tay:** thời gian được làm tròn xuống 12 hình/giây; mỗi hình vẽ lại nét với 1 trong 3 seed
   nhiễu nên đường viền "rung" nhẹ như phim vẽ tay. Độ dày nét tính theo pixel màn hình nên cận cảnh
   hay toàn cảnh nét vẫn đều.
4. **Cắt cảnh camera**: `cut(k, t, cam, x, y, zoom)` (đổi tức thì) và `pan(...)` (di chuyển).
5. **Âm thanh**: AudioManager phát cue khi thời gian chạy qua mốc của nó. Thêm file thật: bỏ vào
   `public/assets/audio/` và khai báo trong `config/assets.ts` với đúng `id` của cue (ví dụ thu giọng
   "Ờ." thật cho `sfx_o`).

## Sửa / thêm cảnh

1. Mở `src/film2d/scenes/sceneXX*.ts`, chỉnh mốc thời gian hoặc giá trị trong `k.set` / `k.to`.
2. Cảnh mới: tạo file theo mẫu, thêm vào `SCENES_2D` trong `src/film2d/scenes/index.ts`
   (phải theo thứ tự thời gian), thêm cue vào `src/film2d/cues.ts`.
