# Táo #10 · "Thả diều" (clip ~50 giây)

Phong cách: theo truyện tranh #3 (trời xanh nhạt, đồi cỏ xanh, cây tròn, mây trắng viền đậm,
nhân vật tròn, tô phẳng pastel, nét viền đậm). Nhân vật: Táo, Vịt (dáng tròn như truyện), Sâu.

- Code: `src/episodes/thaDieu/`, trang `tha-dieu.html`. Bối cảnh, diều, gió: `src/film2d/props/Meadow2D.ts`.
  Vịt dáng tròn: `Duckling2D.round = 1`.
- Xuất MP4: `npm run build:preview -- tha-dieu` rồi `node scripts/export-mp4.mjs out.mp4 --page tha-dieu`.

| Thời gian | Diễn biến |
|---|---|
| 0:00-0:03 | Tựa "THẢ DIỀU · TÁO #10" trên nền trời. Gió thổi sang phải suốt tập (vệt gió, lá bay). |
| 0:03-0:09 | Vịt chạy vào khoe diều: "Diều của tớ to nhất xóm!" Táo ngồi cạnh Sâu: "Ờ." |
| 0:09-0:13 | Vịt chạy sang phải (xuôi gió), diều lết dưới cỏ "lạch cạch...". "Hửm?" |
| 0:13-0:17 | "Lần này chạy thật nhanh!" Chạy nhanh hơn, vấp, "BỊCH!", diều rơi trúng đầu. |
| 0:17-0:23 | Táo không nhúc nhích: "Cậu chạy xuôi gió." "Chạy ngược lại xem." Vịt: "Hả?" |
| 0:23-0:28 | Vịt chạy ngược gió, diều vút lên cao. "BAY RỒI!!" "Thấy chưa! Cao nhất xóm!" |
| 0:28-0:35 | Gió giật "VÙÙÙ!" nhấc luôn Vịt lên trời, trôi theo gió. Đầu dây lết trên cỏ tới chỗ Táo. |
| 0:35 | Táo, vẫn ngồi, đặt tay lên dây: "bộp." Vịt dừng lại lơ lửng như một con diều thứ hai. |
| 0:35-0:43 | Vịt: "Táo ơi! Kéo tớ xuống với!" Táo: "Đợi gió đổi chiều." Vịt: "...Bao giờ đổi?" (dế kêu) Táo: "Mai." |
| 0:43-0:49 | Toàn cảnh: Táo ngồi giữ dây, Vịt và diều bay trên trời. Sâu ngẩng lên: "..." HẾT. |

## Lồng tiếng Việt (dub)

- Giọng: Vịt = ElevenLabs "Yuna" (bé gái tinh nghịch), Táo = "Quốc Việt" (giọng nam trẻ, đọc đều đều). Model eleven_v4.
- File giọng đã chọn: `assets/voice/tha-dieu/01..14.mp3`; bảng thời điểm + âm lượng: `docs/episodes/tha-dieu.dub.json`.
- Lưu ý: với câu rất ngắn ("Ờ.", "Hả?", "Mai.") TTS đọc luôn cả thẻ cảm xúc trong ngoặc vuông, nên dùng `skip` để bỏ đoạn đầu. Lần sau nên viết câu ngắn không kèm thẻ.
- Xuất lại:
  ```
  node scripts/build-preview.mjs tha-dieu
  NODE_PATH=/opt/node22/lib/node_modules node scripts/export-mp4.mjs nobabble.mp4 --page tha-dieu --query nobabble
  node scripts/mix-dub.mjs nobabble.mp4 docs/episodes/tha-dieu.dub.json tao-tha-dieu-long-tieng.mp4
  ```
