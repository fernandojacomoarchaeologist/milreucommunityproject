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
# Item 9 — Kit Digital + Press Kit. FASE 1: previews (Fact Sheet, nota de imprensa, social instituc./local, web hero).
import os, sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode, numpy as _np
OUTP=os.path.join(HERE,"previews"); os.makedirs(OUTP,exist_ok=True)
GEN=_os.path.join(_REPO,"public","media","museum","generated")
LOGODIR=_os.path.join(_REPO,"public","media","exhibition","updated","logos")
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
IMG=GEN+"/MM202601/immersive.webp"; IMG608=GEN+"/MM202608/immersive.webp"
QURL="https://projectomilreu.pt"
MARF=(255,252,247); CAMPO=(251,246,238); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201)
FP=os.path.expanduser("~/Library/Fonts/"); FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf"}
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k=="d":
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold",900:"Black"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f
def _trim(p):
    im=Image.open(p).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im
class F:
    def __init__(s,W,H,bg=MARF): s.W=W;s.H=H;s.im=Image.new("RGB",(W,H),bg);s.d=ImageDraw.Draw(s.im)
    def rect(s,x,y,w,h,fill,outline=None,ow=1): s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
    def line(s,x1,y1,x2,y2,fill,w=1): s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
    def imgcover(s,x,y,w,h,path,ah=0.5,av=0.5):
        im=Image.open(path).convert("RGB");iw,ih=im.size;k=max(w/iw,h/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k));im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-w)*ah);t=round((nh-h)*av);s.im.paste(im.crop((l,t,l+w,t+h)),(round(x),round(y)))
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and len(t)>1 and a=="l":
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=s.d.textlength(ch,font=ft)+ls
        else: s.d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
    def wrap(s,t,k,px,maxw,wt=None):
        out=[]
        for pa in t.split("\n"):
            ln=""
            for w in pa.split():
                tt=(ln+" "+w).strip()
                if s.tw(tt,k,px,wt)<=maxw or not ln: ln=tt
                else: out.append(ln);ln=w
            out.append(ln)
        return out
    def para(s,x,y,t,k,px,maxw,fill=INK7,lh=1.42,a="l",wt=None):
        for ln in s.wrap(t,k,px,maxw,wt):
            xx=x if a=="l" else (x+maxw/2 if a=="m" else x+maxw)
            s.text(xx,y,ln,k,px,fill,a,wt); y+=round(px*lh)
        return y
    def fitpara(s,x,y,t,k,maxpx,minpx,maxw,maxlines,fill=INK,lh=1.06,wt=None):
        px=maxpx
        while px>minpx and len(s.wrap(t,k,px,maxw,wt))>maxlines: px-=1
        yy=y
        for ln in s.wrap(t,k,px,maxw,wt): s.text(x,yy,ln,k,px,fill,"l",wt); yy+=round(px*lh)
        return yy
    def qr(s,x,y,size,fg=INK,bg=MARF):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0);q.add_data(QURL);q.make(fit=True)
        m=q.get_matrix();n=len(m);s.rect(x,y,size,size,bg,outline=KEY,ow=max(1,size//180))
        qz=size*0.08;inner=size-2*qz;ms=inner/n
        for r in range(n):
            for c in range(n):
                if m[r][c]: s.d.rectangle([x+qz+c*ms,y+qz+r*ms,x+qz+c*ms+ms+0.6,y+qz+r*ms+ms+0.6],fill=fg)
    def logoband(s,x,y,h):
        gap=0.6*h; cx=float(x)
        for fn in LOGOS_CANON:
            p=os.path.join(LOGODIR,fn)
            if not os.path.exists(p): continue
            im=_trim(p); w=h*im.size[0]/im.size[1]; rim=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
            s.im.paste(rim,(round(cx),round(y)),rim); cx+=w+gap
        return cx-gap-x
    def save(s,name): s.im.save(f"{OUTP}/{name}.png"); return s.im

DESC100=("«Entre Ruínas e Memórias» é um museu e exposição itinerante do Projecto Comunitário de Milreu. Reúne "
 "fotografias, testemunhos, histórias e outros registos ligados à forma como Milreu foi conhecido, vivido e "
 "recordado pela população. Aproxima património arqueológico, comunidade e participação pública, valorizando a "
 "memória local. Concebida para circular por espaços culturais, educativos e comunitários.")
IMG_NOTE="HUMAN GATE · NOT FOR DISTRIBUTION · redistribuição a confirmar"

# ---------------- FACT SHEET (A4) ----------------
def fact_sheet():
    W,H=1240,1754  # A4 @150dpi (210x297)
    mx=96; cw=W-2*mx; f=F(W,H,MARF)
    ih=int(H*0.26); f.imgcover(0,0,W,ih,IMG,av=0.42); f.rect(0,ih,W,5,RED)
    f.rect(0,ih-34,W,34,(24,20,18)); f.text(W-mx,ih-30,IMG_NOTE,"si",17,(236,230,222),"r")
    y=ih+40
    f.text(mx,y,"FACT SHEET · EXPOSIÇÃO ITINERANTE","sm",21,RED,"l",wt=500,ls=3); y+=34
    f.text(mx,y,"Entre Ruínas e Memórias","d",74,INK,"l",wt=600); y+=84
    y=f.para(mx,y,"Museu e exposição itinerante do Projecto Comunitário de Milreu","sm",27,cw,INK7,1.3)+14
    f.line(mx,y,W-mx,y,HAIR,1); y+=26
    f.text(mx,y,"O QUE É","sm",20,INK3,"l",wt=600,ls=2); y+=30
    y=f.para(mx,y,DESC100,"s",25,cw,INK7,1.5)+26
    f.text(mx,y,"ENQUADRAMENTO 2026","sm",20,INK3,"l",wt=600,ls=2); y+=30
    y=f.para(mx,y,"«Entre Ruínas e Memórias» e o Circuito Educativo integram as iniciativas de «Projecto Comunitário de Milreu / Museus sem Fronteiras» (apoio CCDR Algarve). Esta designação não substitui o nome permanente do projecto.","s",25,cw,INK7,1.5)+26
    # factos
    f.text(mx,y,"A EXPOSIÇÃO","sm",20,INK3,"l",wt=600,ls=2); y+=32
    for lab,val in [("Formato","12 painéis verticais · 841 × 1800 mm cada"),
                    ("Tipo","Exposição itinerante (circula por espaços de acolhimento)"),
                    ("Acolhimento local","variável · informação por local (ver cartaz / nota de imprensa)"),
                    ("Site","projectomilreu.pt")]:
        f.text(mx,y,lab,"sm",21,INK5,"l",wt=600); f.para(mx+270,y,val,"s",23,cw-270,INK7,1.3); y+=42
    y+=6; f.rect(mx,y,cw,2,HAIR); y+=20
    f.text(mx,y,"CONTACTOS","sm",20,INK3,"l",wt=600,ls=2); y+=30
    f.para(mx,y,"projectomilreu.pt · a78190@ualg.pt · fernando.jacomo@yahoo.com · 925 339 613","s",23,cw,INK7,1.35)
    # rodapé em DUAS linhas (QR em cima; logos a toda a largura em baixo) — sem colisão
    fy=H-296
    f.line(mx,fy,W-mx,fy,HAIR,1)
    qs=108; f.qr(W-mx-qs,fy+14,qs)
    f.text(mx,fy+20,"Conheça a exposição","d",30,INK,"l",wt=600)
    f.text(mx,fy+58,"projectomilreu.pt","sm",26,RED,"l",wt=600)
    f.line(mx,fy+138,W-mx,fy+138,HAIR,1)
    f.text(mx,fy+156,"Projecto Comunitário de Milreu","sm",24,INK7,"l",wt=600)
    f.text(mx,fy+190,"Apoio institucional e parcerias","sm",19,INK5,"l",wt=500,ls=1)
    f.logoband(mx,fy+214,54)
    f.text(mx,fy-32,"FASE 1 · preview para validação · dados não inventados (sem visitantes/duração/datas locais)","si",17,INK3,"l")
    f.save("09_fact_sheet_preview")

# ---------------- NOTA DE IMPRENSA (A4 preview) ----------------
def press_preview():
    W,H=1240,1754; mx=104; cw=W-2*mx; f=F(W,H,MARF)
    y=96
    f.text(mx,y,"NOTA DE IMPRENSA · BASE (editável)","sm",20,RED,"l",wt=500,ls=2); y+=34
    y=f.fitpara(mx,y,"«Entre Ruínas e Memórias» em [NOME_LOCAL], [CIDADE]","d",44,30,cw,2,INK,1.08,600)+16
    f.line(mx,y,W-mx,y,HAIR,1); y+=22
    def block(y,label,body,it=False):
        f.text(mx,y,label,"sm",18,INK3,"l",wt=600,ls=1.5); y+=26
        y=f.para(mx,y,body,"si" if it else "s",24,cw,INK7,1.5); return y+18
    y=block(y,"LEAD","A exposição itinerante «Entre Ruínas e Memórias» chega a [NOME_LOCAL], em [CIDADE], de [DATA_INICIO] a [DATA_FIM]. Reúne fotografias, testemunhos e histórias sobre a relação entre a população e as Ruínas Romanas de Milreu.")
    y=block(y,"O QUE É A EXPOSIÇÃO","Museu e exposição itinerante do Projecto Comunitário de Milreu. Reúne fotografias, testemunhos, histórias e outros registos ligados à forma como Milreu foi conhecido, vivido e recordado pela população.")
    y=block(y,"O PROJECTO","Iniciativa de Arqueologia Pública e Comunitária que aproxima património arqueológico, comunidade e participação pública, tornando visíveis as relações entre a população e as Ruínas Romanas de Milreu.")
    y=block(y,"ENQUADRAMENTO 2026","Em 2026, «Entre Ruínas e Memórias» e o Circuito Educativo integram as iniciativas de «Projecto Comunitário de Milreu / Museus sem Fronteiras» (apoio CCDR Algarve). Esta designação não substitui o nome permanente do projecto.")
    y=block(y,"CIRCULAÇÃO","Concebida para circular por museus, bibliotecas, escolas, universidades, associações, autarquias e outros espaços culturais. 12 painéis verticais (841 × 1800 mm).")
    # campos locais
    f.rect(mx,y,cw,2,HAIR); y+=18
    f.text(mx,y,"INFORMAÇÕES LOCAIS (campos editáveis)","sm",18,INK3,"l",wt=600,ls=1.5); y+=28
    for t in ["Local: [NOME_LOCAL]","Morada: [MORADA], [CIDADE]","Datas: [DATA_INICIO] — [DATA_FIM]","Horário: [HORARIO]","Contacto local: [CONTACTO_LOCAL]"]:
        f.rect(mx,y+5,8,24,RED); f.text(mx+22,y,t,"sm",23,INK7,"l",wt=500); y+=36
    y+=10; f.text(mx,y,"CONTACTOS · projectomilreu.pt · a78190@ualg.pt · fernando.jacomo@yahoo.com · 925 339 613","s",21,INK7,"l")
    f.text(mx,H-96,"CRÉDITOS: creditar cada foto (LEGENDAS_E_CREDITOS.csv). Uso editorial de imprensa: subconjunto aprovado (PRESS_EDITORIAL_USE); republicação por terceiros/anfitrião por asset.","si",18,INK5,"l")
    f.text(mx,H-60,"FASE 1 · preview do editável · não inventar datas/visitantes/duração/citações.","si",17,INK3,"l")
    f.save("09_nota_imprensa_preview")

# ---------------- SOCIAL (1080x1350) ----------------
def social_inst():
    W,H=1080,1350; f=F(W,H,INK); ih=int(H*0.56); f.imgcover(0,0,W,ih,IMG,av=0.4)
    f.rect(0,ih-44,W,44,(24,20,18)); f.text(W-60,ih-39,IMG_NOTE,"si",19,(236,230,222),"r")
    f.rect(0,ih,W,H-ih,INK); mx=72; y=ih+54
    f.text(mx,y,"EXPOSIÇÃO ITINERANTE","sm",26,(214,120,108),"l",wt=500,ls=4); y+=44
    f.text(mx,y,"Entre Ruínas","d",92,(248,244,238),"l",wt=600); y+=96
    f.text(mx,y,"e Memórias","d",92,(248,244,238),"l",wt=600); y+=120
    f.para(mx,y,"Museu e exposição itinerante do Projecto Comunitário de Milreu","sm",30,W-2*mx,(206,198,189),1.3)
    f.text(mx,H-96,"projectomilreu.pt","sm",34,(224,130,118),"l",wt=600)
    f.save("09_social_institucional_1080x1350")

def social_local():  # derivado do Item 8 (campos locais, EXEMPLO)
    W,H=1080,1350; f=F(W,H,MARF); ih=int(H*0.46); f.imgcover(0,0,W,ih,IMG,av=0.4); f.rect(0,ih,W,6,RED)
    f.rect(0,ih-40,W,40,(24,20,18)); f.text(W-60,ih-35,IMG_NOTE,"si",18,(236,230,222),"r")
    mx=72; y=ih+44
    f.text(mx,y,"EXPOSIÇÃO ITINERANTE","sm",24,RED,"l",wt=500,ls=3); y+=40
    f.text(mx,y,"Entre Ruínas e Memórias","d",60,INK,"l",wt=600); y+=74
    f.text(mx,y,"Casa das Artes","d",52,INK,"l",wt=600); y+=60
    f.text(mx,y,"Vila Exemplo · Algarve","sm",28,INK5,"l"); y+=52
    f.text(mx,y,"12 de Março — 27 de Abril de 2026","d",40,RED,"l",wt=600); y+=56
    f.text(mx,y,"Terça a domingo · 10h00 – 18h00","sm",28,INK7,"l"); y+=40
    f.text(mx,y,"Rua do Exemplo, 00 · Vila Exemplo","s",26,INK7,"l")
    # bloco ACOLHIMENTO (opcional): logo do anfitrião quando aplicável — separado dos parceiros
    hw=300; hx=W-72-hw; hhy=y+10
    f.text(hx,hhy,"ACOLHIMENTO","sm",20,INK3,"l",wt=600,ls=2)
    f.rect(hx,hhy+28,hw,96,MARF,outline=KEY,ow=2); f.rect(hx,hhy+28,6,96,RED)
    f.text(hx+hw/2,hhy+66,"[LOGÓTIPO DO ANFITRIÃO]","si",19,INK3,"m")
    qs=140; f.qr(mx,H-72-qs,qs); f.text(mx+qs+22,H-72-qs+18,"Conheça\na exposição","sm",24,INK,"l",wt=600)
    f.text(mx+qs+22,H-72-qs+86,"projectomilreu.pt","sm",26,RED,"l",wt=600)
    f.text(mx,H-44,"EXEMPLO · dados fictícios de demonstração","si",19,INK3,"l")
    f.save("09_social_local_1080x1350")

# ---------------- WEB HERO (horizontal) ----------------
def web_hero():
    W,H=1600,840; f=F(W,H,INK); f.imgcover(0,0,W,H,IMG608,av=0.4)
    # gradiente escuro à esquerda p/ legibilidade
    ov=Image.new("L",(W,H),0); dd=ImageDraw.Draw(ov)
    for x in range(W): dd.line([(x,0),(x,H)],fill=int(200*max(0,1-x/(W*0.62))))
    blk=Image.new("RGB",(W,H),(12,10,9)); f.im=Image.composite(blk,f.im,ov)
    f.rect(0,H-38,W,38,(20,17,15)); f.text(W-28,H-33,IMG_NOTE,"si",18,(236,230,222),"r")
    mx=84; y=150
    f.text(mx,y,"EXPOSIÇÃO ITINERANTE · PROJECTO COMUNITÁRIO DE MILREU","sm",24,(224,150,140),"l",wt=500,ls=3); y+=52
    f.text(mx,y,"Entre Ruínas e Memórias","d",96,(248,244,238),"l",wt=600); y+=120
    f.para(mx,y,"Fotografias, testemunhos e histórias sobre a relação entre a população e as Ruínas Romanas de Milreu.","s",30,int(W*0.52),(214,206,197),1.4)
    f.text(mx,H-96,"projectomilreu.pt","sm",32,(226,140,128),"l",wt=600)
    f.save("09_web_hero_1600x840")

fact_sheet(); press_preview(); social_inst(); social_local(); web_hero()
# prancha de conjunto
names=["09_fact_sheet_preview","09_nota_imprensa_preview","09_social_institucional_1080x1350","09_social_local_1080x1350","09_web_hero_1600x840"]
labs=["Fact Sheet (A4)","Nota de imprensa (A4)","Social institucional","Social local","Web hero"]
ims=[Image.open(f"{OUTP}/{n}.png") for n in names]; hh=900
sc=[im.resize((round(im.size[0]*hh/im.size[1]),hh)) for im in ims]
pad=26;Wc=sum(i.size[0] for i in sc)+pad*(len(sc)+1);Hc=hh+2*pad+34
sh=Image.new("RGB",(Wc,Hc),(238,232,222));d=ImageDraw.Draw(sh);x=pad
for lab,im in zip(labs,sc): sh.paste(im,(x,pad));d.text((x,pad+hh+8),lab,fill=(60,54,48),font=font("sm",20));x+=im.size[0]+pad
sh.save(f"{OUTP}/_PRANCHA_KIT.png")
print("ok:",", ".join(names))
