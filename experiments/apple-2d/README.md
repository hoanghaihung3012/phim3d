# Clip ngắn: Táo chào mọi người (2D nét vẽ tay)

Bản thử nhân vật Táo Lém theo phong cách 2D tối giản: viền đậm bo tròn màu xám đen, tô phẳng,
mắt chấm, má hồng, tay chân "sợi mì" ngắn, mặt bình thản, ít cảm xúc. Thiết kế riêng cho quả táo, chỉ học nét vẽ
(không sao chép nhân vật nào).

## Chạy thử

```bash
npm install
npm run dev            # mở http://localhost:5173/experiments/apple-2d/
npm run build:preview -- experiments/apple-2d/index   # ra 1 file HTML tự chứa
```

Trang tự chạy một clip ~15 giây, lặp lại: Táo chào ("Ờ thì... mình là Táo."), "Táo ít nói...
lâu lâu mới cười.", cười một cái, thở dài, rồi "Ờ. Vậy thôi." Nút "Xem lại" chạy lại từ đầu.

Xuất MP4 (1920x1080):

```bash
node scripts/build-preview.mjs experiments/apple-2d/index
node scripts/export-mp4.mjs tao-chao-moi-nguoi.mp4 --page experiments/apple-2d/index
```

## Cách làm

| File | Vai trò |
|------|---------|
| `sketch.ts` | Nét vẽ tay: làm rung điểm bằng nhiễu mượt, nối thành đường cong; "line boil" bằng cách đổi seed 3 lần lặp lại |
| `AppleDoodle.ts` | Vẽ cả nhân vật từ một `Pose` (các con số: lift, squash, mắt, miệng, lá, tay, chân, hiệu ứng) |
| `actions.ts` | Các clip diễn: hàm `t -> Pose`, biểu cảm đổi tức thì cho đúng kiểu hài ít nói |
| `intro.ts` | Kịch bản clip: thứ tự các đoạn diễn, phụ đề, cue âm thanh |
| `main.ts` | Ghép nhân vật + phụ đề vào khung 1920x1080, hiện bằng Three.js (`CanvasTexture` trên plane); có `window.__film` để xuất MP4 |

Vì nhân vật nằm trên một plane Three.js, sau này có thể đặt thẳng vào cảnh 3D như một billboard
(kiểu phim 2.5D), hoặc dùng `Pose` để keyframe bằng `Timeline` của phim.
