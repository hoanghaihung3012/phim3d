# Táo comics

Short comic strips, stickers and Facebook images for the Táo series, drawn in code with the film's 2D doodle renderer (`src/film2d/doodle/Sketch`, `Apple2D`, `Mushroom2D`). Character bible: `docs/characters/SKILL.md` (branch `claude/project-thread-wyb26v`).

- `family.ts`: every drawing. Strips are `strip`, `strip2` … `strip11`; extra cast (Ba, Mẹ, Vịt, Sâu, Gà, Chó, Mèo) are helper functions there.
- `main.ts`: browser entry that maps output names to drawings.
- `render.cjs`: renders PNGs with headless Chromium (Playwright).
- `fb_split.py`: cuts a 4-panel strip into two 1080x1350 Facebook images; `fb_page.py` builds the download page with a caption. Captions end with "Táo Ờ · <story name>" and "#TaoO #ChuyenNhaTao".
- The fanpage is "Táo Ờ": strip footers read `TÁO Ờ #n · NAME` (#1 Thèm gì, #2 Bác sĩ, #3 Từ mai so far).
- `itim.ttf`: Itim font (SIL Open Font License), embedded so text renders offline.
- `out/`: the published PNGs (`strips/`, `stickers/`, `fb/`, `sketches/`).

Numbering: "Thèm gì" was renumbered to #1 (it was #6); the other strips keep their numbers, so "Đi bơi" is also #1. #10 is the "Thả diều" clip, so "Táo bón" is #11.

```bash
npm run comics:build
# all strips + stickers into comics/out/render/
node comics/render.cjs
# or just some
node comics/render.cjs comics/out/render tao-truyen-11-tao-bon stickers
```

Playwright must be resolvable (`NODE_PATH=$(npm root -g)` if it is installed globally).
