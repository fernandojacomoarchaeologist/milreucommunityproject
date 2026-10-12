#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Item 7 — Dossiê «convite ao convite» (A5, 4 páginas). FASE 1: previews P1-P4 + prancha.
DS Milreu (2 famílias: Fraunces + Spectral). Fotos reais autorizadas; sem IA. Dados canónicos travados.
Diagramas P3 vetoriais: ordenação frente/verso (estruturas de dupla face) em linha / ziguezague. Triangular: não é opção (2026-10-12)."""
import os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo_root(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
_REPO=_repo_root(HERE)
sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode
OUTP=os.path.join(HERE,"previews"); os.makedirs(OUTP,exist_ok=True)
AS5=os.path.join(HERE,"assets")  # acervo preparado (gap de versionamento — ver source/README)
MM608=os.path.join(_REPO,"public","media","museum","originals","MM202608.jpg")  # original museu (2680x1600) p/ herói P1
PD=os.path.join(_REPO,"docs","dissemination","_SOURCES_SHARED","assets","production-derivatives")  # FASE A2
MM601=os.path.join(PD,"MM202601_procissao.jpg")
MM603=os.path.join(PD,"MM202603_pessoas.jpg")
MM613=os.path.join(_REPO,"public","media","museum","originals","MM202613.png")  # repontado (byte-identico)
_GEN=os.path.join(_REPO,"public","media","museum","generated")
MM602=f"{_GEN}/MM202602/detail.webp"  # jovens no muro das ruínas (comunidade)
MM604=f"{_GEN}/MM202604/detail.webp"  # Ti' Jacinto (figura popular de Estoi)
MM610=f"{_GEN}/MM202610/detail.webp"  # poesia nas ruínas (relação vivida)
MM627=f"{_GEN}/MM202627/detail.webp"  # trabalhadores em descanso/convívio (sociabilidade; wide)
MM613g=f"{_GEN}/MM202613/detail.webp"  # equipa de escavadores com Theodor Hauschild (wide)
MM604c=os.path.join(HERE,"imagens","MM202604_crop.png")  # committed em editaveis/imagens
LOGODIR=os.path.join(_REPO,"public","media","exhibition","updated","logos")
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","logo-junta-freguesia-estoi.png","Milreu_policromatico.png","logo-ualg-completo.png"]
QURL="https://projectomilreu.pt"
FORMURL="https://projectomilreu.pt/#/participar/expor"  # formulário «Quero expor» (rota canónica do site)
MARF=(255,252,247); CAMPO=(251,246,238); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); BROWN=(98,70,45)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
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
# ---- backend SVG vetorial (aditivo; não altera o PIL) ----
import io as _io, base64 as _b64
FALLBACK={"d":"serif","di":"serif","s":"serif","sm":"serif","si":"serif","u":"sans-serif"}
def _c(col): return "rgb(%d,%d,%d)"%(col[0],col[1],col[2])
def _esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def _b64img(im,fmt="PNG",q=84):
    bb=_io.BytesIO()
    if fmt=="JPEG": im.convert("RGB").save(bb,"JPEG",quality=q)
    else: im.save(bb,"PNG")
    mt="jpeg" if fmt=="JPEG" else "png"
    return f"data:image/{mt};base64,"+_b64.b64encode(bb.getvalue()).decode()
class F:
    def __init__(s,W,H,bg=MARF):
        s.W=W;s.H=H;s.bg=bg;s.im=Image.new("RGB",(W,H),bg);s.d=ImageDraw.Draw(s.im);s.svg=[]
    def rect(s,x,y,w,h,fill,outline=None,ow=1):
        s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
        at=f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
        at+=(f'fill="{_c(fill)}"' if fill else 'fill="none"')
        if outline: at+=f' stroke="{_c(outline)}" stroke-width="{ow}"'
        s.svg.append(at+'/>')
    def line(s,x1,y1,x2,y2,fill,w=1):
        s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
        s.svg.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{_c(fill)}" stroke-width="{w}"/>')
    def ellipse(s,x0,y0,x1,y1,fill=None,outline=None,ow=1):
        s.d.ellipse([x0,y0,x1,y1],fill=fill,outline=outline,width=ow)
        cx=(x0+x1)/2;cy=(y0+y1)/2;rx=(x1-x0)/2;ry=(y1-y0)/2
        at=f'<ellipse cx="{cx:.2f}" cy="{cy:.2f}" rx="{rx:.2f}" ry="{ry:.2f}" '
        at+=(f'fill="{_c(fill)}"' if fill else 'fill="none"')
        if outline: at+=f' stroke="{_c(outline)}" stroke-width="{ow}"'
        s.svg.append(at+'/>')
    def imgcover(s,x,y,w,h,path,ah=0.5,av=0.5):
        im=Image.open(path).convert("RGB");iw,ih=im.size;k=max(w/iw,h/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k));im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-w)*ah);t=round((nh-h)*av);crop=im.crop((l,t,l+w,t+h));s.im.paste(crop,(x,y))
        s.svg.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="none" xlink:href="{_b64img(crop,"JPEG")}"/>')
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and len(t)>1 and a=="l":
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=s.d.textlength(ch,font=ft)+ls
        else: s.d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
        asc=ft.getmetrics()[0]; by=y+asc; anch={"l":"start","m":"middle","r":"end"}[a]
        style=' font-style="italic"' if k in("di","si") else ''
        wgt=wt if wt else (500 if k=="sm" else None); wstr=f' font-weight="{wgt}"' if wgt else ''
        lsstr=f' letter-spacing="{ls:.2f}"' if ls else ''
        s.svg.append(f'<text x="{x:.2f}" y="{by:.2f}" font-family="{FAM[k]},{FALLBACK[k]}" font-size="{px}" fill="{_c(fill)}" text-anchor="{anch}"{style}{wstr}{lsstr}>{_esc(t)}</text>')
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
    def qr(s,x,y,size,url=None):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0);q.add_data(url or QURL);q.make(fit=True)
        m=q.get_matrix();n=len(m);s.rect(x,y,size,size,MARF,outline=KEY,ow=max(1,size//180))
        qz=size*0.08;inner=size-2*qz;ms=inner/n
        for r in range(n):
            for c in range(n):
                if m[r][c]:
                    s.d.rectangle([x+qz+c*ms,y+qz+r*ms,x+qz+c*ms+ms+0.6,y+qz+r*ms+ms+0.6],fill=INK)
                    s.svg.append(f'<rect x="{x+qz+c*ms:.2f}" y="{y+qz+r*ms:.2f}" width="{ms+0.6:.2f}" height="{ms+0.6:.2f}" fill="{_c(INK)}"/>')
    def logo(s,cx,cy,maxw,maxh,path):
        im=Image.open(path).convert("RGBA");a=_np.asarray(im);al=a[:,:,3]
        mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
        ys,xs=_np.where(mask)
        if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
        iw,ih=im.size;ar=iw/ih;w=maxw;h=w/ar
        if h>maxh: h=maxh;w=h*ar
        im=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
        s.im.paste(im,(round(cx-w/2),round(cy-h/2)),im)
        s.svg.append(f'<image x="{cx-w/2:.2f}" y="{cy-h/2:.2f}" width="{w:.2f}" height="{h:.2f}" xlink:href="{_b64img(im)}"/>')
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
            s.im.paste(rim,(round(cx),round(y)),rim)
            s.svg.append(f'<image x="{cx:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" xlink:href="{_b64img(rim)}"/>')
            cx+=w+gap
        return cx-gap-x
    def save(s,name):
        s.im.save(f"{OUTP}/{name}.png")
        bg=f'<rect x="0" y="0" width="{s.W}" height="{s.H}" fill="{_c(s.bg)}"/>'
        svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
             f'width="{FW}mm" height="{FH}mm" viewBox="0 0 {s.W} {s.H}">{bg}{"".join(s.svg)}</svg>')
        open(f"{OUTP}/{name}.svg","w",encoding="utf-8").write(svg)
        return s.im

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
    elif kind in ("estr_223","estr_zig"):
        # Vista de topo (planta) das estruturas metálicas articuladas (biombo/acordeão).
        # Cada segmento = uma estrutura; vértice = articulação. 2+2+3 ou ziguezague de 7.
        import math
        groups=[2,2,3] if kind=="estr_223" else [7]
        ang=math.radians(34); pad2=P(3); awv=w-2*pad2
        nseg=sum(groups); ngap=len(groups)-1; gapw=awv*(0.16 if ngap else 0)
        L=(awv-ngap*gapw)/(nseg*math.cos(ang)); segh=L*math.sin(ang)
        availh=(h-2*pad2)*0.80
        if segh>availh: sc=availh/segh; L*=sc; segh*=sc
        totalw=nseg*L*math.cos(ang)+ngap*gapw
        cx=x+(w-totalw)/2; ymid=y+h/2; lw=max(2,round(P(0.9))); r=max(2,round(P(0.8)))
        for gc in groups:
            verts=[(cx+i*L*math.cos(ang), ymid+(segh/2)*(1 if i%2 else -1)) for i in range(gc+1)]
            for i in range(gc): f.line(verts[i][0],verts[i][1],verts[i+1][0],verts[i+1][1],INK5,lw)
            for (vx,vy) in verts: f.ellipse(vx-r,vy-r,vx+r,vy+r,fill=RED)
            cx+=gc*L*math.cos(ang)+gapw
    elif kind=="painel_apoio":
        # Esquema de painel com apoios/pés próprios (montagem autónoma).
        pad2=P(3); lw=max(2,round(P(0.9)))
        ph=(h-2*pad2)*0.62; pw=ph*PR; px=x+(w-pw)/2; py=y+pad2
        f.rect(px,py,pw,ph,MARF,outline=INK3,ow=lw)      # painel (contorno claro = conceptual)
        f.rect(px,py,pw,max(2,ph*0.06),RED)              # barra de topo
        baseY=py+ph
        f.line(px+pw*0.30,baseY,px+pw*0.02,baseY+P(5),INK5,lw)  # pé esquerdo
        f.line(px+pw*0.70,baseY,px+pw*0.98,baseY+P(5),INK5,lw)  # pé direito
        f.line(px-P(2),baseY+P(5),px+pw+P(2),baseY+P(5),KEY,1)  # linha de chão

# ============ P1 — CAPA ============
def p1():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    ih=round(Hp*0.66); f.imgcover(0,0,Wp,ih,MM608,av=0.55)
    f.rect(0,ih,Wp,P(1.4),RED)
    y=ih+P(12)
    eyebrow(f,mx,y,"MUSEU · EXPOSIÇÃO ITINERANTE"); y+=P(9)
    y=f.para(mx,y,"Entre Ruínas e Memórias","d",PT(30),cw,INK,1.02,"l",wt=600)+P(4)
    # tagline comunitária (Spectral itálico — fonte mantida), subida para o lugar da linha removida
    y=f.para(mx,y,"Memórias da população ligadas às Ruínas Romanas de Milreu.","si",PT(10.5),cw,INK5,1.3)+P(4)
    # atribuição + anotação MSF, no mesmo tamanho/fonte da linha acima (sem outra alteração)
    y=f.para(mx,y,"Projecto Comunitário de Milreu — Museus sem Fronteiras 2026","si",PT(10.5),cw,INK5,1.3)
    f.text(mx,Hp-bl-P(10),"projectomilreu.pt","sm",PT(10),RED,"l",wt=500)
    link("07_P1_capa",mx,Hp-bl-P(10),mx+f.tw("projectomilreu.pt","sm",PT(10),500),Hp-bl-P(10)+PT(10),QURL)
    f.save("07_P1_capa")

# ============ P2 — O PROJECTO E A EXPOSIÇÃO ============
def p2():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    # imagem DOMINANTE comunitária (pessoas, não arquitectura): jovens no muro das ruínas
    ih=round(Hp*0.25); f.imgcover(0,0,Wp,ih,MM602,av=0.25); f.rect(0,ih,Wp,P(1.2),RED)
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

# ===== P3 v2 — ordenação frente/verso (estruturas de dupla face; sem triangular) =====
FRENTE=["Q1","Q2","Q3","Q4","Q5","Q6"]; VERSO=["Q12","Q11","Q10","Q9","Q8","Q7"]
def _arrow(f,x1,y,x2,col,lw):
    f.line(x1,y,x2,y,col,lw); d=P(1.1); s=1 if x2>x1 else -1
    f.line(x2,y,x2-s*d,y-d*0.7,col,lw); f.line(x2,y,x2-s*d,y+d*0.7,col,lw)
def diagram_fv(f,x,y,w,h,kind):
    """Vista de topo: 6 estruturas de dupla face; frente Q1→Q6 (ida), verso Q7→Q12 (regresso)."""
    import math
    f.rect(x,y,w,h,MARF,outline=HAIR,ow=1)
    lw=max(2,round(P(1.0))); fs=PT(6.6); n=6; ym=y+h/2
    if kind=="linha":
        pad=P(5); seg=(w-2*pad)/n; bl_=seg*0.62
        mids=[]
        for i in range(n):
            cx=x+pad+seg*(i+0.5); f.line(cx-bl_/2,ym,cx+bl_/2,ym,INK5,lw); mids.append((cx,ym,0.0))
    else:  # ziguezague: estruturas associadas, articuladas nos vértices
        ang=math.radians(24); pad=P(5); L=(w-2*pad)/(n*math.cos(ang)); dy=L*math.sin(ang)/2
        vs=[(x+pad+i*L*math.cos(ang), ym+(dy if i%2 else -dy)) for i in range(n+1)]
        mids=[]
        for i in range(n):
            (ax,ay),(bx,by)=vs[i],vs[i+1]; f.line(ax,ay,bx,by,INK5,lw)
            mids.append(((ax+bx)/2,(ay+by)/2,0.0))
        r=max(2,round(P(0.7)))
        for (vx,vy) in vs: f.ellipse(vx-r,vy-r,vx+r,vy+r,fill=INK5)
    off=P(3.2) if kind=="linha" else P(3.2)+dy
    for i,(cx,cy,_) in enumerate(mids):
        f.text(cx,cy-off-fs,FRENTE[i],"sm",fs,RED,"m",wt=600)
        f.text(cx,cy+off*0.75,VERSO[i],"sm",fs,INK7,"m",wt=600)
    # setas de leitura: ida (frente, em cima) e regresso (verso, em baixo)
    ya=y+P(3.2); yb=y+h-P(3.2); x0=x+P(5); x1=x+w-P(5)
    _arrow(f,x0,ya,x1,RED,1); _arrow(f,x1,yb,x0,INK5,1)
    f.line(x1,ya,x1+P(1.6),ya,KEY,1); f.line(x1+P(1.6),ya,x1+P(1.6),yb,KEY,1); f.line(x1+P(1.6),yb,x1,yb,KEY,1)

def p3():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    y=bl+P(10)
    eyebrow(f,mx,y,"A EXPOSIÇÃO NO SEU ESPAÇO"); y+=P(7)
    y=f.para(mx,y,"12 painéis verticais · 841 × 1800 mm","d",PT(13),cw,INK,1.04,"l",wt=600)+P(0.5)
    y=f.para(mx,y,"PVC expandido, impressão em vinil laminado","si",PT(8.4),cw,INK5,1.3)+P(2)
    y=f.para(mx,y,"«Entre Ruínas e Memórias» é composta por 12 painéis individuais, montados em estruturas de dupla face: cada estrutura recebe um painel na frente e outro no verso.","s",PT(8),cw,INK7,1.34)+P(4)
    # ===== Bloco A — ORDENAÇÃO =====
    eyebrow(f,mx,y,"ORDENAÇÃO — FRENTE E VERSO"); y+=P(6)
    y=f.para(mx,y,"Seis estruturas recebem os 12 painéis. O percurso faz-se pela frente, de Q1 a Q6; contorna-se a última estrutura e regressa-se pelo verso, de Q7 a Q12. Abertura (Q1) e fecho (Q12) ficam na mesma estrutura, costas com costas.","s",PT(8),cw,INK7,1.34)+P(2.5)
    gap=P(6); dw=(cw-gap)/2; dh=P(30)
    for i,(kind,lab,leg) in enumerate([
        ("linha","Em linha — suportes próprios","Suportes isolados, espaçados conforme a circulação."),
        ("zig","Em ziguezague — estruturas AAMLF","Estruturas presas entre si; a ordem mantém-se.")]):
        dx=mx+i*(dw+gap)
        f.text(dx,y,lab,"sm",PT(8),INK,"l",wt=600)
        diagram_fv(f,dx,y+P(4.5),dw,dh,kind)
        yl=f.para(dx,y+P(4.5)+dh+P(1.5),leg,"s",PT(6.8),dw,INK7,1.22); ymax=max(ymax,yl) if i else yl
    y=ymax+P(2)
    f.text(mx,y,"Vista de topo · ","si",PT(6.6),INK5,"l"); xx=mx+f.tw("Vista de topo · ","si",PT(6.6))
    f.text(xx,y,"frente (ida)","si",PT(6.6),RED,"l"); xx+=f.tw("frente (ida)","si",PT(6.6))
    f.text(xx,y," · verso (regresso)","si",PT(6.6),INK5,"l"); y+=P(8)
    # ===== Bloco B — ESTRUTURAS =====
    eyebrow(f,mx,y,"ESTRUTURAS"); y+=P(6)
    for head,body in [
        ("Estruturas metálicas — AAMLF.","Sete estruturas de dupla face, presas entre si, mediante consulta à AAMLF sobre disponibilidade."),
        ("Suportes próprios.","Solução mais simples, também de dupla face, mediante apontamento.")]:
        f.rect(mx,y+P(1.0),P(1.3),P(1.3),RED)
        hw=f.tw(head+" ","sm",PT(7.8),500); f.text(mx+P(3.6),y,head,"sm",PT(7.8),INK,"l",wt=500)
        y=f.para(mx+P(3.6),y,(" "*0)+body,"s",PT(7.8),cw-P(3.6),INK7,1.3) if hw>cw*0.5 else _hang(f,mx+P(3.6),y,hw,body,cw-P(3.6))
        y+=P(2.2)
    y+=P(1.5)
    y=f.para(mx,y,"Em qualquer sistema, cada estrutura recebe apenas dois painéis e a ordem de leitura mantém-se. A configuração final é acordada com cada espaço anfitrião.","si",PT(7.8),cw,INK5,1.3)+P(3.5)
    # ===== Bloco C — AMBIENTE (sem fotografia: decisão 2026-10-12) =====
    eyebrow(f,mx,y,"AMBIENTE"); y+=P(6)
    y=f.para(mx,y,"A exposição destina-se a espaços interiores.","sm",PT(8),cw,INK,1.3,wt=500)+P(1)
    y=f.para(mx,y,"Em exterior, apenas por um período máximo de 4 horas e com o acompanhamento de um responsável do projecto.","s",PT(8),cw,INK7,1.3)+P(4)
    f.rect(mx,y,cw,P(0.6),HAIR); y+=P(4)
    eyebrow(f,mx,y,"O QUE PRECISAMOS DE SABER SOBRE O SEU ESPAÇO",INK7); y+=P(6)
    for it in ["espaço interior · dimensões / área disponível","condições de circulação e montagem","contacto da pessoa responsável"]:
        f.rect(mx,y+P(1.0),P(1.3),P(1.3),RED); f.text(mx+P(3.6),y,it,"s",PT(8.2),INK7,"l"); y+=P(5.4)
    print("P3 v2 bottom y (mm):",round(y/mm,1),"| limite safe:",round((Hp-bl-P(6))/mm,1))
    f.save("07_P3_espaco")

def _hang(f,x,y,hw,body,maxw):
    # primeira linha continua depois do cabeçalho; seguintes alinham à margem do item
    lines=f.wrap(body,"s",PT(7.8),maxw-hw); first=lines[0]
    f.text(x+hw,y,first,"s",PT(7.8),INK7,"l"); y+=round(PT(7.8)*1.3)
    rest=" ".join(lines[1:])
    if rest: y=f.para(x,y,rest,"s",PT(7.8),maxw,INK7,1.3)
    return y


# ============ P4 — CONVITE ============
def p4():
    f=newp(); mx=bl+P(11); cw=Wp-2*mx
    ih=round(Hp*0.12); f.imgcover(0,0,Wp,ih,MM601,av=0.35); f.rect(0,ih,Wp,P(1.3),RED)
    y=ih+P(8)
    y=f.para(mx,y,"Gostaria de receber «Entre Ruínas e Memórias» no seu espaço?","d",PT(15),cw,INK,1.06,"l",wt=600)+P(3)
    y=f.para(mx,y,"Receber a exposição é uma oportunidade para aproximar públicos do património arqueológico através de memórias, imagens e narrativas acessíveis. Pode interessar a museus, bibliotecas, escolas, universidades, associações, autarquias e outros espaços culturais que valorizem património, mediação, participação e território. Avaliamos em conjunto o espaço, a configuração possível e o período de acolhimento.","s",PT(8.4),cw,INK7,1.36)+P(3)
    # porque acolher — benefícios
    eyebrow(f,mx,y,"PORQUE ACOLHER"); y+=P(5.5)
    for b in ["aproxima património e comunidade","activa públicos escolares, culturais e locais",
              "valor educativo e de mediação cultural","adapta-se a diferentes espaços de acolhimento",
              "integra uma rede de parceiros e instituições"]:
        f.rect(mx,y+P(1.0),P(1.3),P(1.3),RED); f.text(mx+P(3.6),y,b,"s",PT(8.6),INK7,"l"); y+=P(3.8)
    y+=P(2.5)
    # ===== COMO PEDIR — encaminha para o formulário «Quero expor» do site (QR = formulário) =====
    qs=P(20); qx=Wp-mx-qs; qy=y-P(1); tcw=cw-qs-P(6)
    f.qr(qx,qy,qs,FORMURL); link("07_P4_convite",qx,qy,qx+qs,qy+qs,FORMURL)
    f.text(qx+qs/2,qy+qs+P(1.6),"Quero expor","sm",PT(7.2),RED,"m",wt=600)
    eyebrow(f,mx,y,"COMO PEDIR"); yt=y+P(5.5)
    yt=f.para(mx,yt,"Faça o pedido no site do projecto, na opção «Quero expor».","s",PT(8.4),tcw,INK7,1.34)+P(1.2)
    lt="projectomilreu.pt/#/participar/expor"
    f.text(mx,yt,lt,"sm",PT(8.6),RED,"l",wt=600)
    link("07_P4_convite",mx,yt,mx+f.tw(lt,"sm",PT(8.6),600),yt+PT(8.6),FORMURL); yt+=P(5)
    y=max(yt,qy+qs+P(4.2))
    # ===== CONTACTOS — responsável do projecto e AAMLF, lado a lado =====
    eyebrow(f,mx,y,"CONTACTOS"); y+=P(5.5)
    colw=(cw-P(6))/2; yc_end=y
    for ci,(nome,afil,itens) in enumerate([
        ("Fernando Rodrigues de Jácomo","Projecto Comunitário de Milreu",["a78190@ualg.pt","fernando.jacomo@yahoo.com","925 339 613"]),
        ("Meira Pinto","AAMLF",["museu.lyceu@aejdfaro.pt"])]):
        cx=mx+ci*(colw+P(6)); yc=y
        f.text(cx,yc,nome,"sm",PT(8.6),INK,"l",wt=600); yc+=P(3.9)
        yc=f.para(cx,yc,afil,"s",PT(7.2),colw,INK5,1.25)+P(1.2)
        for c in itens:
            f.text(cx,yc,c,"sm",PT(8.4),RED if "@" in c else INK,"l",wt=500)
            tgt=("tel:+351925339613" if c.replace(" ","").isdigit() else "mailto:"+c)
            link("07_P4_convite",cx,yc,cx+f.tw(c,"sm",PT(8.4),500),yc+PT(8.4),tgt); yc+=P(4.1)
        if ci==1: f.text(cx,yc,"Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro","s",PT(7.2),INK5,"l"); yc+=P(4.2)
        yc_end=max(yc_end,yc)
    y=yc_end+P(1.5)
    # ===== FICHA TÉCNICA — 3 colunas de peso igual (mesma ordem/papéis do Q12, Item 1) =====
    eyebrow(f,mx,y,"FICHA TÉCNICA"); y+=P(5.5)
    fw=(cw-2*P(5))/3; yf_end=y
    for ci,(rot,nome,afil) in enumerate([
        ("INVESTIGAÇÃO, DESIGN E PRODUÇÃO","Fernando Rodrigues de Jácomo",None),
        ("COORDENAÇÃO INSTITUCIONAL","Meira Pinto","Associação dos Amigos do Museu do Lyceu de Faro"),
        ("CURADORIA","Grupo de voluntários","do Projecto Comunitário de Milreu")]):
        cx=mx+ci*(fw+P(5)); yy=y
        yy=f.para(cx,yy,rot,"u",PT(5.6),fw,INK5,1.3)+P(0.8)
        yy=f.para(cx,yy,nome,"sm",PT(7.6),fw,INK,1.25,wt=600)
        if afil: yy=f.para(cx,yy,afil,"s",PT(7),fw,INK5,1.25)
        yf_end=max(yf_end,yy)
    y=yf_end+P(2.5)
    # linha editorial independente (secundária), antes do rodapé institucional
    y=f.para(mx,y,"«Entre Ruínas e Memórias» e o Circuito Educativo integram as iniciativas de 2026 apoiadas no âmbito de «Projecto Comunitário de Milreu / Museus sem Fronteiras».","si",PT(7),cw,INK5,1.28)
    # fecho editorial ANCORADO à safe-area inferior (logos nunca encostam ao corte); 4 níveis com respiro
    txt_bottom=y
    logo_h=P(5.5); sb=Hp-bl-P(6)             # safe-area: 6mm do corte
    logo_y=sb-logo_h
    sub_y=logo_y-P(3.5)
    idf_y=sub_y-P(4.5)
    sig_y=idf_y-P(4.5)
    rule_y=sig_y-P(4.2)
    # guarda: o rodapé nunca sobe sobre o texto de enquadramento (gap mínimo de 8mm)
    print('P4 txt_bottom mm',round(txt_bottom/mm,1),'| rule_y mm',round(rule_y/mm,1))
    if rule_y < txt_bottom+P(8):
        sh=(txt_bottom+P(8))-rule_y
        rule_y+=sh; sig_y+=sh; idf_y+=sh; sub_y+=sh; logo_y+=sh
    f.line(mx,rule_y,Wp-mx,rule_y,HAIR,1)
    f.text(mx,sig_y,"Projecto Comunitário de Milreu","s",PT(8.5),INK5,"l")
    f.text(mx,idf_y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",PT(4.8),INK5,"l",ls=PT(0.52))
    f.text(mx,sub_y,"Apoio institucional e parcerias","sm",PT(5.6),INK5,"l",wt=500,ls=PT(0.5))
    f.logoband(mx,logo_y,logo_h)
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
