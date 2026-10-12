# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# ITEM 14 — Banner institucional perene. v0.4 (5 frentes · só P&B · C1/C2). PROVA / HUMAN GATE. Sem final/prepress/PR.
import os
from PIL import Image, ImageDraw, ImageFont
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
RED=(168,50,39); HAIR=(230,220,201); BROWN=(150,74,45)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
_fc={}
def font(k,px,wt=None):
    kk=(k,int(px),wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],int(px))
    if wt and k in ("d","u"):
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold",900:"Black"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f

W,H=1700,4000
MX=170; CW=W-2*MX
def trim(path):
    im=Image.open(path).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im

SOBRE=("Nascido no âmbito de uma investigação de doutoramento em Arqueologia na Universidade do Algarve, o Projecto "
       "Comunitário de Milreu desenvolve-se como um programa de Arqueologia Pública e Comunitária que aproxima "
       "património, investigação e comunidade em torno das Ruínas Romanas de Milreu. Pela investigação, mediação e "
       "participação, reúne memórias e saberes e devolve-os à comunidade.")
FRENTES=[("«Entre Ruínas e Memórias»","Museu, exposição itinerante e componente digital sobre as memórias e as relações entre a população e Milreu."),
         ("Circuito Educativo de Milreu","Experiências e recursos pedagógicos que aproximam diferentes públicos da arqueologia, do património e da cultura material."),
         ("Documentando Milreu","Documentação e registo continuado do sítio, das suas memórias e das relações entre património, investigação e comunidade."),
         ("Investigação, participação e comunicação científica","Investigação arqueológica, mediação, actividades com a comunidade, encontros, congressos e partilha pública dos processos e resultados do projecto.")]
BIO=("Gestor de projectos e de produto, com mais de 20 anos de experiência em tecnologia, organização e "
     "desenvolvimento de produtos e iniciativas. Historiador e arqueólogo, mestre em Arqueologia e doutorando na "
     "Universidade do Algarve. No Projecto Comunitário de Milreu articula investigação, gestão, participação pública "
     "e o desenvolvimento das suas diferentes frentes.")
TITULO="Coordenação do projecto · Doutorando em Arqueologia, Universidade do Algarve"
BW=lambda im: im.convert("L").convert("RGB")
SETS={
 "c1":(["sitio_MM202608.jpg","comunidade_MM202613.jpg","participacao_EVID010.jpg"],
       "Imagens (P&B) — autoria desconhecida, salvo indicação: Edifício de cultos em Milreu (c.1910) · Equipa de escavações em Milreu (c.1981; col. Maria de Lurdes Mendes Martins, fot. providenciada por Celeste e Branca Pimenta) · Roda de Conversas com a comunidade (2026; Fernando Jácomo, CC). Fonte digital (Edifício de cultos): ALDEIA DE ESTÓI – CULTURA E PATRIMÓNIO."),
 "c2":(["sitio_MM202608.jpg","comunidade_MM202613.jpg","descobertas_MM202603.jpg"],
       "Imagens (P&B) — autoria desconhecida: Edifício de cultos em Milreu (c.1910) · Achados romanos em Milreu, associados às descobertas de 1966 · Equipa de escavações em Milreu (c.1981; col. Maria de Lurdes Mendes Martins, fot. providenciada por Celeste e Branca Pimenta). Fonte digital (Edifício de cultos e Achados): ALDEIA DE ESTÓI – CULTURA E PATRIMÓNIO.")}

