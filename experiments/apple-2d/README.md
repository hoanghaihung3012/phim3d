# Thử nghiệm: Táo Lém 2D nét vẽ tay

Bản thử nhân vật Táo Lém theo phong cách 2D tối giản: viền đậm bo tròn màu xám đen, tô phẳng,
mắt chấm, má hồng, tay chân "sợi mì" ngắn, mặt bình thản, hơi cười. Thiết kế riêng cho quả táo, chỉ học nét vẽ
(không sao chép nhân vật nào).

## Chạy thử

```bash
npm install
npm run dev            # mở http://localhost:5173/experiments/apple-2d/
npm run build:preview -- experiments/apple-2d/index   # ra 1 file HTML tự chứa
```

Phím `1`–`8` hoặc các nút để diễn: Đơ, Liếc, Giật mình, Nhếch mép, Thở dài, Chạy, Rơi CỘP, Vui.
"Tự diễn" chạy lần lượt cả 8 kèm phụ đề. Có 3 bảng màu (đỏ, xanh, trắng nét) và công tắc 12 fps.

## Cách làm

| File | Vai trò |
|------|---------|
| `sketch.ts` | Nét vẽ tay: làm rung điểm bằng nhiễu mượt, nối thành đường cong; "line boil" bằng cách đổi seed 3 lần lặp lại |
| `AppleDoodle.ts` | Vẽ cả nhân vật từ một `Pose` (các con số: lift, squash, mắt, miệng, lá, tay, chân, hiệu ứng) |
| `actions.ts` | Các clip diễn: hàm `t -> Pose`, biểu cảm đổi tức thì cho đúng kiểu hài ít nói |
| `main.ts` | Three.js: canvas của nhân vật làm `CanvasTexture` dán lên một plane, camera orthographic |

Vì nhân vật nằm trên một plane Three.js, sau này có thể đặt thẳng vào cảnh 3D như một billboard
(kiểu phim 2.5D), hoặc dùng `Pose` để keyframe bằng `Timeline` của phim.
