# Táo Ờ · "Bập bênh" (clip dọc Reels, 33 giây)

Clip dọc 9:16 (1080x1920) cho Facebook Reels, phong cách truyện #3 / "Trốn tìm".
Nhân vật: Táo, Vịt (dáng tròn), Sâu. Gag mới, không trùng các truyện và clip trước.

- Code: `src/episodes/bapBenh/`, trang `bap-benh.html`. Bập bênh: `src/film2d/props/PlaygroundSeesaw2D.ts`.
- Người ngồi trên ván: `BapBenhFx.<ai>Ride` = 1 thì `drawFrame` đặt nhân vật lên ván ở vị trí `<ai>U`
  (-1 đầu trái, 0 giữa, +1 đầu phải) và nghiêng theo ván; = 0 thì dùng x / y đã key.
- Khung dọc + vùng an toàn Reels như "Trốn tìm" (`setFilmFormat('vertical')`, `REELS_SAFE`, `?safe`).

| Thời gian | Diễn biến |
|---|---|
| 0:00-0:03.3 | HOOK: chữ "ĐỪNG CHƠI BẬP BÊNH / VỚI TÁO". Vịt ngồi một đầu: "Táo ơi! Chơi bập bênh đi!" Táo đi vào: "Ờ." |
| 0:03.3-0:04.6 | Táo nhảy lên đầu kia. CỘP! Ván sập, Vịt bị hất lên (VÚT!) rồi kẹt trên cao. |
| 0:04.6-0:08 | Vịt đạp chân: "Hự! Hự! Cậu nặng quá!" Táo bên dưới thở dài. |
| 0:08-0:13.6 | "Sâu ơi! Lên giúp tớ với!" Sâu bò dọc ván lên ngồi cạnh Vịt. Không nhúc nhích. Sâu: "..." |
| 0:13.6-0:15.8 | Vịt đổ mồ hôi: "Vẫn không được!" |
| 0:15.8-0:18.4 | Táo lặng lẽ nhích vào gần giữa (xịch. xịch. xịch.). Ván cân lại. Vịt: "Ơ? Ơ? Ơ?" |
| 0:18.4-0:21 | Bập bênh nhẹ nhàng. Vịt: "Hay quá! Sao cậu làm được vậy?" |
| 0:21.1-0:23.4 | Cận Táo, mặt đơ: "Ngồi gần giữa thì nhẹ hơn." (câu thông minh, đúng nguyên lý đòn bẩy) |
| 0:23.5-0:25.6 | Vịt: "À! Vậy tớ cũng ngồi gần giữa!" và nhích vào giữa. |
| 0:25.6-0:28 | CỘP! Ván sập về phía Táo, Vịt và Sâu bị hất bay lên trời. "Á á á á á!" |
| 0:28.1-0:30.6 | Cận Táo nhìn lên trời: "Giờ cậu còn nhẹ hơn." (punchline) |
| 0:30.7-0:33 | Sâu rơi xuống đậu trên đầu Táo ("bộp."), "...". Chữ "TÁO Ờ · BẬP BÊNH". |

## Lồng tiếng

- Vịt = ElevenLabs "Yuna", Táo = "Quốc Việt", model eleven_v4, flow `R1l3uYS24i4cBEmidKZv`
  (11 câu, mỗi câu 2 bản). File: `assets/voice/bap-benh/01..11.mp3`, thời điểm trong `docs/episodes/bap-benh.dub.json`.
- Đã chọn bản 1 cho mọi câu, riêng câu 03 và 09 dùng bản 2 (ngắn hơn, không đè câu sau). Tải bản thu cần mạng cho phép `elevenlabsusercontent.com`.
- Bản cuối: `/mnt/project-files/video/tao-bap-benh.mp4` (33 giây, -14 LUFS).
- Xuất lại:
  ```
  node scripts/build-preview.mjs bap-benh
  NODE_PATH=/opt/node22/lib/node_modules node scripts/export-mp4.mjs nobabble.mp4 --page bap-benh --query nobabble
  node scripts/mix-dub.mjs nobabble.mp4 docs/episodes/bap-benh.dub.json tao-bap-benh.mp4
  ```

## Caption

Xem `/mnt/project-files/fb/bap-benh/caption.txt`.
