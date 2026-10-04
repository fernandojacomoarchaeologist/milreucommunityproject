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
"""Item 5 v6 — Flyer A5 (F/V) + Marcador 55x200 (F/V). Direção BLOQUEADA (specs locked).
Design System Milreu. SVG editável (grupos nomeados, texto vivo, imagens ligadas, QR substituível) + PNG + PDF.
QR real -> https://projectomilreu.pt."""
import os,sys,re,subprocess
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,os.path.join(HERE,"..","pylibs")); sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode
OUT=HERE; ASS=os.path.join(HERE,"assets")
PD=_os.path.join(_REPO,"docs","dissemination","_SOURCES_SHARED","assets","production-derivatives")  # FASE A2
MARF="#FFFCF7"; CAMPO="#FBF6EE"; CAMPO2="#F4ECDD"; INK="#1E1A17"; INK7="#453D36"; INK5="#766D64"; INK3="#B5AA9B"
RED="#A83227"; KEY="#B0A491"; HAIR="#E6DCC9"
PTMM=0.3528  # mm por pt
FONTS={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
def fpath(c): return os.path.expanduser("~/Library/Fonts/"+FONTS[c])
def hexrgb(h,a=255): h=h.lstrip("#"); return (int(h[0:2],16),int(h[2:4],16),int(h[4:6],16),a)
_mc={}
def mfont(c,fpx):
    k=(c,fpx)
    if k not in _mc: _mc[k]=ImageFont.truetype(fpath(c),max(4,fpx))
    return _mc[k]
class Face:
    def __init__(s_,w,h,ppi=300):
        s_.w=w; s_.h=h; s_.ppi=ppi; s_.sc=ppi/25.4
        s_.cv=Image.new("RGBA",(round(w*s_.sc),round(h*s_.sc)),hexrgb(MARF))
        s_.defs=[]; s_.groups={}; s_.order=[]; s_._n=0; s_.words=0
    def g(s_,gid):
        if gid not in s_.groups: s_.groups[gid]=[]; s_.order.append(gid)
        return s_.groups[gid]
    def tw(s_,t,c,fpt):
        fpx=max(4,round(fpt*PTMM*s_.sc)); return mfont(c,fpx).getlength(t)/s_.sc
    def rect(s_,gid,x,y,w,h,fill,a=255,stroke=None,sw=0.4):
        st=f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        s_.g(gid).append(f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" fill="{fill}" fill-opacity="{a/255:.3f}"{st}/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); ImageDraw.Draw(ov).rectangle([x*s_.sc,y*s_.sc,(x+w)*s_.sc,(y+h)*s_.sc],fill=(None if fill=="none" else hexrgb(fill,a)),outline=(hexrgb(stroke) if stroke else None),width=max(1,round(sw*s_.sc))); s_.cv=Image.alpha_composite(s_.cv,ov)
    def line(s_,gid,x1,y1,x2,y2,st=KEY,sw=0.4,a=255):
        s_.g(gid).append(f'<line x1="{x1:.3f}" y1="{y1:.3f}" x2="{x2:.3f}" y2="{y2:.3f}" stroke="{st}" stroke-width="{sw}" stroke-opacity="{a/255:.3f}"/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); ImageDraw.Draw(ov).line([(x1*s_.sc,y1*s_.sc),(x2*s_.sc,y2*s_.sc)],fill=hexrgb(st,a),width=max(1,round(sw*s_.sc))); s_.cv=Image.alpha_composite(s_.cv,ov)
    def _cover(s_,path,wp,hp,av=0.5,ah=0.5):
        im=Image.open(path).convert("RGB"); iw,ih=im.size; k=max(wp/iw,hp/ih); nw,nh=max(1,round(iw*k)),max(1,round(ih*k)); im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-wp)*ah); t=round((nh-hp)*av); return im.crop((l,t,l+wp,t+hp))
    def img(s_,gid,x,y,w,h,path,href,av=0.5,ah=0.5,a=255):
        s_._n+=1; cid=f"clip{s_._n}"; pa={0.5:"xMidYMid",0.0:"xMidYMin",1.0:"xMidYMax"}.get(av,"xMidYMid")
        s_.defs.append(f'<clipPath id="{cid}"><rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"/></clipPath>')
        s_.g(gid).append(f'<image x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" href="{href}" preserveAspectRatio="{pa} slice" clip-path="url(#{cid})" opacity="{a/255:.3f}"/>')
        tile=s_._cover(path,round(w*s_.sc),round(h*s_.sc),av,ah).convert("RGBA")
        if a<255: tile.putalpha(a)
        s_.cv.alpha_composite(tile,(round(x*s_.sc),round(y*s_.sc)))
    def img_topfade(s_,gid,x,y,w,h,path,href,fadeh,av=0.5,ah=0.5):
        s_._n+=1; cid=f"clip{s_._n}"; mid=f"mask{s_._n}"; gid2=f"grad{s_._n}"
        s_.defs.append(f'<clipPath id="{cid}"><rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"/></clipPath>')
        s_.defs.append(f'<linearGradient id="{gid2}" x1="0" y1="{y:.2f}" x2="0" y2="{y+fadeh:.2f}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white" stop-opacity="1"/></linearGradient>')
        s_.defs.append(f'<mask id="{mid}"><rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{fadeh:.2f}" fill="url(#{gid2})"/><rect x="{x:.2f}" y="{y+fadeh:.2f}" width="{w:.2f}" height="{h-fadeh:.2f}" fill="white"/></mask>')
        s_.g(gid).append(f'<image x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" href="{href}" preserveAspectRatio="xMidYMid slice" clip-path="url(#{cid})" mask="url(#{mid})"/>')
        tile=s_._cover(path,round(w*s_.sc),round(h*s_.sc),av,ah).convert("RGBA")
        fpx=max(1,round(fadeh*s_.sc)); aa=Image.new("L",tile.size,255); dd=ImageDraw.Draw(aa)
        for i in range(min(fpx,tile.size[1])): dd.line([(0,i),(tile.size[0],i)],fill=int(255*i/fpx))
        tile.putalpha(aa); s_.cv.alpha_composite(tile,(round(x*s_.sc),round(y*s_.sc)))
    def logo(s_,gid,cx,cy,mw,mh,path):
        im=Image.open(path).convert("RGBA"); iw,ih=im.size; ar=iw/ih; w=mw; h=w/ar
        if h>mh: h=mh; w=h*ar
        x=cx-w/2; y=cy-h/2
        s_.g(gid).append(f'<image x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" href="assets/{os.path.basename(path)}"/>')
        s_.cv.alpha_composite(im.resize((max(1,round(w*s_.sc)),max(1,round(h*s_.sc))),Image.LANCZOS),(round(x*s_.sc),round(y*s_.sc)))
        return w
    def text(s_,gid,x,y,t,c,fpt,fill=INK,a="start",ls=None,wt=None,count=True):
        e=""
        if ls: e+=f' letter-spacing="{ls}"'
        if c in("di","si"): e+=' font-style="italic"'
        if wt: e+=f' font-weight="{wt}"'
        if c=="sm": e+=' font-weight="500"'
        s_.g(gid).append(f'<text x="{x:.3f}" y="{y:.3f}" font-family="{FAM[c]},serif" font-size="{fpt*PTMM:.3f}" fill="{fill}" text-anchor="{a}"{e}>{t.replace("&","&amp;").replace("<","&lt;")}</text>')
        fpx=max(4,round(fpt*PTMM*s_.sc)); ft=mfont(c,fpx); col=hexrgb(fill); ha={"start":"l","middle":"m","end":"r"}[a]
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); dd=ImageDraw.Draw(ov)
        if ls:
            lsp=ls*s_.sc; ch=list(t); ws=[ft.getlength(k) for k in ch]; tot=sum(ws)+lsp*(len(ch)-1); cx=x*s_.sc if a=="start" else (x*s_.sc-tot/2 if a=="middle" else x*s_.sc-tot)
            for k,w in zip(ch,ws): dd.text((cx,y*s_.sc),k,font=ft,fill=col,anchor="ls"); cx+=w+lsp
        else: dd.text((x*s_.sc,y*s_.sc),t,font=ft,fill=col,anchor=ha+"s")
        s_.cv=Image.alpha_composite(s_.cv,ov)
        if count and t.strip(): s_.words+=len([w for w in re.split(r"\s+",t.strip()) if w])
    def wrap(s_,t,c,fpt,maxw):
        out=[]
        for pg in t.split("\n"):
            ln=""
            for w in pg.split():
                tr=(ln+" "+w).strip()
                if s_.tw(tr,c,fpt)<=maxw or not ln: ln=tr
                else: out.append(ln); ln=w
            out.append(ln)
        return out
    def para(s_,gid,x,y,t,c,fpt,lh,maxw,fill=INK,a="start",wt=None):
        yy=y
        for ln in s_.wrap(t,c,fpt,maxw): s_.text(gid,x,yy,ln,c,fpt,fill,a,wt=wt); yy+=lh
        return yy
    def qr(s_,gid,x,y,size,url="https://projectomilreu.pt",quiet=True):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0); q.add_data(url); q.make(fit=True)
        m=q.get_matrix(); n=len(m)
        qz=size*0.10 if quiet else 0
        inner=size-2*qz; ms=inner/n; x0=x+qz; y0=y+qz
        s_.rect(gid,x,y,size,size,MARF,stroke=KEY,sw=0.4)
        for r in range(n):
            for cc in range(n):
                if m[r][cc]: s_.rect(gid,x0+cc*ms,y0+r*ms,ms+0.02,ms+0.02,INK)
    def save(s_,name):
        body="".join(f'<g id="{g}">'+"".join(s_.groups[g])+"</g>" for g in s_.order)
        svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
             f'width="{s_.w}mm" height="{s_.h}mm" viewBox="0 0 {s_.w} {s_.h}"><defs>{"".join(s_.defs)}</defs>{body}</svg>')
        open(f"{OUT}/{name}.svg","w").write(svg)
        s_.cv.convert("RGB").save(f"{OUT}/{name}.png")

