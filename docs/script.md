# Kịch bản: "Mochi Muốn Bay" (Mochi Wants to Fly)

> Phim hoạt hình 3D ngắn, ~95 giây, không lời thoại (chỉ âm thanh cảm thán + nhạc).
> Dựng bằng Three.js, nhân vật ghép từ hình khối cơ bản, chuyển động procedural.

---

## 0. Các ý tưởng đã cân nhắc

| # | Ý tưởng | Nhận xét |
|---|---------|----------|
| A | **Mochi Muốn Bay** – cục mochi tròn tìm đủ cách để bay lên như đám mây | Gag rõ ràng, nhân vật chỉ là hình cầu → dễ squash & stretch nhất. **Chọn.** |
| B | Robot tưới cây – robot nhỏ tưới một mầm cây, cây lớn quá nhanh và nuốt luôn cái nhà | Vui, nhưng cây mọc procedural tốn công hơn. |
| C | Bánh bao đi picnic – bánh bao bị đàn kiến khiêng đi mất | Nhiều nhân vật nhỏ (kiến), cần crowd animation. |

Lý do chọn A: 3 nhân vật, tất cả làm từ sphere/cone/capsule; mỗi gag là một "thử – thất bại" lặp lại, rất hợp timing hài (rule of three) và dễ chia scene.

---

## 1. Logline

Một cục mochi tròn vo sống trên đồi cỏ mơ ước được bay lên trời chơi với Bé Mây. Mochi thử nhảy, thử bóng bay, thử máy phóng tự chế… lần nào cũng thất bại thảm hại, cho đến khi Bé Mây nghĩ ra cách đơn giản nhất.

**Thông điệp:** bạn bè giúp nhau thì việc khó cũng thành dễ.

---

## 2. Nhân vật

### Mochi (nhân vật chính)
- **Hình khối:** 1 `SphereGeometry` (bán kính 1) làm thân, scale theo trục để squash & stretch. Hai mắt là sphere đen nhỏ có chấm trắng highlight, má hồng là 2 đĩa `CircleGeometry` mờ. Hai tai/chỏm nhỏ (sphere scale dẹt) trên đầu.
- **Màu:** hồng đào pastel `#FFC7D1`, má `#FF8FA3`.
- **Tính cách:** hăng hái, lì lợm, ngã là bật dậy ngay.
- **Biểu cảm (procedural):** mắt scale Y = 0.1 → nhắm/chớp; mắt to ×1.4 → ngạc nhiên; mắt cong (thay bằng torus nửa vòng) → vui sướng; miệng là torus nhỏ, đổi scale để há/ngậm.
- **Âm thanh đặc trưng:** "mo~" (vui), "hự!" (cố gắng), "ui da" (ngã) – dùng sample ngắn, pitch cao.

### Bé Mây (bạn)
- **Hình khối:** cụm 5–6 sphere trắng chồng nhau (`Group`), mắt hạt đậu. Lơ lửng nhấp nhô bằng `sin(t)`.
- **Màu:** trắng kem `#FFFFFF` → bóng xanh nhạt `#DDEBFF`.
- **Tính cách:** hiền, hơi ngái ngủ, hay cười khúc khích.
- **Âm thanh:** tiếng chuông gió nhỏ khi cười.

### Sẻ Bông (nhân vật phụ gây rối)
- **Hình khối:** sphere vàng làm thân, cone cam làm mỏ, 2 cánh là sphere dẹt vỗ bằng `sin(t*20)`.
- **Màu:** vàng chanh `#FFE58A`, mỏ `#FFA94D`.
- **Vai trò:** vô tình làm hỏng gag bóng bay. Không phải phản diện, chỉ tò mò.

---

## 3. Bối cảnh & phong cách

- **Đồi cỏ:** một bán cầu lớn màu xanh bạc hà `#BDEBC4`, vài bụi cây là cụm sphere, vài bông hoa (cylinder + sphere).
- **Bầu trời:** gradient (shader hoặc `scene.background` dùng CanvasTexture) từ xanh `#BFE3FF` xuống hồng nhạt `#FFE3EC`.
- **Ánh sáng:** `HemisphereLight` (trời xanh / đất xanh lá) + 1 `DirectionalLight` ấm có shadow mềm (`PCFSoftShadowMap`). Có thể thêm fog nhẹ cho chiều sâu.
- **Vật liệu:** `MeshToonMaterial` (gradientMap 3 bậc) hoặc `MeshStandardMaterial` roughness cao để ra cảm giác đất sét mềm.
- **Tỷ lệ khung hình:** 16:9, 1920×1080, 30 fps.

