# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA (portada p/ caminhos relativos ao repositório).
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Item 4 — PROVA VISUAL do poster (1ª aplicação do DS; NÃO master/print).
GATE D estrutural PASS + 10 ajustes: sem boxes/IDs; Museu reequilibrado; Circuito com
hierarquia 1 principal + 2 secundárias (placeholders c/ crédito, imagens só após Asset Map);
Desenvolvimento 2026 = faixa única; cabeçalho limpo; Fraunces/Spectral/Archivo do DS.
Tamanhos em pt do DS (A0): título ~90 · iniciativas ~42 · subtítulos ~28 · corpo ~22 · legendas ~15."""
import os,sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,os.path.join(HERE,"..","pylibs"))
from PIL import Image, ImageDraw, ImageFont
ASSETDIR=_os.path.join(_os.path.dirname(__file__),"..","assets")  # gap de versionamento (ver source/README)
OUT=_os.path.join(_os.path.dirname(__file__),"out")
AW,AH=841.0,1189.0; M=48.0; CW=AW-2*M
PPI=float(os.environ.get("PPI","120")); s=PPI/25.4; Wpx,Hpx=round(AW*s),round(AH*s)
PT=1/2.835  # pt -> mm
MARF="#FFFCF7"; CAMPO="#FBF6EE"; INK="#1E1A17"; INK7="#453D36"; INK5="#766D64"; INK3="#B5AA9B"
RED="#A83227"; KEY="#B0A491"; HAIR="#E6DCC9"; PLACE="#EFE7D8"; PLACLN="#C7B9A2"; GREEN="#40544A"; BROWN="#62462D"
FONTS={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
def fpath(c): return os.path.expanduser("~/Library/Fonts/"+FONTS[c])
def hexrgb(h,a=255): h=h.lstrip("#"); return (int(h[0:2],16),int(h[2:4],16),int(h[4:6],16),a)
_mc={}
def mfont(c,fs):
    k=(c,round(fs*4))
    if k not in _mc: _mc[k]=ImageFont.truetype(fpath(c),max(4,int(fs*4)))
    return _mc[k]
def tw(t,c,fs): return mfont(c,fs).getlength(t)/4.0
class C:
    def __init__(s_):
        s_.cv=Image.new("RGBA",(Wpx,Hpx),hexrgb(MARF)); s_.defs=[]; s_.groups={}; s_.order=[]; s_._f={}; s_._n=0; s_.imgs=[]; s_.txts=[]
    def pf(s_,c,fpx,wt=None):
        k=(c,fpx,wt)
        if k in s_._f: return s_._f[k]
        ft=ImageFont.truetype(fpath(c),fpx)
        if wt and c in("u","d"):
            try: ft.set_variation_by_name({500:"Medium",600:"SemiBold",700:"Bold"}.get(wt,"SemiBold"))
            except Exception: pass
        s_._f[k]=ft; return ft
    def g(s_,gid):
        if gid not in s_.groups: s_.groups[gid]=[]; s_.order.append(gid)
        return s_.groups[gid]
    def rect(s_,gid,x,y,w,h,fill,a=255,stroke=None,sw=0.6):
        st=f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        s_.g(gid).append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{fill}" fill-opacity="{a/255:.3f}"{st}/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); ImageDraw.Draw(ov).rectangle([x*s,y*s,(x+w)*s,(y+h)*s],fill=(None if fill=="none" else hexrgb(fill,a)),outline=(hexrgb(stroke) if stroke else None),width=max(1,round(sw*s))); s_.cv=Image.alpha_composite(s_.cv,ov)
    def line(s_,gid,x1,y1,x2,y2,st=RED,sw=1.0,a=255):
        s_.g(gid).append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{st}" stroke-width="{sw}" stroke-opacity="{a/255:.3f}"/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); ImageDraw.Draw(ov).line([(x1*s,y1*s),(x2*s,y2*s)],fill=hexrgb(st,a),width=max(1,round(sw*s))); s_.cv=Image.alpha_composite(s_.cv,ov)
    def circle(s_,gid,cx,cy,r,fill="none",stroke=INK,sw=0.8,a=255):
        st=f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        s_.g(gid).append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" fill-opacity="{a/255:.3f}"{st}/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); ImageDraw.Draw(ov).ellipse([(cx-r)*s,(cy-r)*s,(cx+r)*s,(cy+r)*s],fill=(None if fill=="none" else hexrgb(fill,a)),outline=(hexrgb(stroke) if stroke else None),width=max(1,round(sw*s))); s_.cv=Image.alpha_composite(s_.cv,ov)
    def poly(s_,gid,pts,fill="none",stroke=INK,sw=0.8,closed=True,a=255):
        ps=" ".join(f"{x:.2f},{y:.2f}" for x,y in pts)
        tag="polygon" if closed else "polyline"
        st=f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"' if stroke else ""
        s_.g(gid).append(f'<{tag} points="{ps}" fill="{fill}" fill-opacity="{a/255:.3f}"{st}/>')
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); dd=ImageDraw.Draw(ov); spx=[(x*s,y*s) for x,y in pts]
        if fill!="none": dd.polygon(spx,fill=hexrgb(fill,a),outline=(hexrgb(stroke) if stroke else None))
        if stroke:
            seg=spx+([spx[0]] if closed else []); dd.line(seg,fill=hexrgb(stroke,a),width=max(1,round(sw*s)),joint="curve")
        s_.cv=Image.alpha_composite(s_.cv,ov)
    def _cover(s_,path,wp,hp,av=0.5,ah=0.5):
        im=Image.open(path).convert("RGB"); iw,ih=im.size; sc=max(wp/iw,hp/ih); nw,nh=max(1,round(iw*sc)),max(1,round(ih*sc)); im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-wp)*ah); t=round((nh-hp)*av); return im.crop((l,t,l+wp,t+hp))
    def img(s_,gid,x,y,w,h,path,href,av=0.5,ah=0.5):
        s_._n+=1; cid=f"clip{s_._n}"; pa={0.5:"xMidYMid",0.0:"xMidYMin",1.0:"xMidYMax"}.get(av,"xMidYMid")
        s_.defs.append(f'<clipPath id="{cid}"><rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}"/></clipPath>')
        s_.g(gid).append(f'<image x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" href="{href}" preserveAspectRatio="{pa} slice" clip-path="url(#{cid})"/>')
        s_.cv.alpha_composite(s_._cover(path,round(w*s),round(h*s),av,ah).convert("RGBA"),(round(x*s),round(y*s))); s_.imgs.append((x,y,w,h))
    def logo(s_,gid,cx,cy,mw,mh,path):
        im=Image.open(path).convert("RGBA")
        import numpy as _np  # aparar padding transparente/branco -> normalização óptica por tinta real
        a=_np.asarray(im); al=a[:,:,3]
        mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
        ys,xs=_np.where(mask)
        if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
        iw,ih=im.size; ar=iw/ih; w=mw; h=w/ar
        if h>mh: h=mh; w=h*ar
        x=cx-w/2; y=cy-h/2; s_.cv.alpha_composite(im.resize((max(1,round(w*s)),max(1,round(h*s))),Image.LANCZOS),(round(x*s),round(y*s)))
    def ph(s_,gid,x,y,w,h,lab,cap):  # placeholder de imagem externa (rights-pending / a embeber após aprovação)
        s_.rect(gid,x,y,w,h,PLACE);
        d=ImageDraw.Draw(s_.cv); d.line([x*s,y*s,(x+w)*s,(y+h)*s],fill=hexrgb(PLACLN),width=1); d.line([(x+w)*s,y*s,x*s,(y+h)*s],fill=hexrgb(PLACLN),width=1)
        s_.g(gid).append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{PLACE}"/>')
        s_.text(gid,x+w/2,y+h/2-2,lab,"u",6,INK5,"middle",wt=600)
        s_.text(gid,x+3,y+h+7,cap,"u",4.6,INK5)
    def text(s_,gid,x,y,t,c,fs,fill=INK,a="start",ls=None,wt=None):
        e=""
        if ls: e+=f' letter-spacing="{ls}"'
        if c in("di","si"): e+=' font-style="italic"'
        if wt: e+=f' font-weight="{wt}"'
        if c=="sm": e+=' font-weight="500"'
        s_.g(gid).append(f'<text x="{x:.2f}" y="{y:.2f}" font-family="{FAM[c]},serif" font-size="{fs}" fill="{fill}" text-anchor="{a}"{e}>{t.replace("&","&amp;").replace("<","&lt;")}</text>')
        _w=tw(t,c,fs); _x0=x if a=="start" else (x-_w/2 if a=="middle" else x-_w); s_.txts.append((_x0,y-fs*0.74,_x0+_w,y+fs*0.12,t))
        fpx=max(4,round(fs*s)); ft=s_.pf(c,fpx,wt or (500 if c=="sm" else None)); col=hexrgb(fill); ha={"start":"l","middle":"m","end":"r"}[a]
        ov=Image.new("RGBA",s_.cv.size,(0,0,0,0)); dd=ImageDraw.Draw(ov)
        if ls:
            lsp=ls*s; ch=list(t); ws=[ft.getlength(k) for k in ch]; tot=sum(ws)+lsp*(len(ch)-1); cx=x*s if a=="start" else (x*s-tot/2 if a=="middle" else x*s-tot)
            for k,w in zip(ch,ws): dd.text((cx,y*s),k,font=ft,fill=col,anchor="ls"); cx+=w+lsp
        else: dd.text((x*s,y*s),t,font=ft,fill=col,anchor=ha+"s")
        s_.cv=Image.alpha_composite(s_.cv,ov)
    def wrap(s_,t,c,fs,maxw):
        out=[]
        for pg in t.split("\n"):
            ln=""
            for w in pg.split():
                tr=(ln+" "+w).strip()
                if tw(tr,c,fs)<=maxw or not ln: ln=tr
                else: out.append(ln); ln=w
            out.append(ln)
        return out
    def para(s_,gid,x,y,t,c,fs,lh,maxw,fill=INK):
        yy=y
        for ln in s_.wrap(t,c,fs,maxw): s_.text(gid,x,yy,ln,c,fs,fill); yy+=lh
        return yy
    def fit(s_,gid,x,y,t,c,maxfs,maxw,fill=INK,wt=None):
        fs=maxfs
        while tw(t,c,fs)>maxw and fs>6: fs-=0.4
        s_.text(gid,x,y,t,c,fs,fill,wt=wt); return fs
    def save(s_,name):
        body="".join(f'<g id="{g}">'+"".join(s_.groups[g])+"</g>" for g in s_.order)
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{AW}mm" height="{AH}mm" viewBox="0 0 {AW} {AH}"><defs>{"".join(s_.defs)}</defs>{body}</svg>'
        open(f"{OUT}/{name}.svg","w").write(svg); s_.cv.convert("RGB").save(f"{OUT}/{name}.png")

# tamanhos (mm) a partir de pt do DS
T_TITLE=90*PT; T_INIT=40*PT; T_SUB=27*PT; T_BODY=20*PT; T_LEG=15*PT; T_EYE=10*PT; T_META=13*PT
LH=T_BODY*1.28
c=C()
c.rect("bg",0,0,AW,AH,MARF)
P601=f"{ASSETDIR}/assets/MM202601_procissao.jpg"; A601="assets/MM202601_procissao.jpg"
P608=f"{ASSETDIR}/assets/MM202608_contexto.png"; A608="assets/MM202608_contexto.png"
P603=f"{ASSETDIR}/assets/MM202603_pessoas.jpg"; A603="assets/MM202603_pessoas.jpg"
PHOJE=f"{ASSETDIR}/assets/milreu-hoje.jpg"; AHOJE="assets/milreu-hoje.jpg"
PESC=f"{ASSETDIR}/assets/circuito/oficina_escavacao.jpg"; AESC="assets/circuito/oficina_escavacao.jpg"
PEST=f"{ASSETDIR}/assets/circuito/oficina_estratigrafia.jpg"; AEST="assets/circuito/oficina_estratigrafia.jpg"
PMOS=f"{ASSETDIR}/assets/circuito/oficina_mosaico.jpg"; AMOS="assets/circuito/oficina_mosaico.jpg"
PHAU=f"{ASSETDIR}/assets/MM202613_hauschild.png"; AHAU="assets/MM202613_hauschild.png"
PCTX=f"{ASSETDIR}/assets/MM202608_ctx.jpg"; ACTX="assets/MM202608_ctx.jpg"
LOGODIR=_os.path.join(_REPO,"public","media","exhibition","updated","logos")

# ---------- CABEÇALHO (limpo) ----------
c.text("header",M,58,"ARQUEOLOGIA PÚBLICA E COMUNITÁRIA · RUÍNAS ROMANAS DE MILREU · ESTOI, FARO","u",T_EYE,RED,ls=0.9,wt=600)
c.line("header",M,68,M+150,68,RED,1.4)
c.fit("header",M,120,"Projecto Comunitário de Milreu","d",T_TITLE,CW*0.74,INK,wt=600)
c.para("header",M,150,"Memória, participação, educação e acesso público ao património arqueológico","s",T_META,T_META*1.3,CW*0.66,INK7)
c.text("header",AW-M,108,"Fernando Rodrigues de Jácomo","u",T_META*0.92,INK,"end",wt=600)
c.text("header",AW-M,121,"Doutoramento em Arqueologia · Universidade do Algarve","u",T_META*0.86,INK5,"end")
c.line("header",M,176,AW-M,176,KEY,0.6)

# ---------- CONTEXTO (texto na coluna esquerda; foto histórica na coluna direita — sem colisão) ----------
LWc=CW*0.55
c.text("context",M,205,"O Projecto Comunitário de Milreu","d",T_SUB,INK,wt=600)
yb=c.para("context",M,228,"O Projecto Comunitário de Milreu é um programa plurianual de investigação, participação e acesso público enquadrado na Arqueologia Pública e Comunitária e associado às Ruínas Romanas de Milreu, em Estoi, no concelho de Faro. Desenvolvido no âmbito do doutoramento em Arqueologia da Universidade do Algarve, funciona como uma estrutura guarda-chuva para iniciativas autónomas mas relacionadas. O projecto procura criar relações mais abertas entre património, produção de conhecimento e sociedade, articulando investigação, memória, participação, educação e acesso público.","s",T_BODY,T_BODY*1.36,LWc,INK7)
c.text("context",M,yb+14,"Do diagnóstico à intervenção","d",T_SUB*0.82,INK,wt=600)
yc=c.para("context",M,yb+32,"O diagnóstico de 2024 evidenciou distanciamento, fragilidades de comunicação e uma relação pouco activa entre parte da população e Milreu. A auscultação de 2026, ainda em curso, acrescenta uma direcção importante: entre os não visitantes deste recorte, não visitar Milreu não equivale necessariamente a desinteresse pela Arqueologia. Surgem sinais de valorização do património local, da memória colectiva e da educação, interesse por experiências práticas e, simultaneamente, uma percepção de distância entre o trabalho académico e a comunidade.","s",T_BODY,T_BODY*1.36,LWc,INK7)
# destaque tipográfico discreto (pull-quote — não card/slogan)
yc=c.para("context",M,yc+6,"Não visitar Milreu não significa necessariamente desinteresse pela Arqueologia.","di",T_SUB*0.62,T_SUB*0.62*1.18,LWc,INK)
# foto histórica de contexto (coluna direita própria)
pxx=M+CW*0.60; pw=CW*0.40; pyy=200; phh=(yc-6)-pyy
c.img("context_photo",pxx,pyy,pw,phh,PCTX,ACTX,av=0.62)
c.text("context_photo",pxx,yc+2,"Ruínas Romanas de Milreu · fotografia histórica (ruína, figura, bicicleta).","si",T_LEG,INK5)

# ---------- METODOLOGIA / ENQUADRAMENTO (faixa editorial baixa; 2 entradas; sem cards) ----------
my=yc+16
c.line("method",M,my,AW-M,my,KEY,0.6)
cwm=(CW-44)/2; cxb=M+cwm+44
c.text("method",M,my+13,"Metodologia","d",T_SUB*0.64,INK,wt=600)
m1=c.para("method",M,my+27,"Metodologicamente, o projecto articula métodos quantitativos e qualitativos — inquéritos, entrevistas e auscultação de públicos — com pesquisa documental, curadoria participativa e desenvolvimento iterativo de dispositivos de mediação. A perspectiva da Arqueologia Pública e Comunitária orienta a passagem do diagnóstico para a intervenção, procurando aproximar produção de conhecimento, memória local, participação e acesso público.","s",T_BODY*0.9,T_BODY*0.9*1.3,cwm,INK7)
c.text("method",cxb,my+13,"O que entendemos por Arqueologia Pública e Comunitária?","d",T_SUB*0.64,INK,wt=600)
m2=c.para("method",cxb,my+27,"A Arqueologia Pública trabalha as relações entre arqueologia e sociedade, ampliando comunicação, acesso e participação. A Arqueologia Comunitária aprofunda essa relação ao envolver comunidades, memórias, interesses e conhecimentos locais nos processos de interpretação, construção e devolução pública do conhecimento arqueológico.","s",T_BODY*0.9,T_BODY*0.9*1.3,cwm,INK7)
mb=max(m1,m2)

# ---------- TRANSIÇÃO ----------
yt=mb+10
c.line("transition",M,yt,AW-M,yt,KEY,0.6)
c.text("transition",M,yt+14,"INICIATIVAS EM DESENVOLVIMENTO · 2026","u",T_EYE*1.05,RED,ls=1.2,wt=600)
c.text("transition",M,yt+29,"Em 2026, duas iniciativas concentram parte importante da implementação pública do programa.","s",T_META,INK5)

# ---------- INICIATIVA 1 — ENTRE RUÍNAS E MEMÓRIAS (foto reequilibrada) ----------
y1=yt+30
# fotos: 1 dominante + 2 secundárias (sem sobreposição)
# dominante = equipa Hauschild (destaque nas pessoas, em baixo -> âncora para o fundo)
c.img("i1_photos",M,y1,CW*0.44,132,PHAU,AHAU,av=0.72)
c.text("i1_photos",M,y1+142,"Theodor Hauschild e equipa de escavadores, Milreu · ca. 1981 · col. M. L. Mendes Martins.","si",T_LEG*0.82,INK5)
sw=(CW*0.44-12)/2
# secundárias: Festa da Pinha (subir -> âncora topo) + Achados (subir, não cortar rostos)
c.img("i1_photos",M,y1+150,sw,78,P601,A601,av=0.24)
c.img("i1_photos",M+sw+12,y1+150,sw,78,P603,A603,av=0.20)
c.text("i1_photos",M,y1+238,"Cortejo da Festa da Pinha, Estoi · 1909 · ANTT / Foto Artística Samorrinha.","si",T_LEG*0.72,INK5)
c.text("i1_photos",M+sw+12,y1+238,"Achados romanos · 1966-67 · Aldeia de Estoi, Cultura e Património.","si",T_LEG*0.72,INK5)
# texto direita
tx=M+CW*0.44+22; twd=AW-M-tx
c.text("i1_text",tx,y1+6,"1 · INICIATIVA","u",T_EYE*0.95,RED,ls=1.0,wt=600)
c.fit("i1_text",tx,y1+28,"Entre Ruínas e Memórias","d",T_INIT,twd,INK,wt=600)
c.text("i1_text",tx,y1+43,"Museu comunitário de Milreu","si",T_META,INK7)
yq=c.para("i1_text",tx,y1+62,"Entre Ruínas e Memórias é um museu dedicado às relações construídas entre pessoas, comunidade, paisagem e as Ruínas Romanas de Milreu ao longo do tempo. Parte do reconhecimento de que a investigação científica e a musealização do sítio não garantem, por si só, que memórias familiares, sociais, afectivas e quotidianas permaneçam visíveis ou acessíveis. A proposta procura reunir, documentar, interpretar e devolver publicamente parte dessas relações, reconhecendo a comunidade não apenas como público, mas também como produtora de memória e significado patrimonial.","s",T_BODY,LH,twd,INK7)
c.text("i1_text",tx,yq+6,"Da memória documentada à circulação pública","d",T_SUB*0.72,INK,wt=600)
yq=c.para("i1_text",tx,yq+22,"Em 2026, o museu concretiza-se através de uma componente física itinerante e de uma componente digital. A exposição Entre Ruínas e Memórias, estruturada em 12 painéis, articula fotografias, documentação, testemunhos e interpretação contemporânea para apresentar diferentes formas de relação com Milreu. A itinerância procura levar estes conteúdos a diferentes públicos e lugares, enquanto a componente digital assegura continuidade de acesso para além do tempo e do espaço de cada mostra.","s",T_BODY,LH,twd,INK7)
c.para("i1_text",tx,yq+6,"Processo: pesquisa e reunião documental, selecção curatorial, tratamento de imagens, construção da narrativa, desenho dos painéis, componente digital e preparação para a circulação itinerante.","si",T_BODY*0.86,LH*0.86,twd,INK5)

# ---------- INICIATIVA 2 — CIRCUITO EDUCATIVO (mais presença) ----------
y2=max(y1+232, yq+22)+8
c.line("i2",M,y2,AW-M,y2,KEY,0.6)
c.text("i2_text",M,y2+16,"2 · INICIATIVA","u",T_EYE*0.95,RED,ls=1.0,wt=600)
c.fit("i2_text",M,y2+42,"Circuito Educativo de Milreu","d",T_INIT,CW*0.52,INK,wt=600)
c.text("i2_text",M,y2+58,"em desenvolvimento · 2026","u",T_EYE,RED,wt=600)
yy=c.para("i2_text",M,y2+78,"O Circuito Educativo de Milreu é uma iniciativa destinada a transformar conhecimento arqueológico, recursos e narrativas produzidos pelo projecto em experiências de aprendizagem. Dirige-se sobretudo a escolas, professores, estudantes e visitantes e procura aproximar os participantes não apenas dos resultados da arqueologia, mas também dos processos através dos quais o conhecimento arqueológico é construído. A proposta articula actividades pedagógicas e percursos interpretativos capazes de relacionar sítio, cultura material, investigação e participação, criando novas formas de aproximação às Ruínas Romanas de Milreu.","s",T_BODY,LH,CW*0.50,INK7)
licb=c.para("i2_text",M,yy+8,"Entre as actividades actualmente em estudo encontram-se propostas relacionadas com estratigrafia, simulação de escavação arqueológica e produção de mosaicos, acompanhadas por recursos de interpretação e apoio pedagógico. O circuito encontra-se em fase de concepção e desenvolvimento; estas actividades são propostas em preparação, não experiências já realizadas.","s",T_BODY,LH,CW*0.50,INK7)
# ===== Circuito: FAIXA GRÁFICA EDITORIAL (abstracta; sem ilustração/ícones/ferramentas/pessoas/setas) =====
ex=M+CW*0.52+18; ew=AW-M-ex
c.text("i2_schemes",ex,y2+16,"Actividades em estudo","d",T_SUB*0.66,INK,wt=600)
fy=c.para("i2_schemes",ex,y2+30,"O circuito prevê actividades práticas através das quais crianças e adolescentes poderão experimentar processos associados à produção do conhecimento arqueológico.","s",T_BODY*0.9,T_BODY*0.9*1.3,ew,INK7)
# --- UMA faixa gráfica unificada: três linguagens visuais (grelha · camadas · tesselas) ---
bt=fy+12; bh=92.0
w1=ew*0.37; w2=ew*0.30; w3=ew-w1-w2
x1=ex; x2=ex+w1; x3=ex+w1+w2
# 1 · ESCAVAÇÃO — grelha arqueológica (quadrícula + células destacadas + marcas de registo)
c.rect("i2_schemes",x1,bt,w1,bh,CAMPO)
gcs=bh/6.0; gnc=max(6,round(w1/gcs)); gcw=w1/gnc
for (cc,rr) in [(1,1),(3,2),(4,4),(2,3),(0,4)]:
    if cc<gnc: c.rect("i2_schemes",x1+cc*gcw,bt+rr*gcs,gcw,gcs,HAIR)
for i in range(gnc+1): c.line("i2_schemes",x1+i*gcw,bt,x1+i*gcw,bt+bh,KEY,0.55,190)
for j in range(7): c.line("i2_schemes",x1,bt+j*gcs,x1+w1,bt+j*gcs,KEY,0.55,190)
for i in range(gnc+1): c.line("i2_schemes",x1+i*gcw,bt-4,x1+i*gcw,bt,INK5,0.8)
for j in range(7): c.line("i2_schemes",x1-4,bt+j*gcs,x1,bt+j*gcs,INK5,0.8)
# 2 · ESTRATIGRAFIA — camadas de espessuras diferentes + corte/interrupção
tones=[CAMPO,HAIR,KEY,INK3,BROWN]; fr=[0.16,0.22,0.17,0.27,0.18]
cutx=x2+w2*0.60; off=bh*0.07
ya=bt
for t_,f_ in zip(tones,fr): c.rect("i2_schemes",x2,ya,cutx-x2,bh*f_,t_); ya+=bh*f_
c.rect("i2_schemes",cutx,bt,x2+w2-cutx,off,CAMPO)
ya=bt+off
for t_,f_ in zip(tones,fr):
    hh=bh*f_
    if ya+hh>bt+bh: hh=bt+bh-ya
    if hh>0: c.rect("i2_schemes",cutx,ya,x2+w2-cutx,hh,t_)
    ya+=bh*f_
ya=bt
for f_ in fr[:-1]:
    ya+=bh*f_; c.line("i2_schemes",x2,ya,cutx,ya,MARF,0.6)
c.line("i2_schemes",cutx,bt,cutx,bt+bh,INK,1.3)
# 3 · MOSAICOS — malha de tesselas parcialmente preenchida (paleta DS; vermelho só acento)
ts=bh/11.0; mnc=int(w3//ts); mny=11; FCx=max(3,int(mnc*0.55))
for ry in range(mny):
    for cx_ in range(mnc):
        xx=x3+cx_*ts; yy=bt+ry*ts
        if cx_<FCx:
            if cx_==0 or ry==0 or ry==mny-1 or cx_==FCx-1: col=INK7
            elif cx_==ry or cx_==(FCx-1-ry): col=RED
            elif (cx_+ry)%2==0: col=BROWN
            else: col=HAIR
            c.rect("i2_schemes",xx,yy,ts,ts,col,stroke=MARF,sw=0.5)
        else:
            c.rect("i2_schemes",xx,yy,ts,ts,"none",stroke=KEY,sw=0.4,a=180)
# UNIDADE: faixa horizontal (regra topo+base a toda a largura) + separadores leves — não caixas/cards
c.line("i2_schemes",x2,bt+bh*0.08,x2,bt+bh*0.92,KEY,0.5,150)
c.line("i2_schemes",x3,bt+bh*0.08,x3,bt+bh*0.92,KEY,0.5,150)
c.line("i2_schemes",ex,bt,ex+ew,bt,INK7,0.8)
c.line("i2_schemes",ex,bt+bh,ex+ew,bt+bh,INK7,1.1)
# --- legendas (texto protagonista), alinhadas aos três motivos ---
cy=bt+bh+11
def cap(x,w,ti,de):
    c.text("i2_schemes",x,cy,ti,"sm",T_LEG*0.98,INK,wt=600)
    return c.para("i2_schemes",x,cy+6.8,de,"s",T_LEG*0.85,T_LEG*0.85*1.32,w-6,INK7)
cb=max(cap(x1,w1,"Oficina de escavação simulada","Experimentação de escavação, registo e identificação de achados num ambiente pedagógico controlado."),
       cap(x2,w2,"Oficina de estratigrafia","Leitura de camadas, deposições e relações entre contextos para compreender sequências arqueológicas."),
       cap(x3,w3,"Oficina de mosaicos","Experimentação de técnicas de composição com tesselas e padrões inspirados na cultura material romana."))
c.text("i2_schemes",ex,cb+9,"Representação gráfica conceptual de actividades em desenvolvimento; não corresponde a oficinas já realizadas.","si",T_LEG*0.76,INK5)

# ---------- DESENVOLVIMENTO EM 2026 (faixa única, 2 entradas) ----------
# y3 derivado do fundo real das duas colunas do Circuito (sem vazio fixo) + gap de secção consistente
y3=max(licb, cb+9+6)+16
c.line("dev",M,y3,AW-M,y3,KEY,0.6)
c.text("dev",M,y3+15,"DESENVOLVIMENTO EM 2026","u",T_EYE*1.05,RED,ls=1.2,wt=600)
half=(CW-40)/2
c.rect("dev",M,y3+34-4.4,1.5,6.0,RED)
c.text("dev",M+6,y3+34,"Entre Ruínas e Memórias","sm",T_META*1.04,INK,wt=600)
d1=c.para("dev",M+6,y3+46,"O trabalho envolve pesquisa documental, selecção e tratamento curatorial de imagens e testemunhos, construção da narrativa expositiva, desenvolvimento dos painéis físicos e preparação da componente digital e da circulação itinerante.","s",T_BODY*0.9,LH*0.9,half-6,INK7)
c.rect("dev",M+half+40,y3+34-4.4,1.5,6.0,RED)
c.text("dev",M+half+46,y3+34,"Circuito Educativo","sm",T_META*1.04,INK,wt=600)
d2=c.para("dev",M+half+46,y3+46,"O desenvolvimento inclui a definição das actividades, a produção e selecção de recursos pedagógicos, o desenho dos percursos interpretativos e a preparação das condições necessárias para experimentação e futura utilização com públicos educativos.","s",T_BODY*0.9,LH*0.9,half-6,INK7)

# ---------- CONTINUIDADE ----------
y4=max(d1,d2)+16
c.text("cont",M,y4,"Próximos passos","d",T_SUB*0.82,INK,wt=600)
c.para("cont",M,y4+17,"A próxima fase combina a circulação de Entre Ruínas e Memórias, a consolidação da componente digital e o desenvolvimento do Circuito Educativo. A implementação permitirá ampliar o acesso público aos conteúdos produzidos pelo projecto, aproximar as iniciativas de diferentes comunidades e contextos educativos e recolher experiência prática que possa orientar novas iterações do programa.","s",T_BODY,LH,CW*0.94,INK7)

# ---------- RODAPÉ (parceria explícita + créditos + logótipos) ----------
fy=AH-18
# Identificador programático 2026 — enquadramento editorial, NÃO logótipo/parceiro (acima da parceria, abaixo da marca)
c.text("partner",M,fy-108,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",T_EYE*0.92,KEY,ls=1.4,wt=700)
c.text("partner",M,fy-100,"Museu itinerante «Entre Ruínas e Memórias» · Circuito Educativo","si",T_META*0.95,INK7)
# Parceria e apoio — informação textual legível (os logos NÃO substituem esta informação)
c.text("partner",M,fy-88,"Parceria e apoio","d",T_SUB*0.62,INK,wt=600)
c.para("partner",M,fy-78,"O desenvolvimento das iniciativas conta com a parceria da Associação dos Amigos do Museu do Lyceu de Faro (AMLF) / Museu do Lyceu de Faro e com apoio financeiro parcial da CCDR Algarve.","s",T_META*0.95,T_META*0.95*1.3,CW*0.80,INK7)
# fila de logótipos dos parceiros (dos painéis, excepto gráfica)
LOGOS=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png",
       "Milreu_policromatico.png","logo-ualg-completo.png"]
c.text("logos",M,fy-54,"APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS","u",T_EYE*0.9,INK5,ls=1.0,wt=600)
# escala + espaçamento uniformes: altura-cap comum (tinta real aparada) e GAPS iguais, linha centrada
LOGO_H=12.5; LOGO_CY=fy-39
import numpy as _np
_lg=[]
for fn in LOGOS:
    p=os.path.join(LOGODIR,fn)
    if not os.path.exists(p): continue
    im=Image.open(p).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    _lg.append((im,LOGO_H*im.size[0]/im.size[1]))
_tw=sum(w for _,w in _lg); _gap=0.6*LOGO_H; _rw=_tw+_gap*(len(_lg)-1); _x=M  # alinhado à esquerda; gap = proporção do trio
import io as _io, base64 as _b64
for im,w in _lg:
    _yy=LOGO_CY-LOGO_H/2
    c.cv.alpha_composite(im.resize((max(1,round(w*s)),max(1,round(LOGO_H*s))),Image.LANCZOS),(round(_x*s),round(_yy*s)))
    _bb=_io.BytesIO(); im.save(_bb,"PNG"); _d=_b64.b64encode(_bb.getvalue()).decode()
    c.g("logos").append(f'<image x="{_x:.2f}" y="{_yy:.2f}" width="{w:.2f}" height="{LOGO_H:.2f}" href="data:image/png;base64,{_d}"/>')
    _x+=w+_gap
c.line("footer",M,fy-26,AW-M,fy-26,KEY,0.6)
c.text("footer",M,fy-16,"Responsabilidade e curadoria: Fernando Rodrigues de Jácomo · Enquadramento académico: Doutoramento em Arqueologia, Universidade do Algarve.","s",T_META*0.9,INK7)
c.text("footer",M,fy-5,"© 2026 Fernando Rodrigues de Jácomo · Projecto Comunitário de Milreu · PROVA VISUAL — QR e formato do congresso por confirmar.","u",T_LEG*0.82,INK3)

# ---------- VERIFICAÇÃO AUTOMÁTICA DE COLISÕES texto/foto ----------
def _ov(a,b): return not (a[2]<=b[0]+0.5 or b[2]<=a[0]+0.5 or a[3]<=b[1]+0.5 or b[3]<=a[1]+0.5)
col=[]
for (tx0,ty0,tx1,ty1,tt) in c.txts:
    for (ix,iy,iw,ih) in c.imgs:
        if _ov((tx0,ty0,tx1,ty1),(ix,iy,ix+iw,iy+ih)): col.append((tt[:34],round(ix),round(iy)))
print("COLISOES texto/foto:",len(col))
for cc in col[:10]: print("   !",cc)
c.save("poster_congresso_PROVA_VISUAL_v9")
th=c.cv.convert("RGB"); th.thumbnail((560,560)); th.save(f"{OUT}/THUMBNAIL_v9.png")
print("proof v2 ok", c.cv.size, "| y2",round(y2), "y3",round(y3), "y4",round(y4), "fy",round(fy), "| imgs",len(c.imgs),"txts",len(c.txts))
