# Táo #12 · "Trốn tìm" (clip dọc Reels, 25 giây)

Clip dọc 9:16 (1080x1920) cho Facebook Reels, phong cách truyện #3 / "Thả diều".
Nhân vật: Táo, Vịt (dáng tròn), Sâu. Gag mới, không trùng các truyện #1-#11 và các clip trước.

- Code: `src/episodes/tronTim/`, trang `tron-tim.html`. Cây táo và bụi cây: `src/film2d/props/AppleTree2D.ts`.
- Khung dọc: `setFilmFormat('vertical')` trong `src/config/film.ts` (gọi trước `bootFilm2D`).
- Vùng an toàn Reels: `REELS_SAFE` (chừa 270 px trên, 670 px dưới, 160 px bên phải cho nút like/comment).
  Bong bóng thoại tự kẹp trong vùng này (`Bubbles.safe`). Mở trang với `?safe` để thấy khung kiểm tra.
- Táo có thêm `face` (0 = quay lưng / quả táo thường) và `reachR` (tay phải dài ra như sợi mì).

| Thời gian | Diễn biến |
|---|---|
| 0:00-0:02.6 | HOOK: cận tán cây đầy táo, chữ "TÁO ĐANG TRỐN TRÊN CÂY / BẠN TÌM RA KHÔNG?". Vịt (ngoài hình): "Tám... chín... mười!" Táo ló mặt đúng 1 nhịp rồi quay lưng lại. |
| 0:02.6-0:07 | Vịt: "Tớ đi tìm đây!" Chạy ra bụi cây, nhìn sau bụi: "Hừm. Không có." |
| 0:07-0:10 | Sâu ngẩng lên nhìn cây: "...". Vịt nhìn theo: "A ha! Trên cây!" |
| 0:10-0:12.4 | Toàn cảnh cây: mười mấy quả giống hệt nhau. Vịt đổ mồ hôi: "Ơ... quả nào nhỉ?" |
| 0:12.4-0:14.7 | Vịt cười gian: "Rung cây là biết ngay!" |
| 0:14.7-0:16.2 | RUNG! RUNG! Cả cây rung. |
| 0:16.2-0:18.4 | Táo rơi hết. Ba quả rơi trúng đầu Vịt (CỘP! "Ui! Ui da! Ui!"), còn lại chất thành đống vùi Vịt. Chỉ một quả còn treo: Táo, thò một cánh tay dài ra bám cành ("bộp."). |
| 0:18.9-0:21.4 | Vịt từ đống táo: "Sao... cậu không rơi?" |
| 0:21.5-0:23.4 | Cận Táo, quay mặt lại, mặt đơ: "Tớ có tay." (punchline) |
| 0:23.5-0:25.4 | Sâu ngồi gặm một quả táo: "...". Chữ "TÁO #12 · TRỐN TÌM". Không fade đen để Reels lặp lại mượt. |

## Lồng tiếng

- Vịt = ElevenLabs "Yuna", Táo = "Quốc Việt", model eleven_v4. File: `assets/voice/tron-tim/01..09.mp3`,
  bảng thời điểm `docs/episodes/tron-tim.dub.json` (âm lượng chuẩn Reels -14 LUFS qua `loudnessLufs`).
- Xuất lại:
  ```
  node scripts/build-preview.mjs tron-tim
  NODE_PATH=/opt/node22/lib/node_modules node scripts/export-mp4.mjs nobabble.mp4 --page tron-tim --query nobabble
  node scripts/mix-dub.mjs nobabble.mp4 docs/episodes/tron-tim.dub.json tao-tron-tim.mp4
  ```

## Caption gợi ý

Táo trốn tìm giỏi nhất xóm 🍎 Bạn tìm ra Táo trong 2 giây đầu không? 👀
Chuyện nhà Táo #12 · Trốn tìm
#ChuyenNhaTao #Tao #HoatHinh #HoatHinhVui #PhimHoatHinh #Reels #ReelsVietNam #VideoHai #Cute #TronTim
