"""Cut a 4-panel strip PNG into two 1080x1350 (4:5) Facebook images, two panels each
(a 3-panel strip becomes one 1080x1350 image).

Usage: python3 comics/fb_split.py STRIP.png OUT_PREFIX "TÁO Ờ" "#2 · BÁC SĨ"
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONT = str(Path(__file__).with_name('itim.ttf'))
INK, RED, MUTED = (58, 63, 75), (242, 107, 102), (120, 125, 140)
PAGE = 'Ờ'


def single(src: Image.Image, prefix: str, brand: str, title: str) -> None:
    """3-panel strip: keep all panels in one 1080x1350 image (the gag needs panel 1 and 3 side by side)."""
    big, small = ImageFont.truetype(FONT, 52), ImageFont.truetype(FONT, 30)
    part = src.crop((0, 10, 1200, src.height - 50))
    k = 1140 / part.height
    part = part.resize((int(1200 * k), 1140), Image.LANCZOS)
    im = Image.new('RGB', (1080, 1350), 'white')
    d = ImageDraw.Draw(im)
    x0, top = (1080 - part.width) // 2, 120
    im.paste(part, (x0, top))
    d.text((x0 + 10, 40), brand, font=big, fill=RED)
    d.text((x0 + 10 + d.textlength(brand + ' ', font=big), 40), title, font=big, fill=INK)
    d.text((1080 - x0 - 10, top + part.height + 25), PAGE, font=small, fill=MUTED, anchor='ra')
    im.save(f'{prefix}.png')


def split(src_path: str, prefix: str, brand: str, title: str) -> None:
    src = Image.open(src_path).convert('RGB')
    if src.height < 1600:
        single(src, prefix, brand, title)
        return
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
