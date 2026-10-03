#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Item 7 — Dossiê «convite ao convite» (A5, 4 páginas). FASE 1: previews P1-P4 + prancha.
DS Milreu (2 famílias: Fraunces + Spectral). Fotos reais autorizadas; sem IA. Dados canónicos travados.
Diagramas P3 vetoriais: linear / ziguezague / núcleos (12 painéis 841:1800)."""
import os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode
OUTP=os.path.join(HERE,"previews"); os.makedirs(OUTP,exist_ok=True)
AS5=os.path.join(HERE,"..","item5_build","assets")
MM608="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/museum/originals/MM202608.jpg"  # original museu (2680x1600) p/ herói P1
MM601=os.path.join(AS5,"MM202601-original.jpg")
MM603=os.path.join(AS5,"MM202603-original.jpg")
MM613="/Users/fernandojacomo/Desktop/Milreu community Project/docs/dissemination/poster-congresso/proof/assets/MM202613_hauschild.png"
_GEN="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/museum/generated"
MM602=f"{_GEN}/MM202602/detail.webp"  # jovens no muro das ruínas (comunidade)
MM604=f"{_GEN}/MM202604/detail.webp"  # Ti' Jacinto (figura popular de Estoi)
MM610=f"{_GEN}/MM202610/detail.webp"  # poesia nas ruínas (relação vivida)
MM627=f"{_GEN}/MM202627/detail.webp"  # trabalhadores em descanso/convívio (sociabilidade; wide)
MM613g=f"{_GEN}/MM202613/detail.webp"  # equipa de escavadores com Theodor Hauschild (wide)
MM604c=os.path.join(HERE,"assets_crop","MM202604_crop.png")  # Ti' Jacinto — recortado (sem moldura branca)
LOGODIR="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/exhibition/updated/logos"
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
QURL="https://projectomilreu.pt"
MARF=(255,252,247); CAMPO=(251,246,238); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); BROWN=(98,70,45)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf"}
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral"}
import numpy as _np
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k=="d":
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f
DPI=int(os.environ.get("ITEM7_DPI","150")); mm=DPI/25.4
def P(v): return round(v*mm)
def PT(v): return round(v*DPI/72)
LINKS={}  # page -> [(x0,y0,x1,y1,target)] em px (top-left), na resolução DPI atual, coords full-bleed
def link(page,x0,y0,x1,y1,target): LINKS.setdefault(page,[]).append((round(x0),round(y0),round(x1),round(y1),target))
class F:
    def __init__(s,W,H,bg=MARF): s.W=W;s.H=H;s.im=Image.new("RGB",(W,H),bg);s.d=ImageDraw.Draw(s.im)
    def rect(s,x,y,w,h,fill,outline=None,ow=1): s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
    def line(s,x1,y1,x2,y2,fill,w=1): s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
    def imgcover(s,x,y,w,h,path,ah=0.5,av=0.5):
        im=Image.open(path).convert("RGB");iw,ih=im.size;k=max(w/iw,h/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k));im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-w)*ah);t=round((nh-h)*av);s.im.paste(im.crop((l,t,l+w,t+h)),(x,y))
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
    def fit(s,x,y,t,k,maxpx,maxw,fill=INK,a="l",wt=None):
        px=maxpx
        while s.tw(t,k,px,wt)>maxw and px>8: px-=1
        s.text(x,y,t,k,px,fill,a,wt);return px
    def qr(s,x,y,size):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0);q.add_data(QURL);q.make(fit=True)
        m=q.get_matrix();n=len(m);s.rect(x,y,size,size,MARF,outline=KEY,ow=max(1,size//180))
        qz=size*0.08;inner=size-2*qz;ms=inner/n
        for r in range(n):
            for c in range(n):
                if m[r][c]: s.d.rectangle([x+qz+c*ms,y+qz+r*ms,x+qz+c*ms+ms+0.6,y+qz+r*ms+ms+0.6],fill=INK)
    def logo(s,cx,cy,maxw,maxh,path):
        im=Image.open(path).convert("RGBA");a=_np.asarray(im);al=a[:,:,3]
        mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
        ys,xs=_np.where(mask)
        if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
        iw,ih=im.size;ar=iw/ih;w=maxw;h=w/ar
        if h>maxh: h=maxh;w=h*ar
        im=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
        s.im.paste(im,(round(cx-w/2),round(cy-h/2)),im)
    def logoband(s,x,y,h):
        # barra canónica (5 unidades), alinhada à esquerda, gap = 0,6 x altura (proporção do trio)
        gap=0.6*h; cx=float(x)
        for fn in LOGOS_CANON:
            p=os.path.join(LOGODIR,fn)
            if not os.path.exists(p): continue
            im=Image.open(p).convert("RGBA");a=_np.asarray(im);al=a[:,:,3]
            mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
            ys,xs=_np.where(mask)
            if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
            w=h*im.size[0]/im.size[1]; rim=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
            s.im.paste(rim,(round(cx),round(y)),rim); cx+=w+gap
        return cx-gap-x
    def save(s,name): s.im.save(f"{OUTP}/{name}.png");return s.im

# ---- geometria base A5 + sangria ----
TW,TH=148,210; BL=3; FW,FH=TW+2*BL,TH+2*BL
Wp,Hp=P(FW),P(FH); bl=P(BL)
def newp(): return F(Wp,Hp,MARF)
def eyebrow(f,x,y,t,fill=RED): f.text(x,y,t,"sm",PT(8),fill,"l",wt=500,ls=PT(1.2))

# ===== diagrama de implantação (vetorial; 12 painéis 841:1800) =====
PR=841/1800.0
def panel(f,x,y,ph):
    pw=ph*PR; f.rect(x,y,pw,ph,CAMPO,outline=INK5,ow=1); f.rect(x,y,pw,max(2,ph*0.06),RED); return pw
def diagram(f,x,y,w,h,kind):
    f.rect(x,y,w,h,MARF,outline=HAIR,ow=1)
    pad=P(3); ax=x+pad; aw=w-2*pad; base=y+h-pad
    if kind=="linear":
        ph=h-2*pad-P(2.5); g=aw*0.018; pw=(aw-11*g)/12; ph=min(ph,pw/PR); pw=ph*PR
        total=12*pw+11*g; sx=x+(w-total)/2
        f.line(sx-P(2),base,sx+total+P(2),base,KEY,1)
        for i in range(12): panel(f,sx+i*(pw+g),base-ph,ph)
    elif kind=="zigzag":
        ph=(h-2*pad)*0.46; g=aw*0.015; pw=(aw-11*g)/12; ph=min(ph,pw/PR); pw=ph*PR
        total=12*pw+11*g; sx=x+(w-total)/2; hi=y+pad; lo=y+h-pad-ph; cys=[]
        for i in range(12):
            yy=hi if i%2==0 else lo; px=sx+i*(pw+g); panel(f,px,yy,ph); cys.append((px+pw/2,yy+ph/2))
        for i in range(11): f.line(cys[i][0],cys[i][1],cys[i+1][0],cys[i+1][1],KEY,1)
    elif kind=="nucleos": # 3 núcleos de 4
        ph=(h-2*pad)*0.5; g=aw*0.01; pw=ph*PR
        cl=4; cwi=cl*pw+(cl-1)*g
        cxs=[x+w*0.20, x+w*0.52, x+w*0.80]; cys=[y+pad+ph*0.1, y+h-pad-ph*1.05, y+pad+ph*0.4]
        for ci in range(3):
            cx0=cxs[ci]-cwi/2; cy0=cys[ci]
            for j in range(4): panel(f,cx0+j*(pw+g),cy0,ph)
    elif kind=="costas": # costas com costas: duas filas de 6, barras vermelhas em lados opostos
        ph=((h-2*pad-P(1.2))/2)*0.92; g=aw*0.02; pw=(aw-5*g)/6; ph=min(ph,pw/PR); pw=ph*PR
        total=6*pw+5*g; sx=x+(w-total)/2; midy=y+h/2; tb=max(2,ph*0.08)
        for i in range(6):
            px=sx+i*(pw+g)
            f.rect(px,midy-P(0.6)-ph,pw,ph,CAMPO,outline=INK5,ow=1); f.rect(px,midy-P(0.6)-ph,pw,tb,RED)      # fila cima (barra topo)
            f.rect(px,midy+P(0.6),pw,ph,CAMPO,outline=INK5,ow=1); f.rect(px,midy+P(0.6)+ph-tb,pw,tb,RED)        # fila baixo (barra base)
    else: # triangular / autoportante: 4 ilhas trianguladas (3 painéis cada, vista de topo)
        import math; ncl=4; cw2=aw/ncl; r=min(cw2,h-2*pad)*0.36; cyc=y+h/2
        for c in range(ncl):
            cxc=x+pad+cw2*(c+0.5)
            pts=[(cxc+r*math.sin(math.radians(a)), cyc-r*math.cos(math.radians(a))) for a in (0,120,240)]
            for k in range(3):
                x1,y1=pts[k]; x2,y2=pts[(k+1)%3]; f.line(x1,y1,x2,y2,INK5,max(1,round(P(0.6))))
            f.rect(cxc-P(0.7),cyc-P(0.7),P(1.4),P(1.4),RED)

# ============ P1 — CAPA ============
def p1():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    ih=round(Hp*0.66); f.imgcover(0,0,Wp,ih,MM608,av=0.55)
    f.rect(0,ih,Wp,P(1.4),RED)
    y=ih+P(12)
    eyebrow(f,mx,y,"MUSEU · EXPOSIÇÃO ITINERANTE"); y+=P(9)
    y=f.para(mx,y,"Entre Ruínas e Memórias","d",PT(30),cw,INK,1.02,"l",wt=600)+P(3)
    y=f.para(mx,y,"Museu e exposição itinerante do Projecto Comunitário de Milreu","sm",PT(10.5),cw,INK7,1.28)+P(4)
    y=f.para(mx,y,"Memórias da população ligadas às Ruínas Romanas de Milreu.","si",PT(10.5),cw,INK5,1.3)+P(8)
    f.text(mx,Hp-bl-P(10),"projectomilreu.pt","sm",PT(10),RED,"l",wt=500)
    link("07_P1_capa",mx,Hp-bl-P(10),mx+f.tw("projectomilreu.pt","sm",PT(10),500),Hp-bl-P(10)+PT(10),QURL)
    f.text(Wp-mx,Hp-bl-P(10),"Projecto Comunitário de Milreu","s",PT(8),INK5,"r")
    f.save("07_P1_capa")

# ============ P2 — O PROJECTO E A EXPOSIÇÃO ============
def p2():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    # imagem DOMINANTE comunitária (pessoas, não arquitectura): jovens no muro das ruínas
    ih=round(Hp*0.25); f.imgcover(0,0,Wp,ih,MM602,av=0.5); f.rect(0,ih,Wp,P(1.2),RED)
    y=ih+P(8.5)
    # 1) Projecto Comunitário de Milreu — o que é + como trabalha + importância da investigação
    eyebrow(f,mx,y,"PROJECTO COMUNITÁRIO DE MILREU"); y+=P(7)
    y=f.para(mx,y,"O Projecto Comunitário de Milreu é uma iniciativa de Arqueologia Pública e Comunitária que aproxima património arqueológico, comunidade e participação pública. Milreu não é apenas um sítio arqueológico: é também um lugar vivido, recordado e interpretado por diferentes públicos.","s",PT(8.6),cw,INK7,1.4)+P(2)
    y=f.para(mx,y,"Através de inquéritos, entrevistas, recolha de memórias, curadoria participativa e mediação, torna visíveis as relações entre a população e as Ruínas Romanas de Milreu — transformando escuta pública em iniciativas de memória, participação e acesso ao património.","s",PT(8.6),cw,INK7,1.4)+P(8)
    # 2) Entre Ruínas e Memórias — texto + 2 imagens secundárias (figura popular + relação vivida)
    eyebrow(f,mx,y,"ENTRE RUÍNAS E MEMÓRIAS"); y+=P(7)
    sw=cw*0.30; sx=Wp-mx-round(sw); iy=y-P(1)
    f.imgcover(sx,iy,round(sw),P(26),MM604c,av=0.45)  # 2.ª imagem: Ti' Jacinto recortado (sem moldura)
    f.imgcover(sx,iy+P(28),round(sw),P(26),MM613g,av=0.58)  # 3.ª imagem: equipa do Hauschild (wide)
    tw=cw-sw-P(6)
    yt=f.para(mx,y,"«Entre Ruínas e Memórias» nasce deste trabalho e reúne fotografias, testemunhos, histórias e outros registos ligados à forma como Milreu foi conhecido, vivido e recordado pela população. O museu preserva e torna acessíveis essas memórias, mostrando Milreu como património vivido, partilhado e socialmente significativo.","s",PT(8.6),tw,INK7,1.4)
    y=max(yt, iy+P(54))+P(8)
    # 3) Porque importa — statement de fecho
    eyebrow(f,mx,y,"PORQUE IMPORTA"); y+=P(7)
    y=f.para(mx,y,"A exposição valoriza a memória local, a participação pública e o acesso ao património, criando pontes entre investigação, comunidade e mediação cultural.","di",PT(9.5),cw,INK5,1.4)+P(4)
    f.line(mx,Hp-bl-P(10.5),Wp-mx,Hp-bl-P(10.5),HAIR,1)
    f.para(mx,Hp-bl-P(8),"Para conhecer mais sobre o projecto, os conteúdos do museu e a investigação associada, visite projectomilreu.pt.","si",PT(7.8),cw,INK5,1.26)
    f.save("07_P2_projecto")

# ============ P3 — A EXPOSIÇÃO NO ESPAÇO ============
def p3():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    y=bl+P(10)
    eyebrow(f,mx,y,"A EXPOSIÇÃO NO SEU ESPAÇO"); y+=P(7.5)
    y=f.para(mx,y,"12 painéis verticais, 841 × 1800 mm","d",PT(15),cw,INK,1.04,"l",wt=600)+P(2.5)
    y=f.para(mx,y,"A soma das larguras dos 12 painéis lado a lado é de 10,092 m lineares — não uma área mínima: a implantação depende do espaço, dos intervalos, da circulação e da montagem.","s",PT(8.2),cw,INK7,1.32)+P(5)
    eyebrow(f,mx,y,"EXEMPLOS POSSÍVEIS DE IMPLANTAÇÃO"); y+=P(6.5)
    dw=P(40); dh=P(17.5); tx=mx+dw+P(5); tw=Wp-mx-tx
    for kind,lab,desc in [("linear","Linear","Corredores, paredes extensas ou percursos sequenciais."),
                          ("zigzag","Percurso em ziguezague","Leitura progressiva em áreas mais abertas."),
                          ("nucleos","Por núcleos","Painéis distribuídos por diferentes zonas do espaço."),
                          ("costas","Costas com costas","Sequência dupla ou alinhamentos opostos, com leitura dos dois lados."),
                          ("triangular","Triangular / autoportante","Conjuntos triangulados que se sustentam, criando ilhas expositivas.")]:
        diagram(f,mx,y,dw,dh,kind)
        f.text(tx,y+P(1.5),lab,"sm",PT(9),INK,"l",wt=600)
        f.para(tx,y+P(6.5),desc,"s",PT(7.6),tw,INK7,1.26)
        y+=dh+P(3.2)
    y+=P(0.5)
    f.para(mx,y,"A implantação pode ser adaptada ao espaço anfitrião; estes são exemplos, não um formato obrigatório.","si",PT(8),cw,INK5,1.3); y+=P(9)
    f.rect(mx,y,cw,P(0.8),HAIR); y+=P(4.5)
    eyebrow(f,mx,y,"O QUE PRECISAMOS DE SABER SOBRE O SEU ESPAÇO",INK7); y+=P(6)
    for it in ["tipo de espaço","dimensões / áreas disponíveis","período pretendido","condições de montagem","contacto da pessoa responsável"]:
        f.rect(mx,y+P(1.1),P(1.3),P(1.3),RED); f.text(mx+P(3.6),y,it,"s",PT(8.4),INK7,"l"); y+=P(5.6)
    f.save("07_P3_espaco")

# ============ P4 — CONVITE ============
def p4():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    ih=round(Hp*0.20); f.imgcover(0,0,Wp,ih,MM601,av=0.35); f.rect(0,ih,Wp,P(1.3),RED)
    y=ih+P(9)
    y=f.para(mx,y,"Gostaria de receber «Entre Ruínas e Memórias» no seu espaço?","d",PT(15),cw,INK,1.06,"l",wt=600)+P(4.5)
    y=f.para(mx,y,"Receber a exposição é uma oportunidade para aproximar públicos do património arqueológico através de memórias, imagens e narrativas acessíveis. Pode interessar a museus, bibliotecas, escolas, universidades, associações, autarquias e outros espaços culturais que valorizem património, mediação, participação e território. Avaliamos em conjunto o espaço, a configuração possível e o período de acolhimento.","s",PT(8.4),cw,INK7,1.36)+P(8)
    # porque acolher — benefícios
    eyebrow(f,mx,y,"PORQUE ACOLHER"); y+=P(6.5)
    for b in ["aproxima património e comunidade","activa públicos escolares, culturais e locais",
              "valor educativo e de mediação cultural","adapta-se a diferentes espaços de acolhimento",
              "integra uma rede de parceiros e instituições"]:
        f.rect(mx,y+P(1.0),P(1.3),P(1.3),RED); f.text(mx+P(3.6),y,b,"s",PT(8.6),INK7,"l"); y+=P(5.6)
    y+=P(7)
    # contactos (esquerda) + QR (direita)
    qs=P(23); qx=Wp-mx-qs; qy=y-P(1)
    f.qr(qx,qy,qs); link("07_P4_convite",qx,qy,qx+qs,qy+qs,QURL)
    eyebrow(f,mx,y,"CONTACTOS"); yc=y+P(6.5)
    for c in ["a78190@ualg.pt","fernando.jacomo@yahoo.com","925 339 613"]:
        f.text(mx,yc,c,"sm",PT(9.2),INK,"l",wt=500)
        tgt=("tel:+351925339613" if c.replace(" ","").isdigit() else "mailto:"+c)
        link("07_P4_convite",mx,yc,mx+f.tw(c,"sm",PT(9.2),500),yc+PT(9.2),tgt); yc+=P(6.0)
    uw=f.tw("projectomilreu.pt","sm",PT(7.2),600)
    f.text(qx+qs/2,qy+qs+P(3.5),"projectomilreu.pt","sm",PT(7.2),RED,"m",wt=600)
    link("07_P4_convite",qx+qs/2-uw/2,qy+qs+P(3.5),qx+qs/2+uw/2,qy+qs+P(3.5)+PT(7.2),QURL)
    y=max(yc,qy+qs+P(6))+P(7.5)
    # parágrafo de parcerias (antes do rodapé institucional)
    y=f.para(mx,y,"Em 2026, «Entre Ruínas e Memórias» e o Circuito Educativo integram as iniciativas de «Projecto Comunitário de Milreu / Museus sem Fronteiras», apoiadas pela CCDR Algarve. Esta designação enquadra o ciclo de 2026 e não substitui a identidade permanente do projecto.","si",PT(7.8),cw,INK5,1.32)+P(7.5)
    # fecho editorial (fluxo): assinatura + identificador 2026 + subtítulo + barra canónica de logótipos
    f.line(mx,y,Wp-mx,y,HAIR,1); y+=P(6)
    f.text(mx,y,"Projecto Comunitário de Milreu","s",PT(8.5),INK5,"l"); y+=P(5)
    f.text(mx,y,"Museus sem Fronteiras · Iniciativas 2026","si",PT(7.2),INK5,"l"); y+=P(5)
    f.text(mx,y,"Apoio institucional e parcerias","sm",PT(5.6),INK5,"l",wt=500,ls=PT(0.5)); y+=P(3.5)
    f.logoband(mx,y,P(6.0))
    f.save("07_P4_convite")

p1();p2();p3();p4()
# prancha 4 páginas
names=["07_P1_capa","07_P2_projecto","07_P3_espaco","07_P4_convite"]
ims=[Image.open(f"{OUTP}/{n}.png") for n in names]
hh=1200; sc=[im.resize((round(im.size[0]*hh/im.size[1]),hh)) for im in ims]
pad=28;Wc=sum(i.size[0] for i in sc)+pad*(len(sc)+1);Hc=hh+2*pad+34
sheet=Image.new("RGB",(Wc,Hc),(238,232,222));d=ImageDraw.Draw(sheet);x=pad
labs=["P1 · Capa","P2 · O projecto e a exposição","P3 · A exposição no espaço","P4 · Convite ao acolhimento"]
for lab,im in zip(labs,sc): sheet.paste(im,(x,pad));d.text((x,pad+hh+8),lab,fill=(60,54,48),font=font("sm",20));x+=im.size[0]+pad
sheet.save(f"{OUTP}/_PRANCHA_dossie.png")
import json as _json
_json.dump({"dpi":DPI,"page_px":[Wp,Hp],"bleed_mm":BL,"trim_mm":[TW,TH],"links":LINKS},
           open(f"{OUTP}/_links.json","w"),ensure_ascii=False,indent=1)
print("ok:",", ".join(names),"| DPI",DPI,"| links:",{k:len(v) for k,v in LINKS.items()})