LOGODIR=_os.path.join(_REPO,"public","media","exhibition","updated","logos")
def L(fn): return os.path.join(LOGODIR,fn)
import numpy as _np, io as _io, base64 as _b64
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
def _trim(p):
    im=Image.open(p).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im
def _place_row(face,gid,cx,y,fns,h):
    # fila de logótipos centrada em cx, à altura y, gap 0,6 x altura
    gap=0.6*h; sc=face.sc; items=[]
    for fn in fns:
        p=L(fn)
        if not os.path.exists(p): continue
        im=_trim(p); w=h*im.size[0]/im.size[1]; items.append((im,w))
    if not items: return
    tot=sum(w for _,w in items)+gap*(len(items)-1); x=cx-tot/2
    for im,w in items:
        face.cv.alpha_composite(im.resize((max(1,round(w*sc)),max(1,round(h*sc))),Image.LANCZOS),(round(x*sc),round(y*sc)))
        bb=_io.BytesIO(); im.save(bb,"PNG"); d=_b64.b64encode(bb.getvalue()).decode()
        face.g(gid).append(f'<image x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" href="data:image/png;base64,{d}"/>')
        x+=w+gap
def logo_band(face,gid,x,y,maxw,h):
    # fila canónica, alinhada à esquerda, gap = 0,6 x altura (proporção do trio)
    gap=0.6*h; sc=face.sc; cx=x
    for fn in LOGOS_CANON:
        p=L(fn)
        if not os.path.exists(p): continue
        im=_trim(p); w=h*im.size[0]/im.size[1]
        face.cv.alpha_composite(im.resize((max(1,round(w*sc)),max(1,round(h*sc))),Image.LANCZOS),(round(cx*sc),round(y*sc)))
        bb=_io.BytesIO(); im.save(bb,"PNG"); d=_b64.b64encode(bb.getvalue()).decode()
        face.g(gid).append(f'<image x="{cx:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" href="data:image/png;base64,{d}"/>')
        cx+=w+gap
    return cx
