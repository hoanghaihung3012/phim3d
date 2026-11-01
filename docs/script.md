# Kịch bản: "Táo Muốn Bay" (Apple Wants to Fly)

> Phim hoạt hình 3D ngắn, ~95 giây, không lời thoại (chỉ tiếng cảm thán + nhạc + hiệu ứng).
> Dựng bằng Three.js, nhân vật ghép từ hình khối cơ bản, chuyển động procedural.
> Phong cách hài: **mặt đơ, lầy lội, "nhây"** kiểu meme. Nét vẽ cố tình đơn giản, biểu cảm phẳng, timing giật cục.

---

## 0. Các ý tưởng đã cân nhắc

| # | Ý tưởng | Nhận xét |
|---|---------|----------|
| A | **Táo Muốn Bay**: một trái táo mặt đơ tìm đủ cách bay lên trời, nhưng lần nào trọng lực cũng thắng | Táo rơi là gag tự nhiên (trọng lực, Newton). Nhân vật chỉ là hình cầu nên rất dễ dựng. **Chọn.** |
| B | Robot tưới cây: robot nhỏ tưới một mầm cây, cây lớn quá nhanh và nuốt luôn cái nhà | Vui, nhưng cây mọc procedural tốn công hơn. |
| C | Bánh bao đi picnic: bánh bao bị đàn kiến khiêng đi mất | Nhiều nhân vật nhỏ (kiến), cần crowd animation. |

Bản trước dùng nhân vật Mochi (cục mochi hồng). Nay đổi thành **Táo Lém** theo góp ý, và chuyển giọng hài sang kiểu đơ mặt, lầy.

---

## 1. Logline

Táo Lém là một trái táo đỏ sống trên cây. Nó chán đời treo lủng lẳng, muốn bay lên trời chơi với Bé Mây. Táo thử nhảy, thử bóng bay, thử máy phóng tự chế. Lần nào trọng lực cũng thắng, và lần nào Táo cũng chỉ nhìn thẳng vào camera với khuôn mặt không cảm xúc. Cuối cùng Bé Mây nghĩ ra cách đơn giản nhất.

**Thông điệp:** bạn bè giúp nhau thì việc khó cũng thành dễ. Còn trọng lực thì không bao giờ là bạn của táo.

---

## 2. Phong cách hài "mặt đơ" (deadpan)

Đây là phần quan trọng nhất để phim buồn cười. Nhân vật và cách diễn là của riêng phim này, chỉ lấy cảm hứng ở *tinh thần* hài lầy:

1. **Mặt phẳng, dán lên khối 3D:** mắt và miệng là texture 2D nét đen dày, dán lên một `PlaneGeometry` bám sát bề mặt quả táo. Nhìn giống ai đó lấy bút lông vẽ mặt lên trái táo thật.
2. **Biểu cảm mặc định là đơ:** mắt lim dim nửa mí, miệng là một gạch ngang. Gặp chuyện gì cũng giữ mặt này thêm 1 nhịp rồi mới phản ứng (hoặc không phản ứng luôn).
3. **Nhìn thẳng vào camera** sau mỗi lần thất bại, im lặng 1 giây. Đây là "dấu chấm câu" của mỗi gag.
4. **Chuyển động giật cục (stepped animation):** biểu cảm đổi tức thì, không chuyển mượt. Một số pose chạy ở 12 fps (giữ mỗi pose 2–3 frame) để có cảm giác thô và hài.
5. **Viền đen dày (outline):** dùng kỹ thuật inverted hull (nhân bản mesh, phóng to 3%, `side: BackSide`, màu đen) để nhân vật giống tranh vẽ tay.
6. **Ít squash, nhiều "cộp":** táo cứng, nên khi rơi chỉ squash rất nhẹ (scale Y 0.9) rồi đứng im. Gag nằm ở sự cứng đơ và âm thanh "cộp", không nằm ở việc bị bẹp.
7. **Âm thanh lồng tiếng quá lố:** một số tiếng cảm thán cố tình nói thành chữ, kiểu "Ờ.", "Hử?", "Thôi xong." (giọng trầm, đều đều, pitch bình thường). Tương phản giữa hình dễ thương và giọng chán đời là chỗ gây cười.

---

## 3. Nhân vật

