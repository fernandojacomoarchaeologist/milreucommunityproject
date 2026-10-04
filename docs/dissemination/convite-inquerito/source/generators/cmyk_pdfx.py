# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA — CMYK PDF/X-3 (Itens 5 e 6). Portado p/ caminhos relativos ao repositório.
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# Converte os rasters de impressão (RGB, 300dpi, com sangria+marcas) em PDF/X-3 CMYK,
# com TrimBox/BleedBox e OutputIntent (ICC nomeado). NÃO é CMYK final por inferência:
# usa um perfil padrão NOMEADO; a gráfica pode reconverter com o seu perfil.
import os, io, sys
from PIL import Image, ImageCms, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import pikepdf

DPI=300
ICC="/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"
PROFILE_NAME="Generic CMYK Profile (perfil padrão — confirmar/substituir pelo perfil ICC da gráfica)"
_srgb=ImageCms.createProfile('sRGB')
_tr=ImageCms.buildTransform(_srgb, ICC, 'RGB','CMYK', renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC)

def draw_crop_marks(im, trim_w_mm, trim_h_mm):
    """Desenha marcas de corte nos cantos do trim (se ainda não existirem)."""
    W,H=im.size; d=ImageDraw.Draw(im)
    def P(v): return round(v*DPI/25.4)
    bleed_x=(W-P(trim_w_mm))/2; bleed_y=(H-P(trim_h_mm))/2
    glen=P(3.0); gap=P(1.2); lw=max(2,P(0.2))
    corners=[(bleed_x,bleed_y,-1,-1),(W-bleed_x,bleed_y,1,-1),(bleed_x,H-bleed_y,-1,1),(W-bleed_x,H-bleed_y,1,1)]
    for (x,y,sx,sy) in corners:
        d.line([(x, y+sy*gap),(x, y+sy*(gap+glen))],fill=(0,0,0),width=lw)
        d.line([(x+sx*gap, y),(x+sx*(gap+glen), y)],fill=(0,0,0),width=lw)
    return im

def make_pdfx(png_path, trim_w_mm, trim_h_mm, out_pdf, title, add_marks=False):
    im=Image.open(png_path).convert("RGB")
    if add_marks: im=draw_crop_marks(im, trim_w_mm, trim_h_mm)
    W,H=im.size
    canvas_w_mm=W*25.4/DPI; canvas_h_mm=H*25.4/DPI
    cmyk=ImageCms.applyTransform(im, _tr)   # RGB -> CMYK (DeviceCMYK)
    tmp=out_pdf+".cmyk.jpg"; cmyk.save(tmp,"JPEG",quality=92,dpi=(DPI,DPI))
    # reportlab: página = canvas completo (MediaBox); imagem a toda a página
    from reportlab.lib.utils import ImageReader
    c=canvas.Canvas(out_pdf, pagesize=(canvas_w_mm*mm, canvas_h_mm*mm))
    c.setTitle(title)
    c.drawImage(ImageReader(tmp), 0,0, width=canvas_w_mm*mm, height=canvas_h_mm*mm)
    c.showPage(); c.save()
    os.remove(tmp)
    # pikepdf: boxes (pt) + OutputIntent + PDF/X-3
    pdf=pikepdf.open(out_pdf, allow_overwriting_input=True)
    page=pdf.pages[0]
    PT=lambda v_mm: v_mm*72/25.4
    bx=(canvas_w_mm-trim_w_mm)/2; by=(canvas_h_mm-trim_h_mm)/2
    media=[0,0,PT(canvas_w_mm),PT(canvas_h_mm)]
    bleed_mm=3.0
    bleedbox=[PT(max(0,bx-bleed_mm)),PT(max(0,by-bleed_mm)),PT(min(canvas_w_mm,bx+trim_w_mm+bleed_mm)),PT(min(canvas_h_mm,by+trim_h_mm+bleed_mm))]
    trimbox=[PT(bx),PT(by),PT(bx+trim_w_mm),PT(by+trim_h_mm)]
    page.MediaBox=media; page.BleedBox=bleedbox; page.TrimBox=trimbox; page.ArtBox=trimbox
    # remover fonte Helvetica não usada (reportlab injeta-a); num PDF/X não pode haver fonte não embebida
    res=page.get('/Resources',{})
    if '/Font' in res: del res['/Font']
    st=pikepdf.Stream(pdf, open(ICC,'rb').read()); st.N=4
    oi=pdf.make_indirect(pikepdf.Dictionary(
        Type=pikepdf.Name("/OutputIntent"), S=pikepdf.Name("/GTS_PDFX"),
        OutputConditionIdentifier=pikepdf.String("Generic CMYK"),
        Info=pikepdf.String(PROFILE_NAME), DestOutputProfile=pdf.make_indirect(st)))
    pdf.Root.OutputIntents=pikepdf.Array([oi])
    pdf.docinfo[pikepdf.Name("/GTS_PDFXVersion")]=pikepdf.String("PDF/X-3:2002")
    pdf.docinfo[pikepdf.Name("/Title")]=pikepdf.String(title)
    pdf.docinfo[pikepdf.Name("/Trapped")]=pikepdf.Name("/False")
    pdf.save(out_pdf)
    return canvas_w_mm, canvas_h_mm

if __name__=="__main__":
    OUT=_os.path.join(_REPO,"docs","dissemination")
    I5=f"{OUT}/materiais-museu/print"; I6=f"{OUT}/convite-inquerito/final"
    jobs=[
      # (png, trim_w, trim_h, out, title, add_marks)
      (f"{I5}/flyer_a6_front_PRINT.png",105,148,f"{I5}/CMYK_PDFX/flyer_a6_front_PRINTX.pdf","Flyer A6 frente",False),
      (f"{I5}/flyer_a6_back_PRINT.png",105,148,f"{I5}/CMYK_PDFX/flyer_a6_back_PRINTX.pdf","Flyer A6 verso",False),
      (f"{I5}/marcador_59x214_front_PRINT.png",59,214,f"{I5}/CMYK_PDFX/marcador_59x214_front_PRINTX.pdf","Marcador frente",False),
      (f"{I5}/marcador_59x214_back_PRINT.png",59,214,f"{I5}/CMYK_PDFX/marcador_59x214_back_PRINTX.pdf","Marcador verso",False),
      (_os.path.join(_os.path.dirname(__file__),"..","..","..","convite-inquerito","final","_work","06_A6_frente.png")  # PNG intermédio do convite_arte_final.py,105,148,f"{I6}/CMYK_PDFX/06_A6_frente_PRINTX.pdf","Convite A6",True),
      (_os.path.join(_os.path.dirname(__file__),"..","..","..","convite-inquerito","final","_work","06_A4.png"),210,297,f"{I6}/CMYK_PDFX/06_A4_PRINTX.pdf","Convite A4",True),
      (_os.path.join(_os.path.dirname(__file__),"..","..","..","convite-inquerito","final","_work","06_A3.png"),297,420,f"{I6}/CMYK_PDFX/06_A3_PRINTX.pdf","Convite A3",True),
    ]
    os.makedirs(f"{I5}/CMYK_PDFX",exist_ok=True); os.makedirs(f"{I6}/CMYK_PDFX",exist_ok=True)
    for png,tw,th,out,title,marks in jobs:
        if not os.path.exists(png): print("FALTA:",png); continue
        w,h=make_pdfx(png,tw,th,out,title,marks)
        print(f"OK {os.path.basename(out)}  canvas {w:.1f}x{h:.1f}mm  trim {tw}x{th}  ({os.path.getsize(out)//1024}KB)")
