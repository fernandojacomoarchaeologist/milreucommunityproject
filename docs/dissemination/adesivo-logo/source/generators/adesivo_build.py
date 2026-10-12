#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item novo — ADESIVO (sticker) redondo do logótipo «Projecto Comunitário de Milreu».

Princípios: o logótipo é um ASSET OFICIAL — preservado tal como é (proporção, composição,
cores chapadas, texto «PROJETO»). NÃO se adiciona gradiente, brilho, textura, sombra nem se
recolore (regras logo-integrity, flat-colours). O adesivo é só: logótipo centrado sobre fundo
marfim (MARF), com sangria 3 mm e linha de corte circular.

Saídas:
  proof/adesivo_logo_redondo_50mm_PROVA.png   — prova com guias (sangria, corte Ø50, safe)
  print/adesivo_logo_redondo_50mm_sangria3mm.pdf — print RGB 300 dpi, Ø56 mm (trim Ø50 + 3 mm), SEM guias
  print/adesivo_logo_redondo_50mm_sangria3mm.png — idem raster
Correr: PYTHONPATH=<pydeps> python3 adesivo_build.py   (fontes não necessárias; só PIL)
"""
import os
from PIL import Image, ImageDraw

def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
HERE=os.path.dirname(os.path.abspath(__file__)); REPO=_repo(HERE)
BASE=os.path.join(REPO,"docs","dissemination","adesivo-logo")
PROOF=os.path.join(BASE,"proof"); PRINT=os.path.join(BASE,"print")
os.makedirs(PROOF,exist_ok=True); os.makedirs(PRINT,exist_ok=True)
LOGO=os.path.join(REPO,"public","media","exhibition","updated","logos","logo-projeto-comunitario-milreu.png")

# ---- parâmetros ----
DPI=300; MM=DPI/25.4
TRIM_MM=50.0; BLEED_MM=3.0; SAFE_MM=40.0   # safe = zona onde o logo deve ficar contido
LOGO_MAX_MM=35.0                            # altura/largura máxima do logótipo (margem ao corte)
MARF=(255,252,247); STONE=(214,206,190); INK=(30,26,23)

canvas_mm=TRIM_MM+2*BLEED_MM
D=round(canvas_mm*MM)                        # canvas quadrado DxD
cx=cy=D/2
trim_r=TRIM_MM*MM/2
bleed_r=canvas_mm*MM/2
safe_r=SAFE_MM*MM/2

def load_logo(maxpx):
    im=Image.open(LOGO).convert("RGBA")
    k=min(maxpx/im.size[0], maxpx/im.size[1])
    return im.resize((max(1,round(im.size[0]*k)), max(1,round(im.size[1]*k))), Image.LANCZOS)

logo=load_logo(round(LOGO_MAX_MM*MM))

def base_canvas():
    # fundo marfim a toda a área (a sangria é marfim); recorte circular ao Ø56 (bordo do adesivo)
    cv=Image.new("RGBA",(D,D),(0,0,0,0))
    d=ImageDraw.Draw(cv)
    d.ellipse([cx-bleed_r,cy-bleed_r,cx+bleed_r,cy+bleed_r],fill=MARF+(255,))
    cv.alpha_composite(logo,(round(cx-logo.size[0]/2), round(cy-logo.size[1]/2)))
    return cv

def save_print():
    cv=base_canvas().convert("RGB")
    cv.save(os.path.join(PRINT,"adesivo_logo_redondo_50mm_sangria3mm.png"))
    cv.save(os.path.join(PRINT,"adesivo_logo_redondo_50mm_sangria3mm.pdf"),"PDF",resolution=DPI)

def save_proof():
    cv=base_canvas().convert("RGB")
    d=ImageDraw.Draw(cv)
    def circ(r,color,w,dash=False):
        bb=[cx-r,cy-r,cx+r,cy+r]
        if not dash: d.ellipse(bb,outline=color,width=w)
        else:
            import math
            steps=180
            for i in range(steps):
                if i%2: continue
                a0=2*math.pi*i/steps; a1=2*math.pi*(i+1)/steps
                d.line([(cx+r*math.cos(a0),cy+r*math.sin(a0)),(cx+r*math.cos(a1),cy+r*math.sin(a1))],fill=color,width=w)
    circ(bleed_r, STONE, max(1,round(0.3*MM)))                 # bordo da sangria (Ø56)
    circ(trim_r, (168,50,39), max(1,round(0.4*MM)))            # LINHA DE CORTE Ø50 (vermelho)
    circ(safe_r, (120,170,120), max(1,round(0.25*MM)), True)   # safe Ø40 (tracejado verde)
    d.text((8,8),"PROVA — nao imprimir as guias | corte Ø50mm (vermelho) · sangria 3mm (cinza) · safe Ø40mm (verde)",fill=INK)
    cv.save(os.path.join(PROOF,"adesivo_logo_redondo_50mm_PROVA.png"))

if __name__=="__main__":
    print("logo:",logo.size,"px | canvas:",D,"px =",round(canvas_mm),"mm | trim Ø",TRIM_MM,"mm +",BLEED_MM,"mm sangria @",DPI,"dpi")
    save_print(); save_proof()
    print("OK -> print/ (PDF+PNG) + proof/ (PROVA com guias)")