### Táo Lém (nhân vật chính)
- **Hình khối:** `SphereGeometry` bán kính 1, đẩy đỉnh và đáy vào trong một chút (biến dạng vertex theo `cos` của vĩ độ) để ra dáng quả táo có lõm. Cuống là `CylinderGeometry` mảnh màu nâu, hơi cong. Một chiếc lá là `PlaneGeometry` cong hình giọt nước màu xanh.
- **Màu:** đỏ táo pastel `#FF6B6B`, chỗ bóng sáng `#FFA8A8`, cuống `#8B5A2B`, lá `#7BD389`.
- **Mặt (texture swap):** 
  - `face_bored`: mắt nửa mí, miệng gạch ngang (mặc định)
  - `face_side_eye`: liếc ngang
  - `face_shock`: mắt tròn chấm bi, miệng chữ O nhỏ xíu
  - `face_smug`: một bên mép nhếch lên
  - `face_happy`: mắt cong hình trăng khuyết (chỉ dùng 1 lần, ở cuối phim, cho có "ăn tiền")
- **Tay chân:** không có tay. Hai chân là 2 capsule ngắn, chỉ xuất hiện khi chạy (gag: chân thò ra từ đâu không biết).
- **"Diễn" bằng cuống và lá:** cuống giật giật khi bực, lá rủ xuống khi buồn, lá dựng đứng khi giật mình.
- **Tính cách:** chán đời, lì, mặt lúc nào cũng như không quan tâm, nhưng thật ra rất muốn bay.
- **Âm thanh:** "Ờ.", "Hử?", "Thôi xong.", tiếng thở dài "haizz" và tiếng "cộp" gỗ khi rơi.

### Bé Mây (bạn)
- **Hình khối:** cụm 5–6 sphere trắng chồng nhau (`Group`), mặt cũng là texture 2D nét dày cho đồng bộ: mắt hạt đậu, miệng cười ngây ngô. Lơ lửng nhấp nhô bằng `sin(t)`.
- **Màu:** trắng kem `#FFFFFF`, bóng xanh nhạt `#DDEBFF`.
- **Tính cách:** hiền, hơi ngáo, lúc nào cũng cười. Là "người bình thường" duy nhất trong phim.
- **Âm thanh:** tiếng chuông gió nhỏ khi cười.

### Sẻ Bông (nhân vật phụ gây rối)
- **Hình khối:** sphere vàng làm thân, cone cam làm mỏ, 2 cánh là sphere dẹt vỗ bằng `sin(t*20)`. Mắt là 2 chấm đen to, cách xa nhau (nhìn hơi ngố).
- **Màu:** vàng chanh `#FFE58A`, mỏ `#FFA94D`.
- **Vai trò:** vô tình phá hỏng gag bóng bay. Không ác, chỉ ngố.

---

## 4. Bối cảnh & hình ảnh

- **Cây táo:** thân cylinder nâu, tán là cụm sphere xanh lá. Có vài trái táo "thường" (không mặt) treo cạnh Táo Lém để làm nổi bật nó.
- **Đồi cỏ:** một bán cầu lớn màu xanh bạc hà `#BDEBC4`, vài bụi cây là cụm sphere, vài bông hoa (cylinder + sphere).
- **Bầu trời:** gradient (shader hoặc `scene.background` dùng CanvasTexture) từ xanh `#BFE3FF` xuống hồng nhạt `#FFE3EC`.
- **Ánh sáng:** `HemisphereLight` + 1 `DirectionalLight` ấm có shadow mềm (`PCFSoftShadowMap`). Fog nhẹ cho chiều sâu.
- **Vật liệu:** `MeshToonMaterial` với gradientMap 3 bậc + outline đen. Mục tiêu là trông như tranh vẽ tay, không bóng bẩy.
- **Khung hình:** 16:9, 1920×1080, xuất 30 fps (một số đoạn giữ pose kiểu 12 fps như mục 2).

---

## 5. Phân cảnh (Scene breakdown)

Tổng thời lượng: **~95 giây**. Mốc thời gian tính theo giây từ đầu phim.