A608="assets/MM202608.png"; P608=f"{PD}/MM202608_contexto.png"
A601="assets/MM202601-original.jpg"; P601=f"{PD}/MM202601_procissao.jpg"
A603="assets/MM202603-original.jpg"; P603=f"{PD}/MM202603_pessoas.jpg"

# =================== FLYER A5 ===================
BL=3.0; TW,TH=148.0,210.0; FW,FH=TW+2*BL,TH+2*BL  # canvas c/ bleed
MX=BL+13.0  # margem óptica a partir do bleed (13mm do trim)
CWF=FW-2*MX
def zy(p): return BL+p/100.0*TH  # y de % da altura do trim

A608nb="assets/MM202608_nb.png"; P608nb=f"{PD}/MM202608_nb.png"
A608h="assets/MM202608_hero.png"; P608h=f"{PD}/MM202608_hero.png"  # herói sem céu vazio no topo (sangra conteúdo)
GS,GM,GL=4.0,7.5,11.0  # ritmo vertical: curto / médio / maior

# ---- FLYER FRENTE ----
f=Face(FW,FH)
f.rect("01_background",0,0,FW,FH,MARF)
# ZONA 1 — herói ruína (sem céu vazio no topo: conteúdo sangra topo/lados), mostra homem+bicicleta
iz=zy(44)
f.img("02_primary_photo",0,0,FW,iz,P608h,A608h,av=0.55,ah=0.5)
# ZONA 2 — identidade + texto: eixo único (MX) e ritmo vertical consistente
y=iz+8
f.text("05_institutional_eyebrow",MX,y,"MUSEU · PROJECTO COMUNITÁRIO DE MILREU","u",8.6,RED,ls=0.4,wt=600)
y+=8.5                     # eyebrow -> título: curto
f.text("06_museum_title",MX,y,"Entre Ruínas","d",24,INK,wt=600); y+=8.4
f.text("06_museum_title",MX,y,"e Memórias","d",24,INK,wt=600)
y+=GM+1.5                  # título -> descrição: médio
y=f.para("07_museum_descriptor",MX,y,"Um museu de memórias sobre as relações entre a população e as Ruínas Romanas de Milreu.","sm",11.5,11.5*PTMM*1.28,CWF*0.95,INK7)
y+=GM                      # descrição -> corpo: médio
y=f.para("08_body_copy",MX,y,"Fotografias, testemunhos e histórias revelam diferentes formas de conhecer, recordar e viver Milreu.","s",9.3,9.3*PTMM*1.46,CWF,INK)
y+=1.0                     # parágrafo -> parágrafo: mesmo bloco (intervalo mínimo)
y=f.para("08_body_copy",MX,y,"No site pode explorar o museu e acompanhar os conteúdos do projecto.","s",9.3,9.3*PTMM*1.46,CWF,INK7)
# ZONA 3 — acção: CTA + URL = um bloco + QR par; sobe (centrado no espaço restante, não colado ao fundo)
qsz=22.0; qx=FW-MX-qsz; blkH=27.0
ay=y+max(GM, (FH-BL-y-blkH)/2)
f.line("09_programme_cta",MX,ay,FW-MX,ay,KEY,0.5)
f.qr("11_qr",qx,ay+5,qsz)
cy=ay+9
f.text("09_programme_cta",MX,cy,"Conheça o museu","sm",13.5,INK,wt=600)
f.text("09_programme_cta",MX,cy+7.6,"Aceda ao site","sm",13.5,INK,wt=600)
f.text("10_url",MX,cy+15.4,"projectomilreu.pt","u",11.5,RED,wt=600)
f.save("flyer_a5_front_editable")
print("FLYER FRENTE palavras:",f.words)

