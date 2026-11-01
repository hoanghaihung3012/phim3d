# Táo · "Ảnh gia đình" (clip ngắn ~63 giây)

Clip hoạt hình 2D vẽ tay, cùng phong cách với "Táo Muốn Bay" (giấy trắng, nét viền đậm,
tô phẳng pastel, mắt chấm, má hồng, line boil 12 hình/giây). Nhân vật và gag tự sáng tác.

- Code: `src/episodes/anhGiaDinh/` (cảnh, cast, vẽ khung hình, cue âm thanh); trang `anh-gia-dinh.html`.
- Nhân vật mới (dùng lại được cho các tập sau): `src/film2d/characters/Person2D.ts` (Ba, Mẹ),
  `Duckling2D.ts` (Vịt), `Caterpillar2D.ts` (Sâu), phòng khách `src/film2d/props/LivingRoom2D.ts`,
  bong bóng thoại `src/film2d/props/Bubbles.ts`.
- Xem thử: `npm run dev` rồi mở `/anh-gia-dinh.html` (`?t=24` để nhảy tới giây 24).
- Xuất MP4: `npm run build:preview -- anh-gia-dinh` rồi `node scripts/export-mp4.mjs out.mp4 --page anh-gia-dinh`.

## Bản "nét mảnh" (anh-gia-dinh-net.html)

Cùng kịch bản và âm thanh, đổi cách vẽ cho tối giản hơn: giấy trắng tinh, nét đen mảnh gần như
không rung, màu gần như trắng hết (chỉ Táo giữ màu đỏ), phòng chỉ còn đường sàn, sofa và tranh,
nét đứng yên (không line boil) và diễn hoạt "tiết kiệm" 8 hình/giây.
Theme nằm ở `src/film2d/doodle/themes.ts` (`LINE_THEME`), dùng được cho mọi phim 2D qua `Sketch.theme`.
Xuất MP4: `npm run build:preview -- anh-gia-dinh-net` rồi `node scripts/export-mp4.mjs out.mp4 --page anh-gia-dinh-net`.

## Ý tưởng

Vịt chụp giúp nhà Táo một tấm ảnh gia đình. Lần nào cũng hỏng một người. Lần cuối ai cũng đẹp,
chỉ có Táo vẫn mặt đơ ("Em đang cười mà."). Máy sắp hết pin, Táo buông câu thông minh:
quay video rồi chọn khung đẹp nhất. Tua lại thì thấy đúng **một khung hình** Táo cười
(luật của Táo: chỉ cười 1 khung). Stinger: tấm nào Sâu cũng đẹp.

## Kịch bản theo thời gian

| Thời gian | Cảnh | Diễn biến |
|---|---|---|
| 0:00-0:03 | Tựa | "ẢNH GIA ĐÌNH" · nhà Táo |
| 0:03-0:08 | Phòng khách, toàn cảnh | Mẹ: "Vịt ơi, chụp giúp cô một tấm nhé!" Vịt (đứng trên ghế đẩu, cầm máy ảnh): "Dạ! Cả nhà cười lên nào!" |
| 0:08-0:13 | Góc máy ảnh của Vịt | "Một... Hai..." Nấm quay sang: "Ơ Táo, mũ chị có lệch không?" "BA!" Tách. Tấm 1: Nấm nhắm mắt há miệng. |
| 0:13-0:15 | Nấm + Táo | Nấm nổi cáu một giây: "Chị đang nói mà! Chụp lại đi!" rồi vui lại ngay. |
| 0:15-0:20 | Góc máy ảnh | Ba ngứa mũi: "Ha... ha..." "BA!" HẮT XÌ! Tấm 2: Ba hắt xì, Mẹ giật mình, Nấm hoảng, Táo vẫn đơ. |
| 0:20-0:22 | Ba + Mẹ | Mẹ lườm. Ba toát mồ hôi: "Xin lỗi... bụi thôi mà." |
| 0:22-0:27 | Toàn cảnh, góc máy ảnh | "Lần này phải đẹp! Một... hai... BA!" Tấm 3: ai cũng cười tươi, trừ Táo. Dế kêu. |
| 0:27-0:29 | Nấm + Táo | Cả nhà quay sang Táo. Nấm (dữ): "TÁO! CƯỜI LÊN COI!" |
| 0:29-0:33 | Cận Táo, rồi Ba + Mẹ | Táo: "Em đang cười mà." Ba Mẹ nhìn nhau. Ba: "...Thật hả?" |
| 0:33-0:41 | Vịt, cận Táo, toàn cảnh | Vịt: "Ơ... máy sắp hết pin rồi!" Táo: "Vịt. Quay video đi." "Rồi chọn khung đẹp nhất." Cả nhà sững lại. Mẹ: "Ồ... thông minh ghê!" |
| 0:41-0:46 | Góc máy ảnh, REC | Cả nhà giữ nụ cười... giữ mãi... Ba run, mồ hôi; Mẹ run; Nấm mệt; Sâu ngọ nguậy. Ở đúng 1 hình (0:43.5) Táo cười. "XONG!" cả nhà xẹp. |
| 0:46-0:51 | Màn hình máy ảnh | "Tua... tua..." dừng ở khung 0:43.5, phóng to vào Táo đang cười. Nấm: "Ơ! TÁO CƯỜI KÌA!!" |
| 0:51-0:54 | Cận Táo | Mặt đơ. "Ờ." ... "Một khung thôi." |
| 0:54-1:01 | Tranh trên tường, lùi ra toàn cảnh | Tấm ảnh đẹp nhất đã được treo lên tường. Mẹ: "Mà công nhận... tấm nào Sâu cũng đẹp." Sâu đỏ mặt: "..." |
| 1:01-1:03 | Hết | HẾT |

## Ghi chú kỹ thuật

- Ảnh polaroid và video trên màn hình máy ảnh là **render lại thật** của cảnh tại thời điểm
  bấm máy, qua khung hình cố định của máy Vịt (`photoCam`), nên luôn khớp với những gì diễn ra.
- Khung Táo cười là đúng 1 hình vẽ (1/12 giây) tại `PERFECT_T`; tua video sẽ dừng đúng ở đó.
- Âm thanh là synth tạm: tiếng "lẩm bẩm" theo nhịp thoại cho từng nhân vật (giọng Táo đều đều),
  tiếng chụp ảnh, hắt xì, dế kêu, tua video, nhạc nền ukulele ngắt ở mỗi lần chụp và mỗi khoảng lặng.
  Thoại đọc qua bong bóng chữ IN HOA như truyện tranh. Có thể thay bằng giọng thu thật sau.
