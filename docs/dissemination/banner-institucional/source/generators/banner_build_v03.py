# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# ITEM 14 — Banner institucional vertical. v0.3 (revisão conceptual/editorial). PROVA / HUMAN GATE. Sem arte-final/prepress.
import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import numpy as _np

def _repo(p):
    p=os.path.abspath(p)
    while p!="/" and not os.path.exists(os.path.join(p,"CLAUDE.md")): p=os.path.dirname(p)
    return p
REPO=_repo(os.path.dirname(__file__))
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
IMGDIR=os.path.join(os.path.dirname(__file__),"..","..","_private","imagens")
OUT=os.path.join(os.path.dirname(__file__),"..","..","proof"); os.makedirs(OUT,exist_ok=True)

MARF=(255,252,247); CAMPO=(251,246,238); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); HAIR=(230,220,201); BROWN=(150,74,45); PINE=(64,84,74)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k in ("d","u"):
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold",900:"Black"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f

W,H=1700,4200
MX=175; CW=W-2*MX
def trim(path):
    im=Image.open(path).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im

# ---------- COPY (v0.3) ----------
SOBRE=("O Projecto Comunitário de Milreu aproxima património, investigação e comunidade em torno das Ruínas "
       "Romanas de Milreu. Trata o sítio não como simples monumento, mas como lugar vivido, recordado e partilhado. "
       "Pela investigação, pela mediação e pela participação, reúne memórias e saberes e devolve-os à comunidade, "
       "estreitando a relação entre o património e os seus públicos.")
FRENTES=[("Museu itinerante «Entre Ruínas e Memórias»","Leva o património e as memórias de Milreu a diferentes locais e públicos."),
         ("Circuito Educativo de Milreu","Aproxima escolas e crianças da arqueologia e do património."),
         ("Investigação, mediação e participação","Escuta da comunidade e método científico ao serviço do conhecimento e da gestão do sítio."),
         ("Comunicação e recursos digitais","Portal, memórias e materiais que tornam Milreu acessível e partilhável.")]
BIO=("Gestor de projectos e de produto, com experiência em tecnologia, educação e organização. Historiador e "
     "arqueólogo, mestre em Arqueologia e doutorando em Arqueologia Pública e Comunitária na Universidade do Algarve. "
     "Reúne esta experiência na coordenação do Projecto Comunitário de Milreu.")
TITULO="Coordenação do projecto · Doutorando em Arqueologia, Universidade do Algarve"
IMGS=[("sitio_MM202608.jpg",False),("comunidade_MM202613.jpg",False),("participacao_EVID010.jpg",True)]
CREDITO="Imagens: Ruínas de Milreu · equipa de escavações, c.1981 (Col. M. L. Mendes Martins / C. e B. Pimenta) · Roda de Conversas, 2026 (F. Jácomo, CC)"

def imgband(d,im,x,y,w,h,paths):
    n=len(paths); gap=22; cw=(w-gap*(n-1))//n
    for i,(fn,color) in enumerate(paths):
        ph=Image.open(os.path.join(IMGDIR,fn)).convert("RGB"); iw,ih=ph.size
        k=max(cw/iw,h/ih); nw,nh=int(iw*k),int(ih*k); ph=ph.resize((nw,nh),Image.LANCZOS)
        l=(nw-cw)//2; t=int((nh-h)*0.38); ph=ph.crop((l,t,l+cw,t+h))
        if color:  # harmonizar a foto a cores com as históricas (dessaturação leve)
            ph=ImageEnhance.Color(ph).enhance(0.45)
        cx=x+i*(cw+gap)
        im.paste(ph,(cx,y)); d.rectangle([cx,y,cx+cw,y+h],outline=HAIR,width=2)
    return y+h

