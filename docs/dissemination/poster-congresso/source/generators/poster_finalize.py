# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA (portada p/ caminhos relativos ao repositório).
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Versão de impressão do poster canónico (A0 académico, proof.py/v9/vFinal-Academic).
Mantém proporção/arte A0 841x1189 intacta; adiciona sangria 5mm (replicação de bordo)
+ marcas de corte; PDF no tamanho físico exato. NÃO altera a composição."""
import os
from PIL import Image, ImageDraw
HERE=os.path.dirname(os.path.abspath(__file__))
OUT=_os.path.join(_REPO,"docs","dissemination","poster-congresso","print-A0")
os.makedirs(OUT,exist_ok=True)
DPI=150; PPM=DPI/25.4; BL=5.0; INK=(30,26,23)
def mm(v): return round(v*PPM)
trim=Image.open(f"{HERE}/out/poster_congresso_PROVA_VISUAL_v9.png").convert("RGB")
tW,tH=trim.size  # 841x1189mm @150dpi
b=mm(BL); W,H=tW+2*b,tH+2*b
cv=Image.new("RGB",(W,H),(255,252,247)); cv.paste(trim,(b,b))
# sangria por replicação de bordo
cv.paste(trim.crop((0,0,tW,1)).resize((tW,b)),(b,0))
cv.paste(trim.crop((0,tH-1,tW,tH)).resize((tW,b)),(b,b+tH))
cv.paste(trim.crop((0,0,1,tH)).resize((b,tH)),(0,b))
cv.paste(trim.crop((tW-1,0,tW,tH)).resize((b,tH)),(b+tW,b))
for (cxp,cyp,px,py) in [(0,0,0,0),(b+tW,0,tW-1,0),(0,b+tH,0,tH-1),(b+tW,b+tH,tW-1,tH-1)]:
    cv.paste(Image.new("RGB",(b,b),tuple(trim.getpixel((px,py)))),(cxp,cyp))
# marcas de corte (hairline nos 4 cantos do trim, dentro da sangria 5mm)
d=ImageDraw.Draw(cv); lw=max(2,mm(0.3)); glen=mm(4.0); gap=mm(0.8)
for (x,y,sx,sy) in [(b,b,-1,-1),(b+tW,b,1,-1),(b,b+tH,-1,1),(b+tW,b+tH,1,1)]:
    d.line([(x,y+sy*gap),(x,y+sy*(gap+glen))],fill=INK,width=lw)
    d.line([(x+sx*gap,y),(x+sx*(gap+glen),y)],fill=INK,width=lw)
cv.save(f"{OUT}/poster_milreu_A0_PRINT_sangria5mm.pdf","PDF",resolution=DPI)
cv.resize((round(W*1000/H),1000)).save(f"{OUT}/_PREVIEW_poster_A0_print.png")
print(f"PDF trim {tW/PPM:.0f}x{tH/PPM:.0f}mm (A0) + sangria {BL}mm -> {W/PPM:.0f}x{H/PPM:.0f}mm ({W}x{H}px) @ {DPI}dpi")