# ---- FLYER VERSO ----
b=Face(FW,FH)
b.rect("01_background",0,0,FW,FH,MARF)
# ZONA 1 — título + subtítulo (largura total)
y=zy(0)+12
y=b.para("06_museum_title",MX,y,"Um museu feito de relações, memórias e património","d",15,15*PTMM*1.07,CWF,INK,wt=600); y+=1.5
y=b.para("07_museum_descriptor",MX,y,"Milreu visto também por quem vive, recorda e convive com as ruínas.","si",10.5,10.5*PTMM*1.2,CWF,INK7); y+=GM
b.line("04_masks",MX,y,FW-MX,y,KEY,0.5); y+=GS+1
# ZONA 2 — "O que é" (texto, coluna mais larga) + Festa da Pinha (~14% menor)
colT=y; Rw=34.0; Rx=FW-MX-Rw; Lw=Rx-MX-8
b.text("05_institutional_eyebrow",MX,colT,"O que é «Entre Ruínas e Memórias»?","d",12.5,INK,wt=600)
yq=b.para("08_body_copy",MX,colT+8,"«Entre Ruínas e Memórias» reúne fotografias, testemunhos, histórias e outros registos ligados às relações entre a população e as Ruínas Romanas de Milreu. O museu procura preservar e tornar acessíveis essas memórias, aproximando património arqueológico, experiência quotidiana e comunidade.","s",8.8,8.8*PTMM*1.38,Lw,INK)
yq=b.para("08_body_copy",MX,yq+2.5,"Mais do que contar a história das ruínas, mostra também como Milreu foi visto, vivido e recordado ao longo do tempo.","s",8.8,8.8*PTMM*1.38,Lw,INK7)
ih1=min(52.0, yq-colT-2)
b.img("02_primary_photo",Rx,colT,Rw,ih1,P601,A601,av=0.22)
b.text("02_primary_photo",Rx,colT+ih1+3.5,"Festa da Pinha · 1909","si",6.6,INK5)
yb=max(yq, colT+ih1+7)+GS-1
# ZONA 3 — No site: 3 blocos editoriais (título em cima, descrição pequena em baixo)
b.line("04_masks",MX,yb,FW-MX,yb,KEY,0.5); yb+=6
b.text("05_institutional_eyebrow",MX,yb,"No site","d",12.5,INK,wt=600); yb+=7
nsite=[("Museu","Fotografias, testemunhos e histórias."),
       ("Exposição itinerante","Informação sobre circulação e acolhimento."),
       ("Projecto","Materiais e iniciativas do Projecto Comunitário de Milreu.")]
