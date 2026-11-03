# Táo Ờ · "Táo bón" (clip dọc Reels, khoảng 32 giây)

Clip dọc 9:16 (1080x1920) cho Facebook Reels, chuyển thể từ truyện tranh Táo #11 "Táo bón",
phong cách truyện #3 / "Trốn tìm" / "Bập bênh". Bối cảnh: phòng ngủ của Vịt (tường kem, sàn gỗ,
giường chăn xanh, cửa vàng).

Nhân vật: Táo, Vịt (đang ốm), Gà trắng, Chó be, Mèo xám (ba bạn đến thăm), Sâu.
Táo ít nói nhưng tốt bụng: tự nấu cháo, thổi nguội từng muỗng cho bạn.

| Thời gian | Diễn biến |
|---|---|
| 0:00-0:02.8 | MỞ ĐẦU (hook): Táo cận mặt, mặt đơ, cầm bát cháo bốc khói. Chữ "TÁO Ờ" nhỏ và tên tập "TÁO BÓN" to, nảy vào. Ngoài hình nghe Vịt ho "khụ khụ". |
| 0:02.8-0:06.5 | Toàn cảnh phòng: Vịt nằm trên giường, túi chườm trên đầu, nhiệt kế trong mỏ, mồ hôi: "Tớ ốm rồi... không cầm muỗng nổi." |
| 0:06.5-0:09 | Cửa mở, Táo bưng bát cháo vào (Sâu bò theo sau): "Để tớ bón cho." |
| 0:09-0:11.5 | Táo múc một muỗng, thổi "phù... phù..." thật cẩn thận cho nguội (khoảnh khắc tốt bụng). |
| 0:11.5-0:14.5 | Táo rút ra cây muỗng dài ngoằng, đứng thật xa đưa tới mỏ Vịt: "Há miệng ra. A~" Vịt: "A~" (măm), cười híp mắt. |
| 0:14.5-0:16 | Cửa hé mở: Gà xách giỏ trái cây ló đầu vào thăm, thấy cảnh đó thì tròn mắt, rơi giỏ, quay đầu chạy biến. |
| 0:16-0:18.5 | Ngoài sân: Chó và Mèo đang đứng đợi. Gà chạy ào tới, hoảng hốt: "Trời ơi! Vịt bị táo bón kìa!!" Chó, Mèo giật mình, giọt mồ hôi, rồi cả ba ùa vào phòng. |
| 0:18.5-0:21.5 | Trong phòng, ba bạn đứng ở cửa. Cận Táo, mặt đơ: "Vịt không BỊ Táo bón. Vịt ĐƯỢC Táo bón." (chơi chữ, chữ BỊ / ĐƯỢC nhấn mạnh) |
| 0:21.5-0:23 | Ba bạn: "..." (dế kêu). Vịt: "A~ nữa!" |
| 0:23-0:26.5 | Gà, Chó, Mèo nhìn nhau rồi đồng thanh: "Tụi tớ cũng muốn được Táo bón!" |
| 0:26.5-0:29.5 | Cận Táo, thở dài nhẹ: "Xếp hàng." (punchline) |
| 0:29.5-0:32 | Toàn cảnh: Gà, Chó, Mèo xếp hàng há miệng "A~", cuối hàng là Sâu cũng há miệng "...". Táo đưa muỗng dài bón lần lượt (bóc, bóc, bóc). Chữ "TÁO Ờ · TÁO BÓN". |

## Âm thanh

- KHÔNG lồng tiếng (chị chốt 2026-11-03): chỉ bong bóng thoại, nhạc nền và tiếng động. Synth babble luôn tắt (`setBabble(false)`).
- Hiệu ứng mạnh cho cuốn hút: nền tia truyện tranh (`TaoBonFx.burst`) ở cận mặt, zoom giật (`crash`), rung camera, chữ tượng thanh (VÚT!, MĂM!, RẦM!, HẢ?!).
- Bản thu ElevenLabs đã lỡ tạo trước khi chị dặn (flow `1LITN00898ijedA94A3U`, 2 bản mỗi câu) để ở `assets/voice/tao-bon/` nếu sau này cần bản lồng tiếng.
- Bản cuối: `/mnt/project-files/video/tao-tao-bon.mp4` (32,5 giây, khoảng -14 LUFS).
- Xuất lại:
  ```
  node scripts/build-preview.mjs tao-bon
  NODE_PATH=/opt/node22/lib/node_modules node scripts/export-mp4.mjs raw.mp4 --page tao-bon
  ffmpeg -i raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=20:linear=false,volume=3.4dB,alimiter=limit=0.79" -c:a aac -b:a 192k tao-tao-bon.mp4
  ```

## Caption

Xem `/mnt/project-files/fb/tao-bon/caption.txt`.