---

## 4. Phân cảnh (Scene breakdown)

Tổng thời lượng: **~95 giây**. Mốc thời gian tính theo giây từ đầu phim.

### Scene 1 – "Ước mơ" (0:00 – 0:14)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:00–0:04 | Wide shot từ trên cao, dolly xuống chậm về phía đồi | Mở màn: trời xanh, mây trôi. Title "Mochi Muốn Bay" fade in/out. | Nhạc nền nhẹ (ukulele/glockenspiel) bắt đầu. Chim hót. |
| 0:04–0:09 | Medium shot ngang tầm Mochi | Mochi nằm ngửa trên cỏ (thân scale dẹt 1.3/0.75/1.3), ngón chân… à không, cả người đung đưa theo nhịp. Mắt nhìn lên trời. | Mochi ngân "mo~ mo~". |
| 0:09–0:14 | Over-the-shoulder từ sau Mochi nhìn lên trời | Bé Mây bay ngang, vẫy tay (một sphere nhỏ nhô ra), cười khúc khích rồi trôi lên cao. Mochi bật dậy (squash → stretch mạnh), mắt lấp lánh. | Chuông gió. Hiệu ứng "ting!" khi mắt Mochi sáng. |

**Gag:** Không có; thiết lập mục tiêu: *Mochi muốn lên chỗ Bé Mây.*

### Scene 2 – "Thử lần 1: Nhảy" (0:14 – 0:30)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:14–0:18 | Medium wide, camera tĩnh | Mochi lấy đà: squash dẹt xuống thật sâu (scale Y 0.5), rung rung (anticipation dài 1.5s — càng lâu càng buồn cười). | Tiếng "hựựự…" kéo dài, pitch tăng dần. |
| 0:18–0:21 | Camera tilt theo lên | Bật lên! Stretch dài (scale Y 1.5). Bay lên… được khoảng 2 mét. Lơ lửng một nhịp ở đỉnh (hold 0.4s, mắt nhìn xuống camera). | "Boing!" Nhạc tắt đột ngột ở đỉnh. |
| 0:21–0:25 | Camera tĩnh | Rơi xuống, đập đất: squash cực dẹt (scale Y 0.3) như cái bánh, nảy 2 lần nhỏ dần. | "Bẹp!" + 2 tiếng "bop bop". |
| 0:25–0:30 | Close-up mặt Mochi | Mochi dẹt lép từ từ phồng lại như bánh bao hấp (scale Y lerp về 1 với elastic easing). Lắc mình, mắt quyết tâm. | Tiếng "phù~" như bơm hơi. Nhạc trở lại. |

### Scene 3 – "Thử lần 2: Bóng bay" (0:30 – 0:52)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:30–0:35 | Medium shot | Một chùm 3 bóng bay pastel (sphere + line làm dây) trôi đến từ bên trái. Mochi chộp lấy dây bằng "miệng". | "Pop" nhẹ khi bóng xuất hiện. "Mo!" vui. |
| 0:35–0:42 | Camera bay lên theo, góc thấp nhìn lên | Mochi từ từ bay lên, đung đưa như con lắc (rotation.z = sin(t)·0.2). Mochi cười toe, chân… không có chân, nên cả người lắc lư sung sướng. | Nhạc lên cao trào nhẹ, thêm tiếng "wheee~". |
| 0:42–0:46 | Medium shot ở độ cao | Sẻ Bông bay đến, đậu lên một quả bóng, nghiêng đầu tò mò, rồi… mổ thử. Mochi lắc đầu điên cuồng "đừng đừng". | Tiếng chim "chíp?". Nhạc dừng. |
| 0:46–0:48 | Close-up quả bóng | Bóng nổ (scale lên 1.2 trong 2 frame rồi biến mất, bắn particle nhỏ). Lần lượt quả 2, quả 3 nổ theo (domino, cách nhau 0.3s). | "PỐP! pốp. póp." (âm lượng giảm dần – càng về sau càng buồn cười). |
| 0:48–0:52 | Wide shot | Mochi lơ lửng một nhịp kiểu hoạt hình (hold 0.5s, nhìn camera, chớp mắt), rồi rơi thẳng. Sẻ Bông vẫn đậu giữa không trung một giây rồi mới nhớ ra vỗ cánh. | Tiếng còi trượt xuống "fiuuuu…", rồi "BẸP" ngoài khung hình. |