### Scene 1: "Treo lủng lẳng" (0:00 – 0:14)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:00–0:04 | Wide shot, dolly chậm tới cây táo | Mở màn: trời xanh, cây táo trên đồi. Title "Táo Muốn Bay" hiện lên, chữ hơi lệch, nảy một cái. | Nhạc nền ukulele vui tươi. Chim hót. |
| 0:04–0:09 | Medium shot ngang tầm Táo Lém | Các trái táo khác đung đưa theo gió. Táo Lém cũng đung đưa, mặt `face_bored`. Nó thở dài, lá rủ xuống. | "Haizz." |
| 0:09–0:14 | Over-the-shoulder từ sau Táo nhìn lên | Bé Mây bay ngang, vẫy (một sphere nhỏ nhô ra), cười rồi trôi lên cao. Táo chuyển tức thì sang `face_shock`, lá dựng đứng. Cắt sang `face_smug`: nó có kế hoạch. | Chuông gió. "Hử?" |

**Thiết lập mục tiêu:** Táo muốn lên chỗ Bé Mây.

### Scene 2: "Thử lần 1: Nhảy" (0:14 – 0:30)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:14–0:17 | Close-up cuống táo | Táo lắc mạnh cho cuống đứt khỏi cành. Cuống giật giật... đứt. | "Rắc." |
| 0:17–0:19 | Medium wide | Táo rơi thẳng xuống đất, rơi rất nhanh (không có lơ lửng gì cả). Chạm đất "cộp", squash nhẹ rồi đứng im. | "CỘP." Nhạc tắt. |
| 0:19–0:21 | Close-up | Táo nhìn thẳng vào camera, `face_bored`. Im lặng 1 giây. | Im lặng. |
| 0:21–0:26 | Medium wide | Táo thò 2 chân ngắn ra (pop tức thì, không có animation), lùi lại lấy đà, chạy, nhảy lên. Bật lên được khoảng... 30 cm. Rơi xuống. | Tiếng chân "tạch tạch tạch", "hự!", "cộp." |
| 0:26–0:30 | Close-up | Lại nhìn camera. `face_side_eye`. Chân rụt lại vào trong. | "Ờ." Nhạc vui quay lại như chưa có gì xảy ra. |

### Scene 3: "Thử lần 2: Bóng bay" (0:30 – 0:52)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:30–0:35 | Medium shot | Một chùm 3 bóng bay pastel (sphere + line làm dây) trôi đến. Táo cắn lấy dây bằng miệng (texture đổi sang miệng ngậm dây). | "Pop" nhẹ khi bóng xuất hiện. |
| 0:35–0:42 | Camera bay lên theo, góc thấp nhìn lên | Táo từ từ bay lên, đung đưa như con lắc (`rotation.z = sin(t) * 0.2`). Mặt vẫn `face_bored`, nhưng lá vẫy vẫy vì sướng. | Nhạc lên cao trào nhẹ. |
| 0:42–0:46 | Medium shot ở độ cao | Sẻ Bông bay đến, đậu lên một quả bóng, nghiêng đầu nhìn Táo. Nhìn bóng. Nhìn Táo. Táo `face_side_eye`, lắc đầu thật chậm. | "Chíp?" Nhạc dừng. |
| 0:46–0:48 | Close-up quả bóng | Sẻ mổ. Bóng nổ (scale lên 1.2 trong 2 frame rồi biến mất, bắn particle). Quả 2, quả 3 nổ theo kiểu domino, cách nhau 0.3s. | "PỐP! pốp. póp." (nhỏ dần). |
| 0:48–0:52 | Wide shot | Táo lơ lửng một nhịp giữa không trung, nhìn camera. Lần này nói: "Thôi xong." Rồi rơi thẳng. Sẻ Bông vẫn đậu giữa không trung một giây rồi mới nhớ ra phải vỗ cánh. | Còi trượt xuống "fiuuu...", rồi "CỘP" ngoài khung hình. |

