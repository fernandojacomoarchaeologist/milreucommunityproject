#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 12 — Poster de Congresso 2: adaptação editorial 2026 MÍNIMA (opção C aprovada).
# NÃO redesenha o corpo do poster aprovado: escala uniforme (proporção preservada) + rodapé 2026 discreto.
# Produz:
#   final/poster_congresso2_C.svg          -> corpo aprovado EMBEBIDO (raster) + rodapé em VETOR-TEXTO vivo + logos
#   final/poster_congresso2_C_preview.png  -> render de verificação (PIL), coords idênticas ao SVG
# O rodapé em vetor mantém o texto nítido a qualquer dimensão (resolve o "corte"/pixelização na versão grande).
# Corpo = resolução nativa do PSD aprovado (1200x1700); não há master de maior resolução (ver CONTENT_NOTES).
import os, io, base64, html
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE=os.path.dirname(os.path.abspath(__file__))
def _repo_root(p):
    p=os.path.abspath(p)
    while p!="/" and not os.path.exists(os.path.join(p,"CLAUDE.md")): p=os.path.dirname(p)
    return p
REPO=_repo_root(HERE)
OUT=os.path.join(REPO,"docs","dissemination","poster-congresso2","final"); os.makedirs(OUT,exist_ok=True)
BODY=os.path.join(REPO,"docs","dissemination","poster-congresso2","source","poster_body.png")  # composto aprovado (PSD->PNG)
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
LOGOS=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png",
       "logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
FP=os.path.expanduser("~/Library/Fonts/")

# --- geometria (coords partilhadas SVG + preview) ---
W,H=1200,1700
FOOTER_H=100
TOP=H-FOOTER_H                     # 1600
S=(H-FOOTER_H)/H                   # escala uniforme do corpo
CW=round(W*S); OX=(W-CW)//2        # corpo centrado (barras de papel finas nos lados)
MX=56
SEPY=TOP+16                        # separador fino
# cores (Design System)
PAPER="#F7F4EE"; INK="#1E1A17"; INK5="#766D64"; KEY="#B0A491"; HAIR="#D6CEBE"
PAPER_T=(247,244,238); INK_T=(30,26,23); INK5_T=(118,109,100); KEY_T=(176,164,145); HAIR_T=(214,206,190)
# rodapé — linha esquerda (assinatura) / direita (apoios)
SIG_Y=1650; SIG_PX=21            # "Projecto Comunitário de Milreu" (Archivo, INK)
MSF_Y=1674; MSF_PX=13; MSF_LS=1.1  # "MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026" (Archivo, KEY)
EYE_Y=1638; EYE_PX=12; EYE_LS=0.8  # "APOIO INSTITUCIONAL E PARCERIAS" (Archivo, INK5)
LOGO_H=30; LOGO_TOP=1646; LOGO_GAPF=0.6; LOGO_RIGHT=W-MX  # barra alinhada à direita
SIG="Projecto Comunitário de Milreu"
MSF="MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026"
EYE="APOIO INSTITUCIONAL E PARCERIAS"

def trim(im):
    a=np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=np.where(mask)
    return im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1)) if len(xs) else im

def logo_list(h):
    out=[]
    for fn in LOGOS:
        im=trim(Image.open(os.path.join(LOGODIR,fn)).convert("RGBA"))
        w=max(1,round(im.size[0]*h/im.size[1]))
        out.append((fn,im,w,h))
    return out

def logo_layout():
    L=logo_list(LOGO_H); gap=round(LOGO_H*LOGO_GAPF)
    tot=sum(w for *_,w,_ in L)+gap*(len(L)-1)
    sx=LOGO_RIGHT-tot                 # alinhado à direita
    xs=[]; cx=sx
    for fn,im,w,h in L: xs.append((fn,im,round(cx),w,h)); cx+=w+gap
    return xs, sx, tot

def b64_png(im):
    b=io.BytesIO(); im.save(b,"PNG"); return base64.b64encode(b.getvalue()).decode()

