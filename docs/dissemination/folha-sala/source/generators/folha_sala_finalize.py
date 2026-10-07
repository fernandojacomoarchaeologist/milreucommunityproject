#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 10 — finalização: DIGITAL (RGB A4 + hyperlinks) e PRINT (RGB A4 + sangria 3mm + marcas).
Lê proof/ (gerado por folha_sala_build.py a ITEM10_DPI=300). NÃO simula ICC CMYK definitivo (FASE B).
Página 1 = FRENTE · Página 2 = VERSO. Duplex: virar na margem LONGA (long-edge)."""
import os,sys,json,shutil
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import pikepdf
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
REPO=_repo(HERE)
PROOF=os.path.join(REPO,"docs","dissemination","folha-sala","proof")
OUT=os.path.join(REPO,"docs","dissemination","folha-sala","final"); os.makedirs(OUT,exist_ok=True)
SVGOUT=os.path.join(OUT,"svg"); os.makedirs(SVGOUT,exist_ok=True)
meta=json.load(open(os.path.join(PROOF,"_links.json")))
DPI=meta["dpi"]; S=72.0/DPI; TW,TH=meta["trim_mm"]
PAGES=["folha_frente","folha_verso"]
NAME="FOLHA_SALA_Entre_Ruinas_e_Memorias"
MARF=(255,252,247); BLEED_MM=3

def build_digital():
    out=os.path.join(OUT,f"{NAME}_DIGITAL.pdf")
    from reportlab.lib.utils import ImageReader
    c=canvas.Canvas(out, pagesize=(TW*mm,TH*mm)); c.setTitle("Entre Ruínas e Memórias — folha de sala")
    tmp=[]
    for p in PAGES:
        im=Image.open(os.path.join(PROOF,p+".png")).convert("RGB")
        jp=os.path.join(OUT,f".{p}.jpg"); im.save(jp,"JPEG",quality=90,dpi=(DPI,DPI)); tmp.append(jp)
        c.drawImage(ImageReader(jp),0,0,width=TW*mm,height=TH*mm); c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    pdf=pikepdf.open(out, allow_overwriting_input=True); Hpt=TH*mm
    for i,p in enumerate(PAGES):
        annots=pikepdf.Array()
        for (x0,y0,x1,y1,target) in meta["links"].get(p,[]):
            tx0=x0*S; tx1=x1*S; ty_top=y0*S; ty_bot=y1*S
            rect=pikepdf.Array([tx0, Hpt-ty_bot, tx1, Hpt-ty_top])
            a=pikepdf.Dictionary(Type=pikepdf.Name("/Annot"),Subtype=pikepdf.Name("/Link"),
                Rect=rect,Border=pikepdf.Array([0,0,0]),
                A=pikepdf.Dictionary(S=pikepdf.Name("/URI"),URI=pikepdf.String(target)))
            annots.append(pdf.make_indirect(a))
        if len(annots): pdf.pages[i].Annots=annots
    pdf.save(out); pdf.close()
    return out

def crop_marks(im,bleed_px):
    W,H=im.size; d=ImageDraw.Draw(im)
    g=round(3.0*DPI/25.4); gap=round(1.5*DPI/25.4); lw=max(2,round(0.25*DPI/25.4))
    for (x,y,sx,sy) in [(bleed_px,bleed_px,-1,-1),(W-bleed_px,bleed_px,1,-1),(bleed_px,H-bleed_px,-1,1),(W-bleed_px,H-bleed_px,1,1)]:
        d.line([(x,y+sy*gap),(x,y+sy*(gap+g))],fill=(0,0,0),width=lw)
        d.line([(x+sx*gap,y),(x+sx*(gap+g),y)],fill=(0,0,0),width=lw)
    return im

def build_print():
    out=os.path.join(OUT,f"{NAME}_PRINT.pdf")
    from reportlab.lib.utils import ImageReader
    bleed_px=round(BLEED_MM*DPI/25.4); cw_mm=TW+2*BLEED_MM; ch_mm=TH+2*BLEED_MM
    c=canvas.Canvas(out, pagesize=(cw_mm*mm,ch_mm*mm)); c.setTitle("Entre Ruínas e Memórias — folha de sala (print)")
    tmp=[]
    for p in PAGES:
        trim=Image.open(os.path.join(PROOF,p+".png")).convert("RGB")
        cv=Image.new("RGB",(trim.size[0]+2*bleed_px, trim.size[1]+2*bleed_px), MARF)  # fundo marfim = sangria
        cv.paste(trim,(bleed_px,bleed_px)); cv=crop_marks(cv,bleed_px)
        jp=os.path.join(OUT,f".{p}_pr.jpg"); cv.save(jp,"JPEG",quality=93,dpi=(DPI,DPI)); tmp.append(jp)
        c.drawImage(ImageReader(jp),0,0,width=cw_mm*mm,height=ch_mm*mm); c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    pdf=pikepdf.open(out, allow_overwriting_input=True)
    PT=lambda v: v*72/25.4
    media=[0,0,PT(cw_mm),PT(ch_mm)]; trimbox=[PT(BLEED_MM),PT(BLEED_MM),PT(BLEED_MM+TW),PT(BLEED_MM+TH)]
    for pg in pdf.pages:
        pg.MediaBox=media; pg.BleedBox=media; pg.TrimBox=trimbox; pg.ArtBox=trimbox
    pdf.docinfo[pikepdf.Name("/Trapped")]=pikepdf.Name("/False")
    pdf.save(out); pdf.close()
    return out

def copy_svg():
    for p in PAGES:
        src=os.path.join(PROOF,"svg",p+".svg")
        if os.path.exists(src): shutil.copy(src, os.path.join(SVGOUT,p+".svg"))

if __name__=="__main__":
    copy_svg()
    d=build_digital(); print("DIGITAL:",d, os.path.getsize(d)//1024,"KB")
    pr=build_print(); print("PRINT  :",pr, os.path.getsize(pr)//1024,"KB")
    print("SVG    :",SVGOUT)
    print("Duplex : virar na margem LONGA (long-edge). Página 1 = FRENTE · Página 2 = VERSO.")