for t_,d_ in nsite:
    b.rect("09_programme_cta",MX,yb-3,1.3,4.8,RED)
    b.text("09_programme_cta",MX+5,yb,t_,"sm",9.4,INK,wt=600)
    b.text("09_programme_cta",MX+5,yb+5,d_,"s",8.2,INK7)
    yb+=9.0
yb+=0.5
# ZONA 4 — Quer acolher (texto) + MM202603 (imagem menor)
b.line("04_masks",MX,yb,FW-MX,yb,KEY,0.5); yb+=4
S3w=39.0; S3x=FW-MX-S3w; Lw2=S3x-MX-8
b.text("05_institutional_eyebrow",MX,yb,"Quer acolher a exposição?","d",12.5,INK,wt=600)
b.para("08_body_copy",MX,yb+7.5,"O museu ganha também forma numa exposição itinerante, pensada para circular por espaços culturais, educativos e comunitários. Consulte a informação actualizada no site.","s",8.3,8.3*PTMM*1.34,Lw2,INK7)
ih2=20.0
b.img("03_secondary_photo",S3x,yb+1,S3w,ih2,P603,A603,av=0.3)
b.text("03_secondary_photo",S3x,yb+1+ih2+3.4,"Achados romanos · 1966-67","si",6.4,INK5)
# ZONA 5 — Fecho recomposto: acção (URL+QR) + rodapé institucional (assinatura + subtítulo + logótipos)
pt=zy(78)
b.rect("01_background",0,pt,FW,FH-pt,CAMPO)
# acção (URL + QR) no topo da faixa; rodapé institucional bem separado por baixo
qsz2=15.0; qx2=FW-MX-qsz2; qy2=pt+3
b.qr("07_qr",qx2,qy2,qsz2)
b.text("10_url",MX,pt+5,"projectomilreu.pt","u",12.5,RED,wt=600)
# rodapé institucional — 4 níveis com respiro perceptível (identificador = Archivo maiúsculas, bloco editorial secundário)
bandh=6.0; band_y=FH-BL-5.0-bandh
sub_base=band_y-4.2; idf_base=sub_base-4.2; sig_base=idf_base-4.2; rule_y=sig_base-4.4
b.line("11_rule",MX,rule_y,qx2-4,rule_y,HAIR,0.3)
b.text("11_sig",MX,sig_base,"Projecto Comunitário de Milreu","u",7.8,INK5,wt=600)
b.text("11b_identifier",MX,idf_base,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",5.4,INK5,ls=0.6,wt=500)
b.text("12_support_head",MX,sub_base,"Apoio institucional e parcerias","u",5.8,INK5,ls=0.2,wt=600)
logo_band(b,"13_logos",MX,band_y,CWF,bandh)
b.save("flyer_a5_back_editable")
print("FLYER VERSO palavras:",b.words)

# =================== MARCADOR 55x200 ===================
bw,bh=55.0,200.0; MW,MH=bw+2*BL,bh+2*BL; SM=BL+5.0; CWB=MW-2*SM
def byf(p): return BL+p/100.0*bh

# ---- MARCADOR FRENTE ----
m=Face(MW,MH)
m.rect("01_background",0,0,MW,MH,CAMPO)
# ZONA A — herói vertical: SOMENTE a ruína (conteúdo sangra ao topo; ruína + homem + bicicleta)
za=byf(66)+BL
m.img("02_photo",0,0,MW,za,P608h,A608h,av=0.5,ah=0.40)
# ZONA B — identidade: bloco coeso, centrado (título↔descrição↔assinatura mais próximos)
m.rect("01_background",0,za,MW,MH-za,CAMPO)
y=za+15
m.text("04_museum_title",SM,y,"MUSEU · MILREU","u",8.2,RED,ls=0.4,wt=600); y+=8
m.text("04_museum_title",SM,y,"Entre Ruínas","d",20,INK,wt=600); y+=7.6
m.text("04_museum_title",SM,y,"e Memórias","d",20,INK,wt=600); y+=6.5
y=m.para("05_descriptor",SM,y,"Memórias da população ligadas às Ruínas Romanas de Milreu.","s",9.2,9.2*PTMM*1.28,CWB,INK7)
y+=3
m.text("09_signature",SM,y,"Projecto Comunitário de Milreu","u",8.0,INK5,wt=600)
m.save("bookmark_front_editable")
print("MARCADOR FRENTE ok")

# ---- MARCADOR VERSO ----
mv=Face(MW,MH)
mv.rect("01_background",0,0,MW,MH,MARF)
# ZONA 1 — CTA (topo)
y=byf(0)+13
tt=18.0
while mv.tw("Leve Milreu","d",tt)>CWB and tt>13: tt-=0.5
mv.text("06_cta",SM,y,"Leve Milreu","d",tt,INK,wt=600); y+=tt*PTMM+1.4
mv.text("06_cta",SM,y,"consigo.","d",tt,INK,wt=600); y+=tt*PTMM+3.2
mv.para("06_cta",SM,y,"Conheça o museu, descubra as histórias e consulte a programação.","s",9.2,9.2*PTMM*1.3,CWB,INK7)
# ZONA 2 — QR + URL (bloco único, mais próximo do texto inicial)
qzt=byf(25); qsz=CWB*0.60; qx=(MW-qsz)/2; qy=qzt
mv.qr("07_qr",qx,qy,qsz)
mv.text("08_url",MW/2,qy+qsz+5,"projectomilreu.pt","u",10.0,RED,"middle",wt=600)
# ZONA 3 — imagem (dominante no verso, mas secundária face à frente) + rodapé institucional recomposto
iy=byf(46); imb=byf(76)-iy  # foto inferior ligeiramente mais curta para dar faixa institucional respirada
mv.rect("05_descriptor",0,iy-6.5,MW,6.5,CAMPO2)
cap="Fotografias · testemunhos · memórias · exposição itinerante"
cf=6.6
while mv.tw(cap,"u",cf)>MW-8 and cf>4.2: cf-=0.2
mv.text("05_descriptor",MW/2,iy-1.9,cap,"u",cf,INK7,"middle")
mv.img("03_secondary_photo",0,iy,MW,imb,P603,A603,av=0.32)
sby=iy+imb
mv.rect("09_signature",0,sby,MW,MH-sby,CAMPO)
# rodapé institucional recomposto: filete + assinatura + subtítulo + versão CONDENSADA (2 filas) dos logótipos
mv.line("11_rule",SM,sby+4.5,MW-SM,sby+4.5,HAIR,0.3)
mv.text("09_signature",MW/2,sby+10.5,"Projecto Comunitário de Milreu","u",7.6,INK5,"middle",wt=600)
mv.text("09b_identifier",MW/2,sby+15.5,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",4.6,INK5,"middle",ls=0.4,wt=500)
mv.text("12_support_head",MW/2,sby+20.5,"Apoio institucional e parcerias","u",5.2,INK5,"middle",ls=0.2,wt=600)
_place_row(mv,"13_logos",MW/2,sby+24.5,["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","logo-ualg-completo.png"],4.2)
_place_row(mv,"13_logos",MW/2,sby+32.0,["Milreu_policromatico.png"],5.0)
mv.save("bookmark_back_editable")
print("MARCADOR VERSO ok")
print("DONE")
