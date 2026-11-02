"""Cut a 4-panel strip PNG into two 1080x1350 (4:5) Facebook images, two panels each.

Usage: python3 comics/fb_split.py STRIP.png OUT_PREFIX "TÁO Ờ" "#2 · BÁC SĨ"
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONT = str(Path(__file__).with_name('itim.ttf'))
INK, RED, MUTED = (58, 63, 75), (242, 107, 102), (120, 125, 140)
PAGE = 'Táo Ờ'


def split(src_path: str, prefix: str, brand: str, title: str) -> None:
    src = Image.open(src_path).convert('RGB')
    big, small = ImageFont.truetype(FONT, 52), ImageFont.truetype(FONT, 30)
    for k in range(2):
        # Panels are 430px tall with 26px gaps; keep a 16px margin so wobbly borders are not clipped.
        y0 = 10 + 912 * k
        part = src.crop((0, y0, 1200, y0 + 918)).resize((1080, int(918 * 0.9)), Image.LANCZOS)
        im = Image.new('RGB', (1080, 1350), 'white')
        d = ImageDraw.Draw(im)
        top = (1350 - part.height) // 2 + 10
        im.paste(part, (0, top))
        d.text((40, top - 95), brand, font=big, fill=RED)
        d.text((40 + d.textlength(brand + ' ', font=big), top - 95), title, font=big, fill=INK)
        d.text((1040, top - 80), f'{k + 1}/2', font=small, fill=INK, anchor='ra')
        d.text((1040, top + part.height + 25), 'vuốt tiếp →' if k == 0 else PAGE, font=small, fill=MUTED, anchor='ra')
        im.save(f'{prefix}-{k + 1}.png')


if __name__ == '__main__':
    split(*sys.argv[1:5])