def build(variant):
    im=Image.new("RGB",(W,H),MARF); d=ImageDraw.Draw(im)
    def tw(t,f): return d.textbbox((0,0),t,font=f)[2]
    def wrap(t,f,maxw):
        out=[]
        for p in t.split("\n"):
            line=""
            for w_ in p.split(" "):
                test=(line+" "+w_).strip()
                if tw(test,f)<=maxw: line=test
                else: out.append(line); line=w_
            out.append(line)
        return out
    def para(t,k,px,fill,yy,lh=1.4,align="l",maxw=None,x0=MX,wt=None):
        f=font(k,px,wt); maxw=maxw or CW
        for ln in wrap(t,f,maxw):
            wln=tw(ln,f); x=x0 if align=="l" else (W-wln)//2 if align=="c" else MX+CW-wln
            d.text((x,yy),ln,font=f,fill=fill); yy+=int(px*lh)
        return yy
    def trackc(t,px,yy,fill,ls,x0=None,wt=600):
        f=font("u",px,wt); total=sum(tw(c,f)+ls for c in t)-ls
        x=(W-total)//2 if x0 is None else x0
        for c in t: d.text((x,yy),c,font=f,fill=fill); x+=tw(c,f)+ls
        return yy+int(px*1.35)
    def rule(yy,w=3,col=BROWN,frac=0.20,cx=True):
        ww=int(CW*frac); x=MX+(CW-ww)//2 if cx else MX
        d.rectangle([x,yy,x+ww,yy+w],fill=col); return yy+w
    def logo(path,yy,maxw,maxh,cx=W//2):
        im2=trim(path); iw,ih=im2.size; k=min(maxw/iw,maxh/ih); nw,nh=int(iw*k),int(ih*k)
        im2=im2.resize((nw,nh),Image.LANCZOS); base=Image.new("RGBA",(nw,nh),MARF+(255,)); base.alpha_composite(im2)
        im.paste(base.convert("RGB"),(int(cx-nw/2),yy)); return yy+nh

    FOOT=H-470
    # ---- TOPO: identidade (marca principal) + enquadramentos ----
    y=140
    y=logo(os.path.join(LOGODIR,"logo-projeto-comunitario-milreu.png"),y,720,720)+20
    y=para("Arqueologia Pública e Comunitária · Ruínas Romanas de Milreu, Estói (Faro)","si",33,INK5,y,1.3,"c")+12
    y=trackc("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",24,y,INK3,6)+36
    # ---- faixa documental alta (variante VISUAL: 3 imagens) ----
    if variant=="visual":
        bh=int(((CW-2*22)//3)*0.78)
        y=imgband(d,im,MX,y,CW,bh,IMGS)
        y=para(CREDITO,"u",19,INK3,y+10,1.3)+34
        y=rule(y)+40
    else:
        y=rule(y)+46
    # ---- SOBRE O PROJECTO (perene) ----
    y=trackc("SOBRE O PROJECTO",27,y,INK,6,x0=MX)+28
    y=para(SOBRE,"s",37,INK7,y,1.46)+52
    # ---- FRENTES DO PROJECTO (4) ----
    y=trackc("FRENTES DO PROJECTO",27,y,INK,6,x0=MX)+34
    for tit,txt in FRENTES:
        d.rectangle([MX,y+4,MX+10,y+50],fill=RED)
        y2=para(tit,"d",37,INK,y,1.04,"l",CW-48,x0=MX+48,wt=600)
        y2=para(txt,"s",31,INK7,y2,1.4,"l",CW-48,x0=MX+48)
        y=max(y2,y+56)+22
    y+=28
    # ---- faixa documental (variante SÓBRIA: 2 imagens) ----
    if variant=="sobria":
        bh=int(((CW-22)//2)*0.62)
        y=imgband(d,im,MX,y+8,CW,bh,IMGS[:2])
        y=para("Imagens: Ruínas de Milreu · equipa de escavações, c.1981 (Col. M. L. Mendes Martins / C. e B. Pimenta)","u",19,INK3,y+10,1.3)+28
    y=rule(y+6)+44
    # ---- COORDENAÇÃO ----
    y=trackc("COORDENAÇÃO",27,y,INK,6,x0=MX)+26
    y=para("Fernando Rodrigues de Jácomo","d",44,INK,y,1.04,wt=600)+4
    y=para(TITULO,"si",29,INK5,y,1.3)+18
    y=para(BIO,"s",33,INK7,y,1.44)

    # ---- RODAPÉ institucional ----
    d.rectangle([0,FOOT,W,FOOT+6],fill=BROWN)
    yy=FOOT+48
    yy=trackc("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",27,yy,RED,7)+6
    tt="Projecto Comunitário de Milreu"; f=font("d",33,600); d.text(((W-tw(tt,f))//2,yy),tt,font=f,fill=INK); yy+=52
    us="projectomilreu.pt"; f=font("u",28,600); d.text(((W-tw(us,f))//2,yy),us,font=f,fill=RED); yy+=58
    OPT=112
    def scaled(fn,fac=1.0):
        im2=trim(os.path.join(LOGODIR,fn)); iw,ih=im2.size; th=OPT*fac; k=th/ih
        return im2.resize((int(iw*k),int(th)),Image.LANCZOS)
    rowy=yy+28
    d.text((MX,rowy),"APOIO",font=font("u",21,600),fill=INK5)
    lblx2=MX+int(CW*0.30)
    d.text((lblx2,rowy),"PARCERIA · ACOMPANHAMENTO · INSTITUIÇÕES",font=font("u",21,600),fill=INK5)
    logoy=rowy+38; rowh=OPT
    lg=scaled("logo-ccdr-algarve.png",1.0); base=Image.new("RGBA",lg.size,MARF+(255,)); base.alpha_composite(lg)
    im.paste(base.convert("RGB"),(MX,logoy+(rowh-lg.size[1])//2))
    sepx=MX+int(CW*0.285); d.rectangle([sepx,logoy-4,sepx+2,logoy+rowh+4],fill=HAIR)
    parc=[("logo-associacao-amigos-museu-lyceu-faro.png",0.80),("logo-ualg-completo.png",1.0),("Milreu_policromatico.png",0.92)]
    imgs=[scaled(fn,fac) for fn,fac in parc]
    gx0=lblx2; avail=MX+CW-gx0; totalw=sum(i.size[0] for i in imgs)
    gap=max(22,(avail-totalw)//(len(imgs)-1)); gx=gx0
    for lgp in imgs:
        base=Image.new("RGBA",lgp.size,MARF+(255,)); base.alpha_composite(lgp)
        im.paste(base.convert("RGB"),(gx,logoy+(rowh-lgp.size[1])//2)); gx+=lgp.size[0]+gap
    yy=logoy+rowh+30
    cp="© 2026 Fernando Rodrigues de Jácomo"; f=font("u",22); d.text(((W-tw(cp,f))//2,yy),cp,font=f,fill=INK5)
    return im

SOBR=build("sobria"); VIS=build("visual")
SOBR.save(os.path.join(OUT,"BANNER_v0.3_A_sobria.png"),"PNG")
VIS.save(os.path.join(OUT,"BANNER_v0.3_B_visual.png"),"PNG")
sc=760/W; aw,ah=int(W*sc),int(H*sc)
comp=Image.new("RGB",(aw*2+90,ah+120),(238,232,222))
comp.paste(SOBR.resize((aw,ah),Image.LANCZOS),(30,90)); comp.paste(VIS.resize((aw,ah),Image.LANCZOS),(aw+60,90))
cd=ImageDraw.Draw(comp)
cd.text((30+aw//2-150,34),"A — sóbria (2 imagens)",font=font("u",30,600),fill=INK)
cd.text((aw+60+aw//2-170,34),"B — visual/documental (3 imagens)",font=font("u",30,600),fill=INK)
comp.save(os.path.join(OUT,"BANNER_v0.3_COMPARACAO.png"),"PNG")
print("OK v0.3 sobria/visual + comparação", VIS.size)
