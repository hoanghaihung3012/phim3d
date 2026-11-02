"""Build a download page for one strip's Facebook images.

Usage: python3 comics/fb_page.py OUT.html "Táo Ờ #2 · Bác sĩ" "caption" IMG1.png IMG2.png [FULL.png]
"""
import base64, html, json, sys
from pathlib import Path


def build(out: str, title: str, caption: str, *imgs: str) -> None:
    brand, rest = title.split(' #', 1)
    figs = []
    n_fb = sum('tao-truyen' not in Path(p).name for p in imgs)
    for i, p in enumerate(imgs):
        b64 = base64.b64encode(Path(p).read_bytes()).decode()
        full = 'tao-truyen' in Path(p).name
        label = 'bản dọc đầy đủ' if full else ('ảnh' if n_fb == 1 else f'ảnh {i + 1}')
        figs.append(f'<figure><img src="data:image/png;base64,{b64}" alt="{label}"><button data-i="{i}" data-name="{Path(p).name}" hidden>⬇ Tải {label}</button></figure>')
    extra = '<p class="sub">Ảnh cuối là bản dọc đầy đủ, đăng thêm nếu muốn.</p>' if len(imgs) > n_fb and n_fb > 1 else ''
    intro = ('Bản cho fanpage: 2 ảnh 1080×1350 (4:5). Đăng cả hai trong cùng một bài, theo thứ tự 1 rồi 2.' if n_fb > 1
             else 'Bản cho fanpage: 1 ảnh 1080×1350 (4:5), đủ cả 3 khung nên hiện trọn trên bảng tin.')
    page = f'''<title>{html.escape(title)} cho Facebook</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Itim&display=swap">
<style>
:root{{--bg:#F4F5F8;--ink:#3A3F4E;--muted:#6B7183;--line:#D9DCE6;--apple:#F26B66}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#1E2129;--ink:#E7E9F0;--muted:#A3A8B8;--line:#3A3F4E;--apple:#FF8C82}}}}
:root[data-theme="dark"]{{--bg:#1E2129;--ink:#E7E9F0;--muted:#A3A8B8;--line:#3A3F4E;--apple:#FF8C82}}
body{{background:var(--bg);color:var(--ink);font-family:system-ui,sans-serif;padding:28px 16px 48px;line-height:1.5}}
main{{max-width:560px;margin:0 auto;display:grid;gap:18px}}
h1,h2{{font-family:Itim,sans-serif;font-weight:400;margin:0}} h1{{font-size:28px}} h1 span{{color:var(--apple)}}
.sub{{color:var(--muted);margin:4px 0 0}}
figure{{margin:0;display:grid;gap:10px}} img{{width:100%;border:1px solid var(--line);border-radius:6px;display:block}}
button{{justify-self:center;padding:10px 20px;border:3px solid #3A3F4B;border-radius:999px;background:#FFE27A;color:#3A3F4B;font:600 17px Itim,sans-serif;cursor:pointer}}
pre{{white-space:pre-wrap;background:#fff;color:#3A3F4E;border:1px solid var(--line);border-radius:6px;padding:12px;font-family:inherit;margin:0}}
</style>
<main>
<header><h1><span>{html.escape(brand)}</span> #{html.escape(rest)}</h1><p class="sub">{intro}</p>{extra}</header>
{''.join(figs)}
<h2>Gợi ý caption</h2>
<pre id="cap"></pre>
</main>
<script>
document.getElementById("cap").textContent={json.dumps(caption, ensure_ascii=False)};
(async()=>{{const d=await window.claude?.use?.("downloads");if(!d)return;const imgs=document.querySelectorAll("img");document.querySelectorAll("button").forEach(b=>{{b.hidden=false;b.onclick=async()=>{{try{{const blob=await (await fetch(imgs[+b.dataset.i].src)).blob();await d.save({{filename:b.dataset.name,data:blob}});}}catch(e){{}}}};}});}})();
</script>'''
    Path(out).write_text(page, encoding='utf-8')


if __name__ == '__main__':
    build(*sys.argv[1:])
