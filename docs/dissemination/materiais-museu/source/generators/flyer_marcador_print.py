# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA (portada para caminhos relativos ao repositório).
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Item 5 — versões de IMPRESSÃO com sangria 3mm + marcas de corte.
Flyer A6 (105x148) e Marcador 59x214, derivados fielmente da arte aprovada v6.4 (300dpi).
Escala uniforme (sem distorção), sangria por replicação de bordo, PDF no tamanho físico exato."""
import os
from PIL import Image, ImageDraw
SRC=_os.path.join(_os.path.dirname(__file__))  # *_editable.png gerados por flyer_marcador_build.py (mesma pasta)
OUT=_os.path.join(_REPO,"docs","dissemination","materiais-museu","print")
os.makedirs(OUT,exist_ok=True)
DPI=300; PPM=DPI/25.4; BL=3.0  # bleed mm
INK=(30,26,23)
def mm(v): return round(v*PPM)

def make(src_png, src_trim_mm, tgt_trim_mm, outname):
    src=Image.open(src_png).convert("RGB")
    sW,sH=src.size
    sbl=mm(BL)
    # recorta o TRIM (remove a sangria de origem de 3mm)
    trim=src.crop((sbl,sbl,sW-sbl,sH-sbl))
    tW,tH=trim.size
    # escala UNIFORME pela largura-alvo (preserva proporção), depois recorta a altura ao centro
    tgtW,tgtH=mm(tgt_trim_mm[0]),mm(tgt_trim_mm[1])
    k=tgtW/tW
    nW,nH=round(tW*k),round(tH*k)
    trim=trim.resize((nW,nH),Image.LANCZOS)
    if nH>=tgtH:
        top=(nH-tgtH)//2; trim=trim.crop((0,top,tgtW,top+tgtH))
    else:  # raro: completa por replicação depois
        pad=Image.new("RGB",(tgtW,tgtH),tuple(trim.getpixel((0,0)))); pad.paste(trim,(0,(tgtH-nH)//2)); trim=pad
    tW,tH=trim.size
    # canvas com sangria 3mm
    b=mm(BL); W,H=tW+2*b,tH+2*b
    cv=Image.new("RGB",(W,H),(255,252,247))
    cv.paste(trim,(b,b))
    # sangria por replicação de bordo
    top=trim.crop((0,0,tW,1)).resize((tW,b)); cv.paste(top,(b,0))
    bot=trim.crop((0,tH-1,tW,tH)).resize((tW,b)); cv.paste(bot,(b,b+tH))
    lef=trim.crop((0,0,1,tH)).resize((b,tH)); cv.paste(lef,(0,b))
    rig=trim.crop((tW-1,0,tW,tH)).resize((b,tH)); cv.paste(rig,(b+tW,b))
    for (cxp,cyp,px,py) in [(0,0,0,0),(b+tW,0,tW-1,0),(0,b+tH,0,tH-1),(b+tW,b+tH,tW-1,tH-1)]:
        cv.paste(Image.new("RGB",(b,b),tuple(trim.getpixel((px,py)))),(cxp,cyp))
    # marcas de corte (hairline nos 4 cantos do trim, dentro da sangria)
    d=ImageDraw.Draw(cv); lw=max(2,mm(0.25)); glen=mm(2.6); gap=mm(0.3)
    corners=[(b,b,-1,-1),(b+tW,b,1,-1),(b,b+tH,-1,1),(b+tW,b+tH,1,1)]
    for (x,y,sx,sy) in corners:
        d.line([(x,y+sy*gap),(x,y+sy*(gap+glen))],fill=INK,width=lw)      # vertical (alinha bordo lateral)
        d.line([(x+sx*gap,y),(x+sx*(gap+glen),y)],fill=INK,width=lw)      # horizontal (alinha bordo topo/base)
    cv.save(f"{OUT}/{outname}.png")
    cv.save(f"{OUT}/{outname}.pdf","PDF",resolution=DPI)
    print(f"{outname}: trim {tgt_trim_mm[0]}x{tgt_trim_mm[1]}mm + sangria {BL}mm -> canvas {W/PPM:.1f}x{H/PPM:.1f}mm ({W}x{H}px)")
    return cv

# FLYER A6 (105x148), fonte = A5 aprovado (trim 148x210)
ff=make(f"{SRC}/flyer_a5_front_editable.png",(148,210),(105,148),"flyer_a6_front_PRINT")
fb=make(f"{SRC}/flyer_a5_back_editable.png",(148,210),(105,148),"flyer_a6_back_PRINT")
# MARCADOR 59x214, fonte = aprovado (trim 55x200)
mf=make(f"{SRC}/bookmark_front_editable.png",(55,200),(59,214),"marcador_59x214_front_PRINT")
mb=make(f"{SRC}/bookmark_back_editable.png",(55,200),(59,214),"marcador_59x214_back_PRINT")

# preview lado-a-lado (reduzido)
def sc(im,hh): w=round(im.size[0]*hh/im.size[1]); return im.resize((w,hh))
hh=900; ims=[sc(x,hh) for x in (ff,fb,mf,mb)]
pad=26; W=sum(i.size[0] for i in ims)+pad*(len(ims)+1); Hn=hh+2*pad
sheet=Image.new("RGB",(W,Hn),(236,230,220)); x=pad
for im in ims: sheet.paste(im,(x,pad)); x+=im.size[0]+pad
sheet.save(f"{OUT}/_PREVIEW_print.png"); print("preview ok",sheet.size)
