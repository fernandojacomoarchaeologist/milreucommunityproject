#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 10 — Folha de Sala · versão de IMPRESSÃO SIMPLIFICADA (2-up).
NÃO altera a arte: apenas replica as páginas finais (proof/) em A4 PAISAGEM.
  · Folha 1 (frente) = duas cópias da PÁGINA 1 (frente), lado a lado;
  · Folha 2 (verso)  = duas cópias da PÁGINA 2 (verso), lado a lado.
Imprimir duplex e cortar ao meio → duas folhas de sala A5 (frente/verso).
Cada metade A4-portrait é reduzida a A5-portrait (escala uniforme √2; sem distorção).
Linha de corte ténue ao centro (fica na margem branca das cópias; não toca a arte).
Duplex: VIRAR PELA MARGEM CURTA (short-edge) — folha paisagem, mantém o verso ao direito.
RGB, sem sangria, sem marcas (impressão doméstica/escritório)."""
import os,sys
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
REPO=_repo(HERE)
PROOF=os.path.join(REPO,"docs","dissemination","folha-sala","proof")
OUT=os.path.join(REPO,"docs","dissemination","folha-sala","final"); os.makedirs(OUT,exist_ok=True)
NAME="FOLHA_SALA_Entre_Ruinas_e_Memorias_2UP_IMPRESSAO_SIMPLIFICADA"
DPI=300; MMPX=DPI/25.4
# A4 paisagem
LW,LH=round(297*MMPX),round(210*MMPX)           # 3508 x 2480
HALF=LW//2                                       # 1754  (= 148,5 mm = A5 de largura)
HAIR=(208,198,180)

def half_page(src_png):
    """A4-portrait (trim) → A5-portrait, dimensões exactas da metade da folha."""
    im=Image.open(src_png).convert("RGB")
    return im.resize((HALF,LH),Image.LANCZOS)

def sheet(src_png):
    cv=Image.new("RGB",(LW,LH),(255,255,255))
    hp=half_page(src_png)
    cv.paste(hp,(0,0)); cv.paste(hp,(HALF,0))     # duas cópias idênticas
    d=ImageDraw.Draw(cv)
    # linha de corte ténue ao centro (tracejado), na margem branca entre as cópias
    xc=HALF; dash=round(4*MMPX); gaplen=round(3*MMPX); yy=0
    while yy<LH:
        d.line([(xc,yy),(xc,min(yy+dash,LH))],fill=HAIR,width=max(1,round(0.2*MMPX)))
        yy+=dash+gaplen
    # ticks de corte pretos no topo e base (guia)
    t=round(5*MMPX); lw=max(1,round(0.3*MMPX))
    d.line([(xc,0),(xc,t)],fill=(0,0,0),width=lw)
    d.line([(xc,LH-t),(xc,LH)],fill=(0,0,0),width=lw)
    return cv

def build():
    out=os.path.join(OUT,f"{NAME}.pdf")
    c=canvas.Canvas(out, pagesize=(297*mm,210*mm))
    c.setTitle("Entre Ruínas e Memórias — folha de sala (2-up, impressão simplificada)")
    tmp=[]
    for i,src in enumerate(["folha_frente","folha_verso"]):
        s=sheet(os.path.join(PROOF,src+".png"))
        jp=os.path.join(OUT,f".2up_{src}.jpg"); s.save(jp,"JPEG",quality=90,dpi=(DPI,DPI)); tmp.append(jp)
        c.drawImage(ImageReader(jp),0,0,width=297*mm,height=210*mm); c.showPage()
    c.save()
    # prancha de pré-visualização
    s1=sheet(os.path.join(PROOF,"folha_frente.png")); s2=sheet(os.path.join(PROOF,"folha_verso.png"))
    pad=round(6*MMPX)
    pr=Image.new("RGB",(LW+2*pad, LH*2+3*pad),(238,232,222))
    pr.paste(s1,(pad,pad)); pr.paste(s2,(pad,LH+2*pad))
    pr.resize((round(pr.size[0]*0.33),round(pr.size[1]*0.33))).save(os.path.join(OUT,"_PRANCHA_2up.png"))
    for jp in tmp: os.remove(jp)
    return out

if __name__=="__main__":
    o=build(); print("2-UP   :",o, os.path.getsize(o)//1024,"KB")
    print("Folha 1 = 2×FRENTE · Folha 2 = 2×VERSO | A4 paisagem | cortar ao meio → 2 folhas A5")
    print("Duplex : VIRAR PELA MARGEM CURTA (short-edge).")