def build(variant, eg=0):
    files,credito=SETS[variant]
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
    def rule(yy,w=3,col=BROWN,frac=0.18,cx=True):
        ww=int(CW*frac); x=MX+(CW-ww)//2 if cx else MX
        d.rectangle([x,yy,x+ww,yy+w],fill=col); return yy+w
    def logo(path,yy,maxw,maxh,cx=W//2):
        im2=trim(path); iw,ih=im2.size; k=min(maxw/iw,maxh/ih); nw,nh=int(iw*k),int(ih*k)
        im2=im2.resize((nw,nh),Image.LANCZOS); base=Image.new("RGBA",(nw,nh),MARF+(255,)); base.alpha_composite(im2)
        im.paste(base.convert("RGB"),(int(cx-nw/2),yy)); return yy+nh
    def band(y,h):
        n=len(files); gap=22; cw=(CW-gap*(n-1))//n
        for i,fn in enumerate(files):
            ph=BW(Image.open(os.path.join(IMGDIR,fn)).convert("RGB"))
            if i==1:  # imagem central: remover faixas brancas de digitalização (zoom p/ preencher a célula)
                _g=_np.asarray(ph.convert("L")); _mk=_g<238
                _c=_np.where(_mk.any(0))[0]; _r=_np.where(_mk.any(1))[0]
                if len(_c) and len(_r): ph=ph.crop((int(_c.min()),int(_r.min()),int(_c.max())+1,int(_r.max())+1))
            iw,ih=ph.size
            k=max(cw/iw,h/ih); nw,nh=int(iw*k),int(ih*k); ph=ph.resize((nw,nh),Image.LANCZOS)
            l=(nw-cw)//2; t=int((nh-h)*0.4); ph=ph.crop((l,t,l+cw,t+h))
            cx=MX+i*(cw+gap); im.paste(ph,(cx,y)); d.rectangle([cx,y,cx+cw,y+h],outline=HAIR,width=2)
        return y+h

    FOOT=H-520
    y=150
    y=logo(os.path.join(LOGODIR,"logo-projeto-comunitario-milreu.png"),y,700,700)+18
    y=para("Arqueologia Pública e Comunitária · Ruínas Romanas de Milreu, Estói (Faro)","si",34,INK5,y,1.3,"c")+12
    y=trackc("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",25,y,INK3,6)+40
    # faixa documental grande (3 imagens P&B)
    bh=int(((CW-2*22)//3)*1.02)+int(eg*0.5)
    y=band(y,bh)
    y=para(credito,"u",22,INK5,y+12,1.32)+40+eg
    y=rule(y)+46
    # SOBRE (condensado)
    y=trackc("SOBRE O PROJECTO",28,y,INK,6,x0=MX)+30
    y=para(SOBRE,"s",40,INK7,y,1.52)+54+eg
    # FRENTES DO PROJECTO (5)
    y=trackc("FRENTES DO PROJECTO",28,y,INK,6,x0=MX)+40
    for tit,txt in FRENTES:
        d.rectangle([MX,y+5,MX+11,y+56],fill=RED)
        y2=para(tit,"d",41,INK,y,1.05,"l",CW-52,x0=MX+52,wt=600)
        y2=para(txt,"s",33,INK7,y2,1.44,"l",CW-52,x0=MX+52)
        y=max(y2,y+62)+34+int(eg*0.30)
    y+=26; y=rule(y)+46+eg
    # COORDENAÇÃO
    y=trackc("COORDENAÇÃO",28,y,INK,6,x0=MX)+28
    y=para("Fernando Rodrigues de Jácomo","d",46,INK,y,1.04,wt=600)+4
    y=para(TITULO,"si",30,INK5,y,1.3)+20
    y=para(BIO,"s",34,INK7,y,1.46)
    end_y=y

    # RODAPÉ — hierarquia canónica: Projecto (em cima) → MSF 2026 (em baixo) → iniciativas do ciclo
    d.rectangle([0,FOOT,W,FOOT+6],fill=BROWN)
    yy=FOOT+46
    tt="Projecto Comunitário de Milreu"; f=font("d",35,600); d.text(((W-tw(tt,f))//2,yy),tt,font=f,fill=INK); yy+=54
    yy=trackc("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",26,yy,RED,7)+2
    yy=para("«Entre Ruínas e Memórias» · Circuito Educativo de Milreu","si",28,INK5,yy,1.2,"c")+10
    us="projectomilreu.pt"; f=font("u",28,600); d.text(((W-tw(us,f))//2,yy),us,font=f,fill=RED); yy+=52
    # Faixa de logótipos CANÓNICA (uma só fila): Projecto · CCDR · AAMLF · Junta de Estoi · trio (indivisível) · UAlg.
    # Espaçamento CANÓNICO = 0,6 × altura, igual entre todos; enche a largura por ESCALA UNIFORME (nunca alargando intervalos).
    OPT=96
    def sc(fn,fac=1.0):
        im2=trim(os.path.join(LOGODIR,fn)); iw,ih=im2.size; th=OPT*fac; k=th/ih
        return im2.resize((max(1,int(iw*k)),max(1,int(th))),Image.LANCZOS)
    hdr="APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS"
    fh=font("u",21,600)
    if tw(hdr,fh)>CW: hdr="APOIO INSTITUCIONAL E PARCERIAS"
    d.text((MX,yy+18),hdr,font=fh,fill=INK5)
    logoy=yy+18+42
    CANON=[("logo-projeto-comunitario-milreu.png",0.86),("logo-ccdr-algarve.png",1.00),
           ("logo-associacao-amigos-museu-lyceu-faro.png",0.80),("logo-junta-freguesia-estoi.png",0.88),
           ("Milreu_policromatico.png",0.92),("logo-ualg-completo.png",0.98)]
    imgs=[sc(fn,fac) for fn,fac in CANON]
    GAP=0.6*OPT
    needed=sum(i.size[0] for i in imgs)+GAP*(len(imgs)-1)
    k=CW/needed
    imgs=[i.resize((max(1,int(i.size[0]*k)),max(1,int(i.size[1]*k))),Image.LANCZOS) for i in imgs]
    gap=GAP*k; rowh=max(i.size[1] for i in imgs); gx=float(MX)
    for lgp in imgs:
        base=Image.new("RGBA",lgp.size,MARF+(255,)); base.alpha_composite(lgp)
        im.paste(base.convert("RGB"),(int(round(gx)),logoy+(rowh-lgp.size[1])//2)); gx+=lgp.size[0]+gap
    yy=logoy+rowh+28
    cp="© 2026 Fernando Rodrigues de Jácomo"; f=font("u",22); d.text(((W-tw(cp,f))//2,yy),cp,font=f,fill=INK5)
    return im, end_y

def build2(variant):
    _,e0=build(variant,0); slack=(H-520-56)-e0; eg=max(0,int(slack/5.0))
    im,_=build(variant,eg); return im
V=build2("c2")
V.save(os.path.join(OUT,"BANNER_v0.6b_final.png"),"PNG")
# crops: Sobre o projecto + Coordenação (reflow dos dois blocos alterados)
for name,box in [("crop_sobre",(120,1560,W-120,1980)),("crop_coordenacao",(120,2960,W-120,H-540))]:
    V.crop(box).save(os.path.join(OUT,f"BANNER_v0.6b_{name}.png"))
print("OK v0.6b (SOBRE + bio — enquadramento académico; layout intacto)", V.size)