### Scene 4 – "Thử lần 3: Máy phóng" (0:52 – 1:12)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:52–0:58 | Montage nhanh 3 shot (mỗi shot 2s) | Mochi chế máy phóng: một tấm ván (box) đặt trên hòn đá (sphere). Mochi kéo tảng đá lăn lăn, đặt ván, đứng lên một đầu. Mỗi shot cắt nhanh theo nhịp nhạc. | Nhạc "làm việc" nhịp nhanh, tiếng "cộc cộc". |
| 0:58–1:02 | Wide shot, camera tĩnh | Mochi đứng một đầu ván, nhìn lên đầu kia đang trống… nhận ra cần ai đó nhảy lên đầu kia. Nhìn quanh. Không ai. Mắt chớp 2 lần. | Im lặng, chỉ tiếng dế. (Gag bằng sự im lặng.) |
| 1:02–1:07 | Wide shot | Mochi nảy ra ý: tự nhảy lên đầu bên kia. Nhảy sang — ván bật đầu bên này lên… nhưng Mochi chính là người đang ở đầu bên kia. Ván bật lên rồi đập *bép* vào mặt Mochi. | "Cạch – BÉP!" |
| 1:07–1:12 | Close-up | Mochi nằm sấp, mặt in hình tấm ván (dẹt vuông một nhịp: scale X 1.2, Z 0.6). Thở dài, ngồi dậy, buồn xìu: mắt cụp (rotation), toàn thân "chảy" xuống (scale Y 0.8). | "Hựu…" Nhạc buồn (một nốt kèn trombone "wah wah wah"). |

### Scene 5 – "Bạn tới giúp" (1:12 – 1:28)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 1:12–1:16 | Camera hạ từ trời xuống | Bé Mây hạ xuống, chui vào khung hình phía trên Mochi, tạo bóng râm. Mochi nhìn lên. | Chuông gió. Nhạc ấm áp quay lại (chậm). |
| 1:16–1:20 | Two-shot | Bé Mây nghiêng đầu, cười, rồi hạ thật thấp, sát mặt đất, như một tấm đệm bông. Một "cục mây" nhỏ đưa ra mời. | Tiếng cười khúc khích. |
| 1:20–1:24 | Medium shot | Mochi rụt rè nhảy lên. Lún sâu vào mây (Mochi lún 0.5 đơn vị, mây squash phẳng ra). Hai đứa nhìn nhau. | "Phụp!" mềm mại. |
| 1:24–1:28 | Camera crane lên cùng hai nhân vật | Bé Mây từ từ bay lên. Mochi mắt cong hình trăng khuyết vì hạnh phúc. | Nhạc lên cao trào, đầy đủ nhạc cụ. "Mo~~~!" |

### Scene 6 – "Trên trời" + Kết (1:28 – 1:35)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 1:28–1:32 | Wide shot từ xa, orbit chậm quanh hai nhân vật | Mochi và Bé Mây bay giữa các đám mây khác, Mochi nhảy tưng tưng trên lưng mây (squash nhẹ, vui). Hoàng hôn hồng cam. | Nhạc kết. |
| 1:32–1:34 | Cut về mặt đất, medium shot | **Gag cuối (stinger):** Sẻ Bông ngồi trên tấm ván máy phóng, nhảy lên đầu kia… ván bật đập vào mặt Sẻ. *Bép.* | "Bép!" + "chíp…" yếu ớt. |
| 1:34–1:35+ | Fade to black | Chữ "Hết" / "The End" + credit. | Một tiếng "mo~" cuối. |

---

## 5. Danh sách gag & nguyên tắc timing