# ---------------- SVG ----------------
def build_svg():
    body=Image.open(BODY).convert("RGB")
    bb=io.BytesIO(); body.save(bb,"JPEG",quality=92)  # corpo fotográfico -> JPEG q92 (nativo 1200x1700)
    body_b64=base64.b64encode(bb.getvalue()).decode()
    xs,_,_=logo_layout()
    esc=html.escape
    T=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    T.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="{PAPER}"/>')
    # corpo aprovado embebido (escala uniforme, centrado)
    T.append(f'<image x="{OX}" y="0" width="{CW}" height="{TOP}" '
             f'xlink:href="data:image/jpeg;base64,{body_b64}"/>')
    # separador
    T.append(f'<line x1="{MX}" y1="{SEPY}" x2="{W-MX}" y2="{SEPY}" stroke="{HAIR}" stroke-width="2"/>')
    # assinatura (esq)
    T.append(f'<text x="{MX}" y="{SIG_Y}" font-family="Archivo, sans-serif" font-size="{SIG_PX}" '
             f'font-weight="600" fill="{INK}">{esc(SIG)}</text>')
    T.append(f'<text x="{MX}" y="{MSF_Y}" font-family="Archivo, sans-serif" font-size="{MSF_PX}" '
             f'letter-spacing="{MSF_LS}" fill="{KEY}">{esc(MSF)}</text>')
    # apoios (dir) — eyebrow alinhado ao início da barra de logos
    _,sx,_=logo_layout()
    T.append(f'<text x="{sx}" y="{EYE_Y}" font-family="Archivo, sans-serif" font-size="{EYE_PX}" '
             f'letter-spacing="{EYE_LS}" fill="{INK5}">{esc(EYE)}</text>')
    for fn,im,x,w,h in xs:
        T.append(f'<image x="{x}" y="{LOGO_TOP}" width="{w}" height="{h}" '
                 f'xlink:href="data:image/png;base64,{b64_png(im)}"/>')
    T.append('</svg>')
    svg="\n".join(T)
    p=os.path.join(OUT,"poster_congresso2_C.svg"); open(p,"w",encoding="utf-8").write(svg)
    return p, len(svg)

# ---------------- PREVIEW PNG (coords idênticas) ----------------
def F(px,wt=None):
    f=ImageFont.truetype(FP+"Archivo.ttf",px)
    return f
def build_preview(scale=2):
    cv=Image.new("RGB",(W*scale,H*scale),PAPER_T)
    body=Image.open(BODY).convert("RGB").resize((CW*scale,TOP*scale),Image.LANCZOS)
    cv.paste(body,(OX*scale,0))
    d=ImageDraw.Draw(cv)
    def sp(x,y,t,px,fill,ls=0):
        f=F(px*scale); cx=x*scale
        for ch in t:
            d.text((cx,y*scale),ch,font=f,fill=fill); cx+=d.textlength(ch,font=f)+ls*scale
    d.line([(MX*scale,SEPY*scale),((W-MX)*scale,SEPY*scale)],fill=HAIR_T,width=2*scale)
    # assinatura: baseline no SVG ~ y; no PIL 'la' top. Ajuste aproximado (-px) p/ alinhar visualmente.
    d.text((MX*scale,(SIG_Y-SIG_PX)*scale),SIG,font=F(SIG_PX*scale),fill=INK_T)
    sp(MX,MSF_Y-MSF_PX,MSF,MSF_PX,KEY_T,MSF_LS)
    _,sx,_=logo_layout()
    sp(sx,EYE_Y-EYE_PX,EYE,EYE_PX,INK5_T,EYE_LS)
    for fn,im,x,w,h in logo_layout()[0]:
        rim=im.resize((w*scale,h*scale),Image.LANCZOS)
        cv.paste(rim,(x*scale,LOGO_TOP*scale),rim)
    p=os.path.join(OUT,"poster_congresso2_C_preview.png")
    cv.save(p); return p, cv.size

if __name__=="__main__":
    sp_,n=build_svg(); print("SVG :",sp_, n//1024,"KB")
    pp,sz=build_preview(); print("PREV:",pp,sz)
