"""Stack hand-picked rows of a frameless strip (like 'Đi bơi') into one 1080x1350 Facebook image
with framed panels, a story-name title and the 'Táo Ờ' footer.

Usage: python3 comics/fb_rows.py STRIP.png OUT.png "ĐI BƠI" y0:y1 y0:y1 ...
"""
import sys
from PIL import Image, ImageDraw, ImageFont
from fb_split import FONT, INK, MUTED, PAGE


def stack(src_path: str, out: str, title: str, *spans: str) -> None:
    src = Image.open(src_path).convert('RGB')
    rows = [src.crop((0, int(a), src.width, int(b))) for a, b in (s.split(':') for s in spans)]
    gap, top, avail = 18, 120, 1350 - 120 - 80
    k = (avail - gap * (len(rows) - 1)) / sum(r.height for r in rows)
    w = int(src.width * k)
    im = Image.new('RGB', (1080, 1350), 'white')
    d = ImageDraw.Draw(im)
    x0, y = (1080 - w) // 2, top
    for r in rows:
        r = r.resize((w, int(r.height * k)), Image.LANCZOS)
        im.paste(r, (x0, y))
        d.rounded_rectangle((x0 - 4, y - 4, x0 + w + 4, y + r.height + 4), radius=16, outline=INK, width=5)
        y += r.height + gap
    big, small = ImageFont.truetype(FONT, 52), ImageFont.truetype(FONT, 30)
    d.text((x0, 40), title, font=big, fill=INK)
    d.text((x0 + w, y + 10), PAGE, font=small, fill=MUTED, anchor='ra')
    im.save(out)


if __name__ == '__main__':
    stack(*sys.argv[1:])