1. **Anticipation dài, hành động nhanh, hold lâu:** lấy đà 1.5s → bật 0.3s → treo ở đỉnh 0.4s → rơi.
2. **Rule of three:** 3 lần thử (nhảy, bóng bay, máy phóng), lần sau thảm hơn lần trước; 3 quả bóng nổ to dần nhỏ dần.
3. **Hold kiểu hoạt hình:** nhân vật lơ lửng nhìn camera trước khi rơi (Scene 3, 0:48).
4. **Im lặng là gag:** Scene 4, tiếng dế khi Mochi nhận ra thiếu người.
5. **Callback:** cái ván máy phóng quay lại ở stinger cuối với Sẻ Bông.

---

## 6. Ghi chú kỹ thuật để dựng (Three.js)

### Cấu trúc module đề xuất

```
src/
  main.ts               // khởi tạo renderer, vòng lặp, gắn timeline
  config/assets.ts      // MỌI đường dẫn audio/texture tập trung ở đây
  core/
    Timeline.ts         // timeline chính: seek(t), play(), pause()
    easing.ts           // easeOutElastic, easeInBack, ...
    Recorder.ts         // ghi canvas ra WebM qua MediaRecorder + captureStream(30)
  characters/
    Mochi.ts            // class Mochi: setSquash(amount), setExpression(name), blink()
    Cloud.ts            // Bé Mây
    Sparrow.ts          // Sẻ Bông
  props/
    Balloon.ts  Seesaw.ts  Hill.ts  Sky.ts
  scenes/
    scene01Dream.ts ... scene06Ending.ts   // mỗi file trả về các track cho timeline
  audio/
    AudioManager.ts     // WebAudio, play(cueId, atTime)
    cues.ts             // danh sách cue âm thanh theo thời gian
```

### Squash & stretch giữ thể tích
Khi scale Y = `s`, đặt scale X = Z = `1 / Math.sqrt(s)` để thể tích không đổi — nhìn mềm và "thật" hơn.
Đặt pivot của Mochi ở đáy (dịch geometry lên `+radius`) để khi squash, Mochi dẹt xuống mặt đất thay vì co vào giữa.

### Timeline
- Mỗi scene khai báo các keyframe dạng `{ t, target, prop, value, ease }`; Timeline nội suy theo thời gian tuyệt đối.
- Điều khiển bằng thời gian tuyệt đối (không dùng delta tích lũy) để có thể `seek()` đến bất kỳ giây nào khi debug và để xuất video ổn định từng frame.
- Khi xuất video: chạy ở chế độ "fixed step" (t += 1/30 mỗi frame) thay vì real-time.

### Danh sách cue âm thanh (gom vào `audio/cues.ts`)

| ID | Thời điểm | Mô tả |
|----|-----------|-------|
| `music_main` | 0:00 | Nhạc nền ukulele, loop |
| `sfx_ting` | 0:12 | Mắt sáng |
| `sfx_charge` | 0:14 | "Hựựự" lấy đà |
| `sfx_boing` | 0:18 | Bật nhảy |
| `sfx_splat` | 0:21 | Rơi bẹp |
| `sfx_inflate` | 0:25 | Phồng lại |
| `sfx_pop_1..3` | 0:46–0:47 | Bóng nổ (âm lượng giảm dần) |
| `sfx_fall_whistle` | 0:49 | Còi rơi |
| `sfx_crickets` | 0:58 | Tiếng dế |
| `sfx_smack` | 1:05 | Ván đập mặt |
| `sfx_sad_trombone` | 1:08 | "Wah wah wah" |
| `sfx_chime` | 1:12 | Bé Mây xuất hiện |
| `sfx_poof` | 1:20 | Lún vào mây |
| `music_finale` | 1:24 | Nhạc cao trào |
| `sfx_smack_small` | 1:33 | Stinger Sẻ Bông |

Nguồn âm thanh gợi ý: tự tổng hợp bằng WebAudio (boing, pop, whistle rất dễ tạo bằng oscillator), hoặc thư viện CC0 như freesound.org / Pixabay.

### Thứ tự làm đề xuất
1. Dựng Mochi + Hill + Sky + ánh sáng, test squash & stretch.
2. Viết `Timeline` + Scene 2 (gag nhảy) làm "vertical slice".
3. Thêm AudioManager, đồng bộ cue Scene 2.
4. Làm các scene còn lại, rồi Recorder để xuất WebM.