### Scene 4: "Thử lần 3: Máy phóng" (0:52 – 1:12)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 0:52–0:58 | Montage nhanh 3 shot (mỗi shot 2s) | Táo chế máy phóng bập bênh: tấm ván (box) đặt trên hòn đá (sphere). Cắt nhanh theo nhịp nhạc: lăn đá, kéo ván, đứng lên một đầu, `face_smug`. | Nhạc "làm việc" nhịp nhanh, "cộc cộc". |
| 0:58–1:02 | Wide shot, camera tĩnh | Táo đứng một đầu ván, nhìn đầu kia đang trống. Nhận ra cần ai đó nhảy xuống đầu kia. Nhìn trái. Nhìn phải. Không ai. | Im lặng, chỉ tiếng dế. |
| 1:02–1:07 | Wide shot | Táo nảy ra ý: tự nhảy sang đầu kia. Nhảy sang... ván bật lên, đập "bép" vào mặt chính nó. | "Cạch... BÉP!" |
| 1:07–1:12 | Close-up | Táo nằm nghiêng, trên má có một vết lõm hình vuông (decal). Nhìn camera, `face_bored`. Lá rủ hẳn xuống. | Kèn trombone "wah wah wah". "Haizz." |

### Scene 5: "Bạn tới giúp" (1:12 – 1:28)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 1:12–1:16 | Camera hạ từ trời xuống | Bé Mây hạ xuống, tạo bóng râm trên người Táo. Táo nhìn lên. | Chuông gió. Nhạc ấm áp quay lại (chậm). |
| 1:16–1:20 | Two-shot | Bé Mây cười, hạ sát mặt đất như một tấm đệm bông, nghiêng mình mời Táo lên. Táo `face_side_eye`: nghi ngờ. | Tiếng cười khúc khích. "...Hử?" |
| 1:20–1:24 | Medium shot | Táo nhảy lên. Lún vào mây (mây squash phẳng ra). Một khoảng lặng. | "Phụp!" mềm mại. |
| 1:24–1:28 | Camera crane lên cùng hai nhân vật | Bé Mây bay lên. Lần đầu tiên trong phim, mặt Táo đổi sang `face_happy`. Giữ đúng 1 giây, rồi Táo nhận ra camera đang nhìn và lập tức đổi lại `face_bored`, giả vờ không quan tâm. | Nhạc cao trào, đầy đủ nhạc cụ. |

### Scene 6: "Trên trời" + Kết (1:28 – 1:35)

| Thời gian | Camera | Hành động | Âm thanh |
|-----------|--------|-----------|----------|
| 1:28–1:32 | Wide shot từ xa, orbit chậm quanh hai nhân vật | Táo và Bé Mây bay giữa các đám mây khác lúc hoàng hôn hồng cam. Lá Táo bay phấp phới. | Nhạc kết. |
| 1:32–1:34 | Cut về mặt đất, medium shot | **Gag cuối (stinger):** Sẻ Bông đậu xuống tấm ván máy phóng, nhún nhún... ván bật lên đập vào mặt Sẻ. | "BÉP!" + "chíp..." yếu ớt. |
| 1:34–1:35+ | Fade to black | Chữ "Hết" + credit. | Giọng Táo, đều đều: "Ờ." |

---

## 6. Danh sách gag & nguyên tắc timing

1. **Nhìn camera sau mỗi thất bại:** 4 lần (0:19, 0:26, 0:48, 1:07). Lặp lại làm khán giả mong chờ, và lần cuối ở 1:24 bị phá vỡ bằng mặt vui.
2. **Rơi nhanh, im lâu:** táo rơi gần như tức thì, rồi hold mặt đơ 1 giây. Càng im lâu càng buồn cười.
3. **Rule of three:** 3 lần thử (nhảy, bóng bay, máy phóng); 3 quả bóng nổ nhỏ dần.
4. **Im lặng là gag:** Scene 4, tiếng dế khi Táo nhận ra thiếu người.
5. **Chân xuất hiện vô lý:** chân pop ra không có animation, rồi rụt lại.
6. **Callback:** tấm ván máy phóng quay lại ở stinger với Sẻ Bông.
7. **Phá vỡ nhân vật đúng 1 lần:** mặt vui duy nhất ở 1:24, bị Táo tự che giấu ngay.

---

## 7. Ghi chú kỹ thuật để dựng (Three.js)

### Cấu trúc module đề xuất

```
src/
  main.ts               // khởi tạo renderer, vòng lặp, gắn timeline
  config/assets.ts      // MỌI đường dẫn audio/texture tập trung ở đây
  core/
    Timeline.ts         // timeline chính: seek(t), play(), pause()
    easing.ts           // easeOutElastic, easeInBack, step(fps) ...
    Recorder.ts         // ghi canvas ra WebM qua MediaRecorder + captureStream(30)
    outline.ts          // tạo viền đen kiểu inverted hull cho mesh bất kỳ
  characters/
    Apple.ts            // class Apple: setFace(name), setLegs(visible), stemTwitch(), leafDroop(amount)
    Cloud.ts            // Bé Mây
    Sparrow.ts          // Sẻ Bông
    FaceSheet.ts        // vẽ các mặt 2D lên CanvasTexture (không cần file ảnh)
  props/
    AppleTree.ts  Balloon.ts  Seesaw.ts  Hill.ts  Sky.ts
  scenes/
    scene01Hanging.ts ... scene06Ending.ts   // mỗi file trả về các track cho timeline
  audio/
    AudioManager.ts     // WebAudio, play(cueId, atTime)
    cues.ts             // danh sách cue âm thanh theo thời gian
```

### Mặt nhân vật
- Vẽ mỗi biểu cảm bằng Canvas 2D API (`ctx.arc`, `ctx.lineTo`, nét `lineWidth` dày, đầu nét tròn), đóng thành `CanvasTexture`. Không cần file ảnh, dễ chỉnh.
- Đổi mặt bằng cách gán `material.map = faces[name]` ngay lập tức (không blend), đúng tinh thần stepped animation.

### Chuyển động
- **Squash giữ thể tích:** khi scale Y = `s`, đặt scale X = Z = `1 / Math.sqrt(s)`. Với táo chỉ dùng biên độ nhỏ (0.9–1.1).
- **Pivot ở đáy** để khi chạm đất nhân vật không bị lún vào giữa.
- **Stepped pose:** `tStepped = Math.floor(t * 12) / 12` cho các track muốn giật cục.

### Timeline
- Mỗi scene khai báo keyframe dạng `{ t, target, prop, value, ease }`; Timeline nội suy theo thời gian tuyệt đối.
- Dùng thời gian tuyệt đối (không cộng dồn delta) để `seek()` được tới bất kỳ giây nào khi debug và để xuất video ổn định.
- Khi xuất video: chạy fixed step (`t += 1/30` mỗi frame) thay vì real-time.

### Danh sách cue âm thanh (gom vào `audio/cues.ts`)

| ID | Thời điểm | Mô tả |
|----|-----------|-------|
| `music_main` | 0:00 | Nhạc nền ukulele, loop |
| `vo_sigh` | 0:06 | "Haizz." |
| `vo_huh` | 0:12 | "Hử?" |
| `sfx_snap` | 0:16 | Cuống đứt "rắc" |
| `sfx_thud` | 0:18 | Táo rơi "cộp" (tiếng gỗ) |
| `sfx_footsteps` | 0:21 | Chân chạy "tạch tạch" |
| `vo_uh` | 0:27 | "Ờ." |
| `sfx_pop_1..3` | 0:46–0:47 | Bóng nổ (nhỏ dần) |
| `vo_its_over` | 0:49 | "Thôi xong." |
| `sfx_fall_whistle` | 0:50 | Còi rơi |
| `sfx_crickets` | 0:58 | Tiếng dế |
| `sfx_smack` | 1:05 | Ván đập mặt |
| `sfx_sad_trombone` | 1:08 | "Wah wah wah" |
| `sfx_chime` | 1:12 | Bé Mây xuất hiện |
| `sfx_poof` | 1:20 | Lún vào mây |
| `music_finale` | 1:24 | Nhạc cao trào |
| `sfx_smack_small` | 1:33 | Stinger Sẻ Bông |
| `vo_uh_end` | 1:35 | "Ờ." cuối phim |

Nguồn âm thanh gợi ý: hiệu ứng (cộp, pop, còi, boing) tự tổng hợp bằng WebAudio oscillator; tiếng cảm thán có thể tự thu âm hoặc tạo bằng text-to-speech; nhạc lấy từ thư viện CC0 (Pixabay, freesound.org).

### Thứ tự làm đề xuất
1. Dựng Táo Lém + cây + đồi + trời + ánh sáng + outline, test đổi mặt.
2. Viết `Timeline` + Scene 2 (gag rơi và nhảy) làm "vertical slice" để chốt timing hài.
3. Thêm AudioManager, đồng bộ cue Scene 2.
4. Làm các scene còn lại, rồi Recorder để xuất WebM.
